import { useEffect, useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { RackTramo } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/types/warehouse-3d.types";
import {
  FLOOR_PLATE_HEIGHT,
  LEVEL_HEIGHT,
  RACK_LEVEL_BORDER_COLOR,
  SHELF_THICKNESS,
  TRAMO_STRIP_COLOR,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/types/warehouse-3d.types";
import { useBodegaViewerStore } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/stores/use-bodega-viewer-store";
import { getRackZoomFlyTo } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/utils/camera-fly";
import {
  pushRectBorder,
  type BorderRail,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/utils/tramo-border";

interface RackSlotsProps {
  tramos: RackTramo[];
}

type ClickPlate = {
  code: string;
  tramoId: string;
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
};

function buildRackBorders(tramos: RackTramo[]) {
  const rails: BorderRail[] = [];
  const plates: ClickPlate[] = [];

  for (const tramo of tramos) {
    tramo.levels.forEach((code, level) => {
      const isFloor = level === 0;
      const h = isFloor ? FLOOR_PLATE_HEIGHT : SHELF_THICKNESS;
      const y = isFloor
        ? FLOOR_PLATE_HEIGHT / 2
        : LEVEL_HEIGHT * level + SHELF_THICKNESS / 2;

      pushRectBorder(rails, {
        x: tramo.position.x,
        y,
        z: tramo.position.z,
        w: tramo.size.width,
        d: tramo.size.depth,
        h,
        code,
        tramoId: tramo.id,
        level,
      });

      plates.push({
        code,
        tramoId: tramo.id,
        x: tramo.position.x,
        y: isFloor ? 0.02 : y,
        z: tramo.position.z,
        w: tramo.size.width,
        d: tramo.size.depth,
      });
    });
  }

  return { rails, plates };
}

export function RackSlots({ tramos }: RackSlotsProps) {
  const borderRef = useRef<THREE.InstancedMesh>(null);
  const hitRef = useRef<THREE.InstancedMesh>(null);
  const platesRef = useRef<ClickPlate[]>([]);

  const { rails, plates } = useMemo(() => buildRackBorders(tramos), [tramos]);
  platesRef.current = plates;

  const tramosById = useMemo(() => {
    const map = new Map<string, RackTramo>();
    for (const t of tramos) map.set(t.id, t);
    return map;
  }, [tramos]);

  const selectedLocationCode = useBodegaViewerStore(
    (s) => s.selectedLocationCode,
  );
  const focusTramo = useBodegaViewerStore((s) => s.focusTramo);
  const selectLevel = useBodegaViewerStore((s) => s.selectLevel);
  const invalidate = useThree((s) => s.invalidate);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);

  useEffect(() => {
    const borderMesh = borderRef.current;
    const hitMesh = hitRef.current;
    if (!borderMesh || !hitMesh) return;

    rails.forEach((rail, i) => {
      const selected = selectedLocationCode === rail.code;
      const boost = selected ? 1.04 : 1;
      const isRackShelf = (rail.level ?? 0) >= 1;
      const base = isRackShelf ? RACK_LEVEL_BORDER_COLOR : TRAMO_STRIP_COLOR;
      const selectedTint = isRackShelf ? "#94a3b8" : "#f5e6a8";

      dummy.position.set(rail.x, rail.y, rail.z);
      dummy.scale.set(rail.sx * boost, rail.sy, rail.sz * boost);
      dummy.updateMatrix();
      borderMesh.setMatrixAt(i, dummy.matrix);
      color.set(selected ? selectedTint : base);
      borderMesh.setColorAt(i, color);
    });
    borderMesh.instanceMatrix.needsUpdate = true;
    if (borderMesh.instanceColor) borderMesh.instanceColor.needsUpdate = true;
    borderMesh.computeBoundingSphere();

    plates.forEach((p, i) => {
      const selected = selectedLocationCode === p.code;
      const boost = selected ? 1.02 : 1;
      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.set(p.w * boost, 1, p.d * boost);
      dummy.updateMatrix();
      hitMesh.setMatrixAt(i, dummy.matrix);
    });
    hitMesh.instanceMatrix.needsUpdate = true;
    hitMesh.computeBoundingSphere();
    invalidate();
  }, [rails, plates, selectedLocationCode, dummy, color, invalidate]);

  if (rails.length === 0) return null;

  const handleClick = (instanceId: number | undefined) => {
    if (instanceId == null) return;
    const plate = platesRef.current[instanceId];
    if (!plate) return;

    const focused = useBodegaViewerStore.getState().focusedTramoId;
    if (focused !== plate.tramoId) {
      const tramo = tramosById.get(plate.tramoId);
      if (!tramo) return;
      focusTramo(plate.tramoId, getRackZoomFlyTo(tramo));
      invalidate();
      return;
    }
    selectLevel(plate.code);
    invalidate();
  };

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
          roughness={0.7}
          metalness={0.04}
          toneMapped={false}
        />
      </instancedMesh>

      <instancedMesh
        ref={hitRef}
        args={[undefined, undefined, plates.length]}
        frustumCulled={false}
        onClick={(e) => {
          e.stopPropagation();
          handleClick(e.instanceId);
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
