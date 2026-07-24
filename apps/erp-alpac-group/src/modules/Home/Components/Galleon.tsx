import { Text } from "@react-three/drei"
import { WAREHOUSE_WIDTH } from "../Constants/warehouse.properties"
import { useHexFloorTexture } from "../Hooks/useHexFloorTexture"

const GALERON_LARGO = 12.1  // profundidad del galerón (entrada)

export function Galeron() {
  const hexTexture = useHexFloorTexture()
  const zCenter = GALERON_LARGO / 2

  return (
    <group>
      <mesh position={[0, 0.01, zCenter]} receiveShadow>
        <boxGeometry args={[WAREHOUSE_WIDTH, 0.02, GALERON_LARGO]} />
        <meshStandardMaterial map={hexTexture} roughness={0.95} />
      </mesh>
      <Text position={[0, 0.05, zCenter]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.6} color="#333" anchorX="center">
        Galeron B#2
      </Text>
      <Text position={[0, 5.5, -1]} fontSize={0.9} color="#003f7d" anchorX="center">
        BODEGA #2 FISCAL
      </Text>
    </group>
  )
}

