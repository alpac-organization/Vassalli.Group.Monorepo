# Plan: coordenadas de posiciones en racks

## Objetivo

Al crear racks, registrar coordenadas de cada posición (polín) con el mismo patrón que tramos, sin tocar backend.

Distribución según imagen y constantes:

```
Rack 2.44 m (largo)
├── position 1 → 1.22 m
└── position 2 → 1.22 m
```

Las 2 posiciones se apilan **a lo largo del largo** del rack (`length`), no lado a lado en el ancho.

---

## Fuera de alcance

- Cambios en backend
- Stacking / PATCH
- Refactors grandes en `PositionShape` de tramos
- Re-registro de coordenadas si ya existen (evitar bug Y/Z ← X en update)

---

## Archivos a tocar (mínimo)

| # | Archivo | Acción |
|---|---------|--------|
| 1 | `ui/utils/warehouse-config.ts` | Agregar constantes de rack |
| 2 | `ui/pages/racks/.../utils/build-rack-positions.utils.ts` | **Nuevo** — calcular coords locales |
| 3 | `ui/pages/racks/.../rack-create-form.tsx` | Post-create: GetPositions → RegisterCoordinates |
| 4 | `ui/pages/warehouses/components/position-shape/position-shape.utils.ts` | Rack: dibujar celdas a lo largo del **largo** (1.22+1.22) |

**No tocar:** contratos, `useSection`, `SectionService`, backend, lot-modal.

---

## 1. Constantes (`warehouse-config.ts`)

Hoy no existen en disco; se agregan junto a las de polín:

```ts
/** Largo estándar de un rack (metros). */
export const RACK_LENGTH_METER = 2.44;
/** Posiciones por rack (apiladas a lo largo del largo). */
export const RACK_POSITIONS_PER_RACK = 2;
/** Largo de cada posición dentro del rack (metros): 2.44 / 2. */
export const RACK_POSITION_LENGTH_METER =
  RACK_LENGTH_METER / RACK_POSITIONS_PER_RACK; // 1.22
```

Uso:

- Builder: tamaño de celda en Y (largo)
- Validación suave: `max_pulleys` esperado = `RACK_POSITIONS_PER_RACK` (2)
- Fallback visual si `length` viene vacío → `2.44`

---

## 2. Builder nuevo (`build-rack-positions.utils.ts`)

Ubicación:

`ui/pages/racks/components/rack-modal/utils/build-rack-positions.utils.ts`

### Regla de coordenadas (espacio local del rack)

| Eje | Valor |
|-----|--------|
| `position_x` | centro del **ancho** del rack → `width / 2` |
| `position_y` | centro de cada segmento de **1.22 m** a lo largo del largo |
| `position_z` | `0` |
| `rotation_y` | `0` |

Con `max_pulleys = 2` y `length = 2.44`:

```
posición índice 0 → y = 0.61   (centro de [0 .. 1.22])
posición índice 1 → y = 1.83   (centro de [1.22 .. 2.44])
posición x        → width / 2
```

Si el form manda otro `max_pulleys` / `length`, generalizar:

```ts
positionLength = length / maxPulleys; // idealmente 2.44/2 = 1.22
position_y = (i + 0.5) * positionLength;
```

### Código propuesto

```ts
import {
  RACK_LENGTH_METER,
  RACK_POSITIONS_PER_RACK,
  RACK_POSITION_LENGTH_METER,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/warehouse-config";

export type BuildRackPositionsInput = {
  /** Ancho del rack (metros). */
  width: number;
  /** Largo del rack (metros). Default conceptual: RACK_LENGTH_METER. */
  length: number;
  /** Cantidad de polines/posiciones. Default conceptual: RACK_POSITIONS_PER_RACK. */
  maxPulleys: number;
};

export type RackPositionCoordinate = {
  position_x: number;
  position_y: number;
  position_z: number;
  rotation_y: number;
};

export type BuildRackPositionsResult = {
  fits: boolean;
  message: string;
  positionLength: number;
  positions: RackPositionCoordinate[];
};

const cellCenter = (index: number, size: number) =>
  Number((index * size + size / 2).toFixed(6));

/**
 * Posiciones apiladas a lo largo del largo del rack (imagen: 2 × 1.22 m en 2.44 m).
 * No usa footprint de polín; reparte `length / maxPulleys`.
 */
export const buildRackPositions = (
  input: BuildRackPositionsInput,
): BuildRackPositionsResult => {
  const { width, length, maxPulleys } = input;

  const hasValidInput =
    width > 0 &&
    length > 0 &&
    Number.isInteger(maxPulleys) &&
    maxPulleys >= 1;

  const positionLength = hasValidInput ? length / maxPulleys : 0;
  const centerX = hasValidInput ? width / 2 : 0;

  const positions = hasValidInput
    ? Array.from({ length: maxPulleys }, (_, index) => ({
        position_x: Number(centerX.toFixed(6)),
        position_y: cellCenter(index, positionLength),
        position_z: 0,
        rotation_y: 0,
      }))
    : [];

  const message = !hasValidInput
    ? "Indique ancho, largo y polines del rack para proyectar posiciones."
    : `${positions.length} posiciones a lo largo de ${length.toFixed(2)} m` +
      ` (cada una ${positionLength.toFixed(2)} m; ref. ${RACK_POSITION_LENGTH_METER} m).`;

  return {
    fits: hasValidInput,
    message,
    positionLength,
    positions,
  };
};
```

