import * as THREE from 'three'
import { ALTURA_ALTA, ALTURA_BAJA, TOTAL_LARGO, WAREHOUSE_WIDTH } from "../Constants/warehouse.properties"

export function Techo() {
  const roofAngle = Math.atan2(ALTURA_ALTA - ALTURA_BAJA, TOTAL_LARGO)
  const roofLength = Math.sqrt(TOTAL_LARGO ** 2 + (ALTURA_ALTA - ALTURA_BAJA) ** 2)

  return (
    <mesh
      position={[0, (ALTURA_BAJA + ALTURA_ALTA) / 2, TOTAL_LARGO / 2]}
      rotation={[-Math.PI / 2 + roofAngle, 0, 0]}
    >
      <planeGeometry args={[WAREHOUSE_WIDTH + 1.5, roofLength]} />
      <meshStandardMaterial color="#5c6672" metalness={0.3} roughness={0.7} side={THREE.DoubleSide} />
    </mesh>
  )
}