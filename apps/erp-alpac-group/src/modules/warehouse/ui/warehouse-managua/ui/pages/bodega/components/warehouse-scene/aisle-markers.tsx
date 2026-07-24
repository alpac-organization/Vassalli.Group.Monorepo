import type { WarehouseLayout } from "../../types/warehouse-3d.types";

interface AisleMarkersProps {
  layout: WarehouseLayout;
}

/** Visual aisle bands between left / center / right columns. */
export function AisleMarkers({ layout }: AisleMarkersProps) {
  const { wallClearance, aisleWidth, depth } = layout.building;
  const leftW = 8.85;
  const centerBlock = 10.85;
  const aisleLen = depth - wallClearance * 2;
  const aisleZ = wallClearance + aisleLen / 2;

  const aisle1X = wallClearance + leftW + aisleWidth / 2;
  const aisle2X = wallClearance + leftW + aisleWidth + centerBlock + aisleWidth / 2;

  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[aisle1X, 0.02, aisleZ]}
      >
        <planeGeometry args={[aisleWidth * 0.92, aisleLen]} />
        <meshStandardMaterial color="#0f172a" roughness={0.95} />
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[aisle2X, 0.02, aisleZ]}
      >
        <planeGeometry args={[aisleWidth * 0.92, aisleLen]} />
        <meshStandardMaterial color="#0f172a" roughness={0.95} />
      </mesh>
    </group>
  );
}
