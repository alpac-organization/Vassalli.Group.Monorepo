import { useEffect, useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { FloorTramo } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/types/warehouse-3d.types";
import {
  FLOOR_PLATE_HEIGHT,
  TRAMO_STRIP_COLOR,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/types/warehouse-3d.types";
import { useBodegaViewerStore } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/stores/use-bodega-viewer-store";

interface FloorTramosProps {
  tramos: FloorTramo[];
}

export function FloorTramos({ tramos }: FloorTramosProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const codesRef = useRef<string[]>([]);
  const selectLevel = useBodegaViewerStore((s) => s.selectLevel);
  const focusedTramoId = useBodegaViewerStore((s) => s.focusedTramoId);
  const invalidate = useThree((s) => s.invalidate);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);

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
      dummy.scale.set(tramo.size.width, 1, tramo.size.depth);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      color.set(TRAMO_STRIP_COLOR);
      if (focusedTramoId) color.multiplyScalar(0.55);
      mesh.setColorAt(i, color);
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
    invalidate();
  }, [tramos, focusedTramoId, dummy, color, invalidate]);

  if (tramos.length === 0) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, tramos.length]}
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
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <boxGeometry args={[1, FLOOR_PLATE_HEIGHT, 1]} />
      <meshStandardMaterial
        roughness={0.75}
        metalness={0.02}
        toneMapped={false}
      />
    </instancedMesh>
  );
}
