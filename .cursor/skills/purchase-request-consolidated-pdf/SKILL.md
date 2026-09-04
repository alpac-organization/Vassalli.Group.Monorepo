---
name: purchase-request-consolidated-pdf
description: Implementa el PDF consolidado mensual de productos de solicitudes de compra (requisición, mensual o eventual). Usar cuando el usuario pida el consolidado de productos, purchase-request-consolidated-pdf, o el reporte mensual de requisiciones.
---

# Consolidado mensual de productos (solicitudes de compra)

Implementar un PDF que agrupa productos de **un mes** para **un tipo** de solicitud: Requisición, Mensual o Eventual.

No inventar endpoints. Reutilizar `PurchaseServices`, `@react-pdf/renderer` y el patrón de descarga del PDF individual.

## Objetivo

Dado mes + tipo de solicitud:

1. Obtener las solicitudes de ese tipo en el mes.
2. Cargar los productos de cada una.
3. Agrupar el mismo producto y sumar cantidades.
4. Generar PDF con `@react-pdf/renderer`.

## Contexto del código

### Tipos

| Tab | Enum | `value` | `textValue` |
|---|---|---|---|
| Requisiciones | `PurchaseRequestEnum.Requisition` | 1 | `Requisition` |
| Solicitudes Eventuales | `PurchaseRequestEnum.Eventual` | 2 | `Eventual` |
| Solicitudes Mensuales | `PurchaseRequestEnum.Monthly` | 3 | `Monthly` |

Fuente: `apps/erp-alpac-group/src/modules/purchasing/domain/enums/purchase-request.enum.ts`

El tipo de solicitud del tab activo **sí va en el PDF** (título y subtítulo). No mezclar tipos.

### APIs existentes (no crear nuevas)

- Listado: `GET /companies/{company_id}/modules/{module_code}/purchase-requests`
  - Payload: `GetPurchaseRequestPayload` (`request_type`, `status`, `branch_id`, `code`, paginación). **No tiene fechas.**
- Productos: `GET .../purchase-requests/{purchase_request_id}/products`
  - Respuesta: `PurchaseRequestProductInformationList`

Servicio: `PurchaseServices` + `warehouseHttpHandler` (igual que `usePurchase`).

Producto clave: `PurchaseRequestProductInformation`

- Agrupar por `product_details.product_id`
- Si no hay `product_id`, fallback: descripción normalizada (`trim` + lowercase)
- Sumar `quantity`
- Unidad: `unit_measure_information.symbol` o `.name`
- Nombre: `product_details.product_name` o `description`

### PDF individual (referencia visual y de descarga)

- Componente: `.../reports/purchase-request-pdf/purchase-request-pdf.tsx`
- Estilos: `purchase-request-pdf.styles.ts`
- Descarga: `PurchaseRequestDetailModal.handleGeneratePurchaseRequestPdf`
  - `pdf(<Component />).toBlob()` → `URL.createObjectURL` → `window.open`
  - Botón sky (`pdfButtonClass` + `FileTextIcon`)
  - Loader local `isGenerating...`

### Archivo destino (ya existe, vacío)

Implementar aquí, no crear otro PDF raíz:

`apps/erp-alpac-group/src/modules/purchasing/ui/pages/purchase-requests/components/reports/purchase-request-consolidated-pdf/purchase-request-consolidated-pdf.tsx`

## Estructura de archivos

Crear junto al PDF destino:

```
reports/purchase-request-consolidated-pdf/
  purchase-request-consolidated-pdf.tsx          # Document @react-pdf
  purchase-request-consolidated-pdf.styles.ts    # StyleSheet, reutilizar look del PDF individual
  types/purchase-request-consolidated-pdf.types.ts
  utils/build-consolidated-products.ts           # agrupación pura
  utils/fetch-consolidated-products.ts           # orquestación de APIs
  utils/format-consolidated-period.ts            # "Del 1 de Enero al 31 de Enero del 2025"
```

UI (un solo componente compartido, no copiar en 3 tabs):

```
components/purchase-request-consolidated-report/
  purchase-request-consolidated-report.tsx       # DatePicker mes + botón generar
  purchase-request-consolidated-report.types.ts
```

Insertar el componente en:

- `tabs/requisition-tab/requisition-tab.tsx`
- `tabs/monthly-materials-tab/monthly-materials-tab.tsx`
- `tabs/occasional-materials-tab/occasional-materials-tab.tsx`

Al lado del botón "Crear ...", pasando el `requestType` del tab.

## Punto de entrada (UI)

El reporte **se genera a partir de un botón** en cada tab. No desde el detalle de una solicitud.

Flujo:

1. En la tab hay un `DatePicker` de **tipo mes** (`views={['year', 'month']}`, `openTo="month"`, `format="MMMM YYYY"`).
2. El botón "Generar consolidado" queda **deshabilitado** hasta que haya un mes seleccionado.
3. Al generar, se usa el tipo de esa tab + el mes elegido.

Componente: `DatePicker` de `@alpac/design-system` (extiende MUI DatePicker; ya hay locale `es` en `DatePickerProvider`).

## Header del PDF (obligatorio)

En el encabezado, en este orden:

1. **Logo de la compañía** (`useCompanyStore().urlImage`), igual que el PDF individual.
2. Alias / nombre de la empresa.
3. Título `CONSOLIDADO MENSUAL DE {TIPO}`.
4. **Tipo de solicitud** visible: `Tipo de solicitud: Requisición | Mensual | Eventual`.
5. **Rango del mes** con este formato (ejemplo): `Del 1 de Enero al 30 de Enero del 2025`.

Reglas del rango:

- Primer día real del mes y último día real del mes (`dayjs.startOf/endOf('month')`).
- Meses en español con mayúscula (`Enero`, `Febrero`, ...).
- Plantilla: `Del {díaInicio} de {Mes} al {díaFin} de {Mes} del {año}`.

## Decisiones fijas

1. **Alcance:** un tipo por reporte (el del tab activo). No mezclar Requisición + Mensual + Eventual.
2. **Mes:** filtrar en cliente con `dayjs(request_date).isSame(selectedMonth, "month")`. No agregar `start_date`/`end_date` al payload salvo que el usuario confirme que el backend ya los acepta.
3. **Paginación del listado:** pedir `page_size` alto (ej. 200) y recorrer páginas (`page_number`) hasta cubrir `total`. No usar solo la página visible de la tabla (`PAGE_SIZE = 5`).
4. **Sucursal:** igual que las tabs. Admin: sin `branch_id`. Resto: `currentBranchId`.
5. **Estado por defecto:** `Approved` + `Finished`. No consolidar Cancelada/Rechazada por defecto.
6. **Productos:** llamar `GetPurchaseRequestProducts` por solicitud con `PurchaseServices` (no `useQuery` en loop). `Promise.all` en lotes de 5.
7. **Vacío:** si no hay solicitudes o productos del mes, toast/alert de error y no abrir PDF en blanco.
8. **Estilos UI:** mismas clases de botones/inputs de las tabs (`rounded-md!`, `text-[15px]!`). Botón de PDF: estilo sky del detalle.
9. **Logo:** siempre intentar pintar `urlImage` en el header. Si no hay URL, omitir la imagen sin romper el layout.

## Tipos

```ts
export interface ConsolidatedProductRow {
  productId: string;
  productName: string;
  unitSymbol: string;
  quantity: number;
  requestCount: number;
  requestCodes: string[];
}

export interface PurchaseRequestConsolidatedPdfProps {
  companyAlias: string;
  logoUrl: string | null;
  requestTypeLabel: string; // "Requisición" | "Mensual" | "Eventual"
  periodLabel: string;      // "Del 1 de Enero al 31 de Enero del 2025"
  rows: ConsolidatedProductRow[];
  totalQuantity: number;
  requestCount: number;
}
```

## Agrupación (`build-consolidated-products.ts`)

Función pura. Recibe solicitudes + mapa `purchase_request_id → productos`.

- Clave: `product_id` o `desc:${description.trim().toLowerCase()}`
- `quantity` sumada
- `requestCodes` únicos, ordenados
- `requestCount` = códigos únicos
- Orden final: `productName` locale `es`

## Fetch (`fetch-consolidated-products.ts`)

Usar `new PurchaseServices(warehouseHttpHandler)` (mismo import que `usePurchase`).

Pasos:

1. Listar todas las páginas con `request_type` del tab.
2. Filtrar por mes con `request_date` y por estado Approved/Finished.
3. Pedir productos de cada id restante.
4. Construir rows.
5. Devolver `{ rows, requestCount, totalQuantity }`.

Errores: relanzar; la UI usa `onRequestError` / `useMappedError` como el resto del módulo.

## PDF (`purchase-request-consolidated-pdf.tsx`)

Componente de presentación. **Sin fetch.** Recibe logo, alias, tipo y `periodLabel` por props.

Layout (LETTER, Helvetica, look del PDF de requisición):

1. Header: logo compañía, alias, título, tipo de solicitud, rango `Del 1 de Enero al 30 de Enero del 2025`.
2. Tabla:
   - CANTIDAD
   - DESCRIPCION DEL ARTICULO
   - UNIDAD
   - N° SOLICITUDES
3. Fila total: suma de cantidades + total de productos distintos.
4. Pie: "Generado:" fecha con `formatDate`.

Título según tipo:

- Requisición → `CONSOLIDADO MENSUAL DE REQUISICIONES`
- Mensual → `CONSOLIDADO MENSUAL DE SOLICITUDES MENSUALES`
- Eventual → `CONSOLIDADO MENSUAL DE SOLICITUDES EVENTUALES`

Estilos: copiar `purchaseRequestPdfStyle` y añadir `colUnit` / `colCount`. No importar estilos de nómina.

Descarga: igual que el PDF individual (`pdf(...).toBlob()` + `window.open`).

## Qué no hacer

- No crear endpoint nuevo ni campos de fecha en el payload sin confirmación.
- No reutilizar PDFs de nómina (`consolidated-area-report`).
- No generar el consolidado desde el modal de detalle de una sola solicitud.
- No mezclar tipos de solicitud.
- No dejar el archivo destino vacío: el `Document` vive en `purchase-request-consolidated-pdf.tsx`.
- No duplicar la orquestación en las 3 tabs.
- No generar si el DatePicker de mes está vacío.

## Checklist de implementación

```
- [ ] types + build-consolidated-products (función pura)
- [ ] format-consolidated-period ("Del 1 de Enero al 31 de Enero del 2025")
- [ ] fetch-consolidated-products (paginar listado + productos en lotes)
- [ ] PDF + styles: logo, tipo de solicitud, rango de fechas
- [ ] DatePicker tipo mes + botón generar (deshabilitado sin mes)
- [ ] Integrar en las 3 tabs con requestType correcto
- [ ] Permisos admin/manager
- [ ] Empty/error states
- [ ] Loader mientras genera
```

## Verificación

Sin browser tools, comprobar:

1. TypeScript del módulo purchasing sin errores en archivos nuevos.
2. Cada tab pasa su `PurchaseRequestEnum`.
3. Botón deshabilitado sin mes; con mes genera el PDF.
4. Header muestra logo, tipo y `Del {día} de {Mes} al {día} de {Mes} del {año}`.
5. Mismo `product_id` en dos solicitudes → una fila, cantidad sumada, `requestCount >= 2`.
6. Mes sin datos → mensaje, sin PDF vacío.
7. Operador no ve el botón ni el DatePicker.

## Orden de trabajo

1. Utils y types (sin UI).
2. PDF de presentación con rows mockeables.
3. Fetch real.
4. DatePicker mes + botón.
5. Cablear las 3 tabs.