Referencia de constantes (para defaults / mensajes; el cálculo usa `length` y `maxPulleys` del form):

- `RACK_LENGTH_METER` = 2.44  
- `RACK_POSITIONS_PER_RACK` = 2  
- `RACK_POSITION_LENGTH_METER` = 1.22  

---

## 3. Cablear en `rack-create-form.tsx`

Espejo de `lot-modal.tsx` (create → diff GetPositions → POST coords con delay).

### Hooks

```ts
const { RegisterRacksBulk } = useRack();
const { RegisterCoordinates, GetPositions } = useSection();
```

### Secuencia en `onFormSubmit` (después de validar form)

```
1. GetPositions (before) → Set de block.id existentes
2. RegisterRacksBulk.mutateAsync(payload)   // igual que hoy
3. GetPositions (after)  → newRacks = blocks.filter(id ∉ existing)
4. buildRackPositions({ width, length, maxPulleys })
5. Por cada newRack (con delay 300 ms entre requests):
   RegisterCoordinates({
     target_type: CoordinateTargetTypeEnum.RackPositions.value, // 2
     rack_id: rack.id,
     rack_positions_information: rack.positions.map((pos, i) => ({
       rack_position_id: pos.id,
       ...buildResult.positions[i],
     })),
     lots_positions_information: [],
     // + company_id, module_code, warehouse_id, section_id
   })
6. Toast éxito + cerrar modal
```

### Payload ejemplo (`max_pulleys = 2`, `width = 1.07`, `length = 2.44`)

```json
{
  "warehouse_id": "...",
  "section_id": "...",
  "target_type": 2,
  "rack_id": "<nuevo-rack-id>",
  "rack_positions_information": [
    {
      "rack_position_id": "...",
      "position_x": 0.535,
      "position_y": 0.61,
      "position_z": 0,
      "rotation_y": 0
    },
    {
      "rack_position_id": "...",
      "position_x": 0.535,
      "position_y": 1.83,
      "position_z": 0,
      "rotation_y": 0
    }
  ],
  "lots_positions_information": []
}
```

### Cuidados

- Mapear por **índice** tras GetPositions (orden backend: Row/Column/Level). Si hay código `-N{level}P{col}`, preferir ordenar por `P` parseado.
- Solo primer insert (no reenviar si `coordinates != null`).
- Delay 300 ms entre racks (mismo que lots) para evitar 502.
- Si `newRacks.length === 0`: racks creados pero avisar que no hubo posiciones para coords.

### Qué **no** cambia en el form

- Steps, campos, `RegisterRacksBulk` payload (`quantity`, `row_number`, `level_number`, `max_pulleys`, dims, spacing, etc.)
- Solo se añade el bloque post-create de coordenadas

---

## 4. Visualización rack en `position-shape.utils.ts` (ajuste mínimo)

Hoy el branch `layout === "rack"` reparte celdas por **ancho** (`width / columns`). La imagen pide apilar por **largo**.

Cambio solo en el branch rack:

```ts
// Antes (lado a lado en ancho):
cellWidth  = containerWidth / totalColumns
cellDepth  = containerLength
offsetX    = (col - 1) * cellWidth
offsetY    = 0

// Después (apiladas en largo, como 1.22 + 1.22):
cellWidth  = containerWidthMeters          // todo el ancho
cellDepth  = containerLengthMeters / totalColumns  // 2.44 / 2 = 1.22
offsetX    = 0
offsetY    = (col - 1) * cellDepth
```

Con coordenadas registradas: seguir usando X/Y como centro y restar mitad de esa celda (mismo patrón que lots).

`RackShape` / `PositionShape` props: sin cambios de API; solo el cálculo interno del layout rack.

---

## Orden de implementación

1. Constantes en `warehouse-config.ts`
2. `build-rack-positions.utils.ts`
3. Post-create en `rack-create-form.tsx`
4. Ajuste visual rack en `position-shape.utils.ts`
5. Probar: crear 1–N racks → GetPositions con coords → viewer sin huecos (2 franjas de 1.22 en 2.44)

---

## Criterios de aceptación

- [ ] Crear rack con `length = 2.44`, `max_pulleys = 2` registra 2 coords
- [ ] `position_y` ≈ `0.61` y `1.83`; `position_x` ≈ `width / 2`
- [ ] Viewer muestra 2 celdas contiguas a lo largo del rack (sin usar medidas de polín)
- [ ] No se modifica backend ni contratos existentes
- [ ] Tramos / `build-lot-positions` sin cambios

---

## Riesgo conocido (backend, no se toca)

Si se vuelve a hacer POST de coords sobre posiciones que ya tienen coordenadas, el handler puede corromper Y/Z. Mitigación FE: solo registrar tras create cuando `coordinates == null`.
`}