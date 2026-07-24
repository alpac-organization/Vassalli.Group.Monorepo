import {
  ANCHO_BORDE,
  ANCHO_MEDIO,
  COL1_LARGO,
  COL2_LARGO,
  COL3_LARGO,
  GALERON_LARGO,
  MARGIN,
  PASILLO_W,
  WAREHOUSE_WIDTH,
} from "../Constants/warehouse.properties";

interface RackFiscalProps {
  width: number;
  depth: number;
}

/** Altura del piso de tramo (TramoBox top ≈ 0.06) para asentar postes */
const FLOOR_Y = 0.06;

export function RackFiscal({ width, depth }: RackFiscalProps) {
  const POST_HEIGHT = 2.8;

  // Alturas de las vigas (relativas al piso del rack)
  const FIRST_LEVEL = 1.2;
  const SECOND_LEVEL = 2;

  const BEAM_H = 0.08;
  const POST_W = 0.09;

  const x = width / 2 - POST_W / 2;
  const z = depth / 2 - POST_W / 2;

  return (
    <group position={[0, FLOOR_Y, 0]}>
      {/* Postes — base en y=0 del group (= piso del tramo) */}
      {[-x, x].map((px) =>
        [-z, z].map((pz) => (
          <mesh
            key={`${px}-${pz}`}
            position={[px, POST_HEIGHT / 2, pz]}
            castShadow
          >
            <boxGeometry args={[POST_W, POST_HEIGHT, POST_W]} />
            <meshStandardMaterial color="#355c7d" />
          </mesh>
        )),
      )}
      {/* Niveles de vigas */}
      {[FIRST_LEVEL, SECOND_LEVEL].map((level) => (
        <group key={`level-${level}`}>
          <mesh position={[0, level, z]}>
            <boxGeometry args={[width, BEAM_H, BEAM_H]} />
            <meshStandardMaterial color="#f39c12" />
          </mesh>

          <mesh position={[0, level, -z]}>
            <boxGeometry args={[width, BEAM_H, BEAM_H]} />
            <meshStandardMaterial color="#f39c12" />
          </mesh>

          <mesh position={[-x, level, 0]}>
            <boxGeometry args={[BEAM_H, BEAM_H, depth]} />
            <meshStandardMaterial color="#f39c12" />
          </mesh>

          <mesh position={[x, level, 0]}>
            <boxGeometry args={[BEAM_H, BEAM_H, depth]} />
            <meshStandardMaterial color="#f39c12" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

interface Tramo {
  numero: number;
  ancho: number;
}

function buildColumna(numeros: number[]): Tramo[] {
  return numeros.map((numero, i) => ({
    numero,
    ancho: i === 0 || i === numeros.length - 1 ? ANCHO_BORDE : ANCHO_MEDIO,
  }));
}

const COL2_NUMS = [51, 52, 53, 54, 55, 56, 57, 58, 59, 60];
const COL3_NUMS = [70, 69, 68, 67, 66, 65, 64, 63, 62, 61];

export function Racks() {
  const bodegaStart = GALERON_LARGO;
  const zTramosStart = bodegaStart + MARGIN;

  // Misma lógica X que Bodega en Home.tsx (sin separación central)
  let cursorX = -WAREHOUSE_WIDTH / 2;
  cursorX += MARGIN;

  cursorX += COL1_LARGO;
  cursorX += PASILLO_W;
  const col2X = cursorX + COL2_LARGO / 2;
  cursorX += COL2_LARGO;

  const col3X = cursorX + COL3_LARGO / 2;

  // Margen lateral del rack dentro del tramo; se usa para pegar col2↔col3 al centro
  const RACK_INSET = 1.4;

  const columnas = [
    // { x: col1X, largo: COL1_LARGO, tramos: buildColumna(COL1_NUMS) },
    {
      x: col2X,
      // empuja hacia la derecha (hacia col3) para juntar espalda con espalda
      xOffset: RACK_INSET / 2,
      largo: COL2_LARGO,
      tramos: buildColumna(COL2_NUMS),
    },
    {
      x: col3X,
      // empuja hacia la izquierda (hacia col2)
      xOffset: -RACK_INSET / 2,
      largo: COL3_LARGO,
      tramos: buildColumna(COL3_NUMS),
    },
    // { x: col4X, largo: COL4_LARGO, tramos: buildColumna(COL4_NUMS) },
  ];

  return (
    <>
      {columnas.map((columna) => {
        let cursor = zTramosStart;

        return columna.tramos.map((tramo) => {
          const centerZ = cursor + tramo.ancho / 2;
          cursor += tramo.ancho;

          return (
            <group
              key={`${columna.x}-${tramo.numero}`}
              position={[columna.x + columna.xOffset, 0, centerZ]}
            >
              <RackFiscal
                width={columna.largo - RACK_INSET}
                depth={tramo.ancho - 0.1}
              />
            </group>
          );
        });
      })}
    </>
  );
}
