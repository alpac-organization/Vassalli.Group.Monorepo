import { useEffect, useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { FloorTramo } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/types/warehouse-3d.types";
import { FLOOR_PLATE_HEIGHT } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/types/warehouse-3d.types";
import { useBodegaViewerStore } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/stores/use-bodega-viewer-store";
import {
  applyBorderMatrices,
  pushRectBorder,
  type BorderRail,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/utils/tramo-border";

interface FloorTramosProps {
  tramos: FloorTramo[];
}

type ClickPlate = {
  code: string;
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
};

function buildFloorBorders(tramos: FloorTramo[]) {
  const rails: BorderRail[] = [];
  const plates: ClickPlate[] = [];

  for (const tramo of tramos) {
    pushRectBorder(rails, {
      x: tramo.position.x,
      y: FLOOR_PLATE_HEIGHT / 2,
      z: tramo.position.z,
      w: tramo.size.width,
      d: tramo.size.depth,
      h: FLOOR_PLATE_HEIGHT,
      code: tramo.code,
    });
    plates.push({
      code: tramo.code,
      x: tramo.position.x,
      y: 0.02,
      z: tramo.position.z,
      w: tramo.size.width,
      d: tramo.size.depth,
    });
  }

  return { rails, plates };
}

/** Pale-yellow border outline for lateral floor tramos (no solid fill). */
export function FloorTramos({ tramos }: FloorTramosProps) {
  const borderRef = useRef<THREE.InstancedMesh>(null);
  const hitRef = useRef<THREE.InstancedMesh>(null);
  const platesRef = useRef<ClickPlate[]>([]);
  const selectLevel = useBodegaViewerStore((s) => s.selectLevel);
  const focusedTramoId = useBodegaViewerStore((s) => s.focusedTramoId);
  const invalidate = useThree((s) => s.invalidate);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);

  const { rails, plates } = useMemo(() => buildFloorBorders(tramos), [tramos]);
  platesRef.current = plates;

  useEffect(() => {
    const borderMesh = borderRef.current;
    const hitMesh = hitRef.current;
    if (!borderMesh || !hitMesh) return;

    applyBorderMatrices(
      borderMesh,
      rails,
      dummy,
      color,
      focusedTramoId ? 0.55 : 1,
    );

    plates.forEach((p, i) => {
      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.set(p.w, 1, p.d);
      dummy.updateMatrix();
      hitMesh.setMatrixAt(i, dummy.matrix);
    });
    hitMesh.instanceMatrix.needsUpdate = true;
    hitMesh.computeBoundingSphere();
    invalidate();
  }, [rails, plates, focusedTramoId, dummy, color, invalidate]);

  if (rails.length === 0) return null;

  return (
    <group>
      <instancedMesh
        ref={borderRef}
        args={[undefined, undefined, rails.length]}
        castShadow
        receiveShadow
        frustumCulled={false}
        raycast={() => {}}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          roughness={0.75}
          metalness={0.02}
          toneMapped={false}
        />
      </instancedMesh>

      {/* Invisible hit target for clicks */}
      <instancedMesh
        ref={hitRef}
        args={[undefined, undefined, plates.length]}
        frustumCulled={false}
        onClick={(e) => {
          e.stopPropagation();
          if (useBodegaViewerStore.getState().focusedTramoId) return;
          const id = e.instanceId;
          if (id == null) return;
          const plate = platesRef.current[id];
          if (plate) selectLevel(plate.code);
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
        <boxGeometry args={[1, 0.04, 1]} />
        <meshBasicMaterial
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
        />
      </instancedMesh>
    </group>
  );
}
