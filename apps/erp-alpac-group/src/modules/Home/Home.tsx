import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'

import { Tree }     from './Components/Tree'
import { Exterior } from './Components/Abroad'
import { Galeron }  from './Components/Galleon'
import { Racks }    from './Components/Racks'
import { Techo }    from './Components/Ceiling'

import { 
   Text, 
   Sky,
   OrbitControls
} from '@react-three/drei'

import { 
   ANCHO_BORDE, 
   ANCHO_MEDIO, 
   BODEGA_LARGO, 
   COL1_LARGO, 
   COL2_LARGO, 
   COL3_LARGO, 
   COL4_LARGO, 
   DIVIDER_W, 
   GALERON_LARGO, 
   MARGIN, 
   PASILLO_W, 
   WAREHOUSE_WIDTH 
} from './Constants/warehouse.properties'

interface Tramo {
  numero: number
  ancho: number
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

interface TramoBoxProps {
  x: number
  z: number
  largo: number
  ancho: number
  numero: number
}

function TramoBox({ x, z, largo, ancho, numero }: TramoBoxProps) {
  const area = (largo * ancho).toFixed(2)

  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.03, 0]} receiveShadow>
        <boxGeometry args={[largo - 0.06, 0.06, ancho - 0.06]} />
        <meshStandardMaterial color="#e0dcc8" roughness={0.9} />
      </mesh>
      {/* Borde/marco pintado del tramo */}
      <lineSegments position={[0, 0.065, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(largo - 0.06, 0.01, ancho - 0.06)]} />
        <lineBasicMaterial color="#c0392b" />
      </lineSegments>
      <Text position={[0, 0.07, ancho * 0.15]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.32} color="#c0392b" anchorX="center">
        {`T-${numero}`}
      </Text>
      <Text position={[0, 0.07, -ancho * 0.15]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.22} color="#333" anchorX="center">
        {`${largo}x${ancho} = ${area}m2`}
      </Text>
    </group>
  )
}

// ============================================================
// Una columna completa de 10 tramos apilados en Z
// ============================================================
interface ColumnaProps {
  xCenter: number
  largo: number
  tramos: Tramo[]
  zStart: number
}

function Columna({ xCenter, largo, tramos, zStart }: ColumnaProps) {
  let cursor = zStart
  const boxes = tramos.map((t) => {
    const centerZ = cursor + t.ancho / 2
    cursor += t.ancho
    return <TramoBox key={t.numero} x={xCenter} z={centerZ} largo={largo} ancho={t.ancho} numero={t.numero} />
  })
  return <>{boxes}</>
}

function Pasillos({ x1, x2, zStart }: { x1: number; x2: number; zStart: number }) {
   return (
      <>
         <Text position={[x1, 0.1, zStart + 29]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.5} color="#555" anchorX="center">
         Pasillo #1
         </Text>
         <Text position={[x2, 0.1, zStart + 29]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.5} color="#555" anchorX="center">
         Pasillo #2
         </Text>
      </>
   )
}

function Bodega() {
  const bodegaStart = GALERON_LARGO
  const zTramosStart = bodegaStart + MARGIN

  // Cursor de posiciones X, siguiendo el plano de izquierda a derecha
  let cursorX = -WAREHOUSE_WIDTH / 2
  cursorX += MARGIN
  const col1X = cursorX + COL1_LARGO / 2
  cursorX += COL1_LARGO
  const pasillo1X = cursorX + PASILLO_W / 2
  cursorX += PASILLO_W
  const col2X = cursorX + COL2_LARGO / 2
  cursorX += COL2_LARGO
  cursorX += DIVIDER_W // línea de separación central
  const col3X = cursorX + COL3_LARGO / 2
  cursorX += COL3_LARGO
  const pasillo2X = cursorX + PASILLO_W / 2
  cursorX += PASILLO_W
  const col4X = cursorX + COL4_LARGO / 2

  return (
    <group>
      <mesh position={[0, 0, bodegaStart + BODEGA_LARGO / 2]} receiveShadow>
        <boxGeometry args={[WAREHOUSE_WIDTH, 0.02, BODEGA_LARGO]} />
        <meshStandardMaterial color="#d9d5c7" roughness={0.95} />
      </mesh>

      <Columna xCenter={col1X} largo={COL1_LARGO} tramos={buildColumna(COL1_NUMS)} zStart={zTramosStart} />
      <Columna xCenter={col2X} largo={COL2_LARGO} tramos={buildColumna(COL2_NUMS)} zStart={zTramosStart} />
      <Columna xCenter={col3X} largo={COL3_LARGO} tramos={buildColumna(COL3_NUMS)} zStart={zTramosStart} />
      <Columna xCenter={col4X} largo={COL4_LARGO} tramos={buildColumna(COL4_NUMS)} zStart={zTramosStart} />

      <Pasillos x1={pasillo1X} x2={pasillo2X} zStart={zTramosStart} />

      <Galeron />
    </group>
  )
}

export const Home = function () {
   return (
      <div className="w-[100%] h-screen">
         <Canvas 
            shadows
            camera={{ 
               position: [0, 3.2, -8], 
               fov: 55 
            }} 
         >
            <Techo />

            <Sky />
            
            <Exterior />

            <ambientLight intensity={0.2} />
            
            <directionalLight position={[10, 20, -10]} intensity={1} castShadow />

            <hemisphereLight args={['#cfe8ff', '#4a4a4a', 0.4]} />
            
            <Bodega />

            <Tree x={-35} z={-20}/>
            <Tree x={35} z={-15} />
            <Tree x={-45} z={45} />
            <Tree x={40} z={55}  />
            <Tree x={-55} z={80} />
            <Tree x={55} z={90}  />

            <Racks />

            <OrbitControls 
               target={[0, 2, 20]} 
               maxPolarAngle={Math.PI / 2.05} 
            />
         </Canvas>
      </div>
   )
}
