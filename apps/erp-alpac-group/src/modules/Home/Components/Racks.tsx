interface RackFiscalProps {
  width: number
  depth: number
}

const MARGIN = 0.6
const PASILLO_W = 4.4
const DIVIDER_W = 1.35

const COL1_LARGO = 8.85     // ancho (eje X) tramos T-41 a T-50
const COL2_LARGO = 4.75     // ancho (eje X) tramos T-51 a T-60
const COL3_LARGO = 4.75     // ancho (eje X) tramos T-61 a T-70
const COL4_LARGO = 8.85     // ancho (eje X) tramos T-71 a T-80

const GALERON_LARGO = 12.1  // profundidad del galerón (entrada)

// Ancho total calculado sumando columnas + pasillos + márgenes (ver nota arriba)
const WAREHOUSE_WIDTH =
  2 * MARGIN + COL1_LARGO + PASILLO_W + COL2_LARGO + DIVIDER_W + COL3_LARGO + PASILLO_W + COL4_LARGO

export function RackFiscal({ width, depth }: RackFiscalProps) {
  const POST_HEIGHT = 2.8

  // Alturas de las vigas
  const FIRST_LEVEL = 0.45 // elevado del piso
  const SECOND_LEVEL = 1.75

  const BEAM_H = 0.08
  const POST_W = 0.08

  const x = width / 2 - POST_W / 2
  const z = depth / 2 - POST_W / 2

  return (
    <group>
      {/* Postes */}
      {[-x, x].map(px =>
        [-z, z].map(pz => (
          <mesh
            key={`${px}-${pz}`}
            position={[px, POST_HEIGHT / 2, pz]}
            castShadow
          >
            <boxGeometry args={[POST_W, POST_HEIGHT, POST_W]} />
            <meshStandardMaterial color="#355c7d" />
          </mesh>
        ))
      )}

      {/* Primer nivel (NO en el piso) */}
      {[FIRST_LEVEL, SECOND_LEVEL].map(level => (
        <>
          <mesh
            key={`front-${level}`}
            position={[0, level, z]}
          >
            <boxGeometry args={[width, BEAM_H, BEAM_H]} />
            <meshStandardMaterial color="#f39c12" />
          </mesh>

          <mesh
            key={`back-${level}`}
            position={[0, level, -z]}
          >
            <boxGeometry args={[width, BEAM_H, BEAM_H]} />
            <meshStandardMaterial color="#f39c12" />
          </mesh>

          <mesh
            key={`left-${level}`}
            position={[-x, level, 0]}
          >
            <boxGeometry args={[BEAM_H, BEAM_H, depth]} />
            <meshStandardMaterial color="#f39c12" />
          </mesh>

          <mesh
            key={`right-${level}`}
            position={[x, level, 0]}
          >
            <boxGeometry args={[BEAM_H, BEAM_H, depth]} />
            <meshStandardMaterial color="#f39c12" />
          </mesh>
        </>
      ))}

      {/* Mercadería */}

      
    </group>
  )
}

const ANCHO_BORDE = 5.23    // profundidad (eje Z) del primer/último tramo de cada columna
const ANCHO_MEDIO = 6.0     // profundidad (eje Z) de los tramos intermedios


interface Tramo {
  numero: number
  ancho: number // profundidad en Z de ese tramo específico
}

function buildColumna(numeros: number[]): Tramo[] {
  return numeros.map((numero, i) => ({
    numero,
    ancho: i === 0 || i === numeros.length - 1 ? ANCHO_BORDE : ANCHO_MEDIO,
  }))
}

const COL1_NUMS = [50, 49, 48, 47, 46, 45, 44, 43, 42, 41]
const COL2_NUMS = [51, 52, 53, 54, 55, 56, 57, 58, 59, 60]
const COL3_NUMS = [70, 69, 68, 67, 66, 65, 64, 63, 62, 61]
const COL4_NUMS = [71, 72, 73, 74, 75, 76, 77, 78, 79, 80]


export function Racks() {
  const bodegaStart = GALERON_LARGO
  const zTramosStart = bodegaStart + MARGIN

  let cursorX = -WAREHOUSE_WIDTH / 2
  cursorX += MARGIN

  const col1X = cursorX + COL1_LARGO / 2
  cursorX += COL1_LARGO

  cursorX += PASILLO_W
  const col2X = cursorX + COL2_LARGO / 2
  cursorX += COL2_LARGO

  cursorX += DIVIDER_W
  const col3X = cursorX + COL3_LARGO / 2
  cursorX += COL3_LARGO

  cursorX += PASILLO_W
  const col4X = cursorX + COL4_LARGO / 2

  const columnas = [
    { x: col1X, largo: COL1_LARGO, tramos: buildColumna(COL1_NUMS) },
    { x: col2X, largo: COL2_LARGO, tramos: buildColumna(COL2_NUMS) },
    { x: col3X, largo: COL3_LARGO, tramos: buildColumna(COL3_NUMS) },
    { x: col4X, largo: COL4_LARGO, tramos: buildColumna(COL4_NUMS) },
  ]

  return (
    <>
      {columnas.map((columna) => {
        let cursor = zTramosStart

        return columna.tramos.map((tramo) => {
          const centerZ = cursor + tramo.ancho / 2
          cursor += tramo.ancho

          return (
            <group
              key={`${columna.x}-${tramo.numero}`}
              position={[columna.x, 0, centerZ]}
            >
              <RackFiscal
                width={columna.largo - 0.4}
                depth={tramo.ancho - 0.4}
              />
            </group>
          )
        })
      })}
    </>
  )
}