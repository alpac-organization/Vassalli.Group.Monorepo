import { useEffect, useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import type {
  FloorTramo,
  OccupancyMap,
  SlotStatus,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/types/warehouse-3d.types";
import {
  FLOOR_PLATE_HEIGHT,
  occupancyOf,
  resolveStatus,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/types/warehouse-3d.types";
import { useBodegaViewerStore } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/stores/use-bodega-viewer-store";

interface FloorTramosProps {
  tramos: FloorTramo[];
  occupancy: OccupancyMap;
}

const FLOOR_COLOR: Record<SlotStatus, string> = {
  free: "#22c55e",
  occupied: "#ea580c",
};

export function FloorTramos({ tramos, occupancy }: FloorTramosProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const codesRef = useRef<string[]>([]);
  const selectLevel = useBodegaViewerStore((s) => s.selectLevel);
  const focusedTramoId = useBodegaViewerStore((s) => s.focusedTramoId);
  const invalidate = useThree((s) => s.invalidate);
  const count = tramos.length;
  const color = useMemo(() => new THREE.Color(), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    codesRef.current = tramos.map((t) => t.code);

    tramos.forEach((tramo, i) => {
      dummy.position.set(
        tramo.position.x,
        FLOOR_PLATE_HEIGHT / 2,
        tramo.position.z,
      );
      dummy.scale.set(tramo.size.width * 0.96, 1, tramo.size.depth * 0.96);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      const status = resolveStatus(occupancyOf(occupancy, tramo.code));
      color.set(FLOOR_COLOR[status]);
      if (focusedTramoId) color.multiplyScalar(0.45);
      mesh.setColorAt(i, color);
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
    mesh.computeBoundingBox();
    invalidate();
  }, [tramos, occupancy, focusedTramoId, dummy, color, invalidate]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      castShadow
      receiveShadow
      frustumCulled={false}
      onClick={(e) => {
        e.stopPropagation();
        if (useBodegaViewerStore.getState().focusedTramoId) return;
        const id = e.instanceId;
        if (id == null) return;
        const code = codesRef.current[id];
        if (code) selectLevel(code);
        invalidate();
      }}
    >
      <boxGeometry args={[1, FLOOR_PLATE_HEIGHT, 1]} />
      <meshStandardMaterial
        roughness={0.65}
        metalness={0.05}
        toneMapped={false}
      />
    </instancedMesh>
  );
}
