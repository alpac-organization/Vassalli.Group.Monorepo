import { useMemo } from "react";
import type { WarehouseLayout } from "../../types/warehouse-3d.types";
import { RACK_FRAME_HEIGHT } from "../../types/warehouse-3d.types";
import { useBodegaViewerStore } from "../../stores/use-bodega-viewer-store";

interface FocusedTramoHighlightProps {
  layout: WarehouseLayout;
}

export function FocusedTramoHighlight({ layout }: FocusedTramoHighlightProps) {
  const focusedTramoId = useBodegaViewerStore((s) => s.focusedTramoId);

  const tramo = useMemo(
    () => layout.rackTramos.find((t) => t.id === focusedTramoId) ?? null,
    [layout.rackTramos, focusedTramoId],
  );

  if (!tramo) return null;

  const w = tramo.size.width * 1.04;
  const d = tramo.size.depth * 1.04;

  return (
    <group position={[tramo.position.x, 0, tramo.position.z]}>
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w, d]} />
        <meshBasicMaterial color="#0ea5e9" transparent opacity={0.18} />
      </mesh>
      {/* Edge rails */}
      <mesh position={[0, 0.06, -d / 2]}>
        <boxGeometry args={[w, 0.06, 0.06]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
      <mesh position={[0, 0.06, d / 2]}>
        <boxGeometry args={[w, 0.06, 0.06]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
      <mesh position={[-w / 2, 0.06, 0]}>
        <boxGeometry args={[0.06, 0.06, d]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
      <mesh position={[w / 2, 0.06, 0]}>
        <boxGeometry args={[0.06, 0.06, d]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
      <mesh position={[0, RACK_FRAME_HEIGHT / 2, 0]}>
        <boxGeometry args={[w, RACK_FRAME_HEIGHT + 0.15, d]} />
        <meshBasicMaterial
          color="#38bdf8"
          wireframe
          transparent
          opacity={0.28}
        />
      </mesh>
    </group>
  );
}
