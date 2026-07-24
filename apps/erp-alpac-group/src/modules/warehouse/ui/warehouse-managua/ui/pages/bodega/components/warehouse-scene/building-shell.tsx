import type { WarehouseLayout } from "../../types/warehouse-3d.types";

interface BuildingShellProps {
  layout: WarehouseLayout;
}

export function BuildingShell({ layout }: BuildingShellProps) {
  const { width, depth, galeronDepth, heightLow } = layout.building;
  const wallH = Math.min(heightLow, 3.2);
  const wallY = wallH / 2;
  const wallT = 0.2;

  return (
    <group>
      {/* Main warehouse floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[width / 2, 0, depth / 2]}
        receiveShadow
      >
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>

      {/* Subtle grid plane */}
      <gridHelper
        args={[Math.max(width, depth), 40, "#334155", "#1e293b"]}
        position={[width / 2, 0.01, depth / 2]}
      />

      {/* Galeron floor (south of origin) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[width / 2, 0, -galeronDepth / 2]}
        receiveShadow
      >
        <planeGeometry args={[width, galeronDepth]} />
        <meshStandardMaterial color="#334155" roughness={1} />
      </mesh>

      {/* Perimeter walls (main bodega) */}
      <mesh position={[width / 2, wallY, -wallT / 2]}>
        <boxGeometry args={[width, wallH, wallT]} />
        <meshStandardMaterial color="#475569" transparent opacity={0.35} />
      </mesh>
      <mesh position={[width / 2, wallY, depth + wallT / 2]}>
        <boxGeometry args={[width, wallH, wallT]} />
        <meshStandardMaterial color="#475569" transparent opacity={0.35} />
      </mesh>
      <mesh position={[-wallT / 2, wallY, depth / 2]}>
        <boxGeometry args={[wallT, wallH, depth]} />
        <meshStandardMaterial color="#475569" transparent opacity={0.35} />
      </mesh>
      <mesh position={[width + wallT / 2, wallY, depth / 2]}>
        <boxGeometry args={[wallT, wallH, depth]} />
        <meshStandardMaterial color="#475569" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}
