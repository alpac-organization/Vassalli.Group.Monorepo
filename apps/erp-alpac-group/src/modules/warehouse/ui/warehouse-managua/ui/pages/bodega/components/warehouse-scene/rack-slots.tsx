import { useEffect, useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { RackTramo } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/types/warehouse-3d.types";
import {
  FLOOR_PLATE_HEIGHT,
  LEVEL_HEIGHT,
  SHELF_THICKNESS,
  TRAMO_STRIP_COLOR,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/types/warehouse-3d.types";
import { useBodegaViewerStore } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/stores/use-bodega-viewer-store";
import { getRackZoomFlyTo } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/utils/camera-fly";

interface RackSlotsProps {
  tramos: RackTramo[];
}

type ShelfSlot = {
  code: string;
  tramoId: string;
  level: number;
  shelf: { x: number; y: number; z: number; w: number; d: number; h: number };
};

function buildShelves(tramos: RackTramo[]): ShelfSlot[] {
  const shelves: ShelfSlot[] = [];
  for (const tramo of tramos) {
    tramo.levels.forEach((code, level) => {
      const isFloor = level === 0;
      const h = isFloor ? FLOOR_PLATE_HEIGHT : SHELF_THICKNESS;
      const y = isFloor
        ? FLOOR_PLATE_HEIGHT / 2
        : LEVEL_HEIGHT * level + SHELF_THICKNESS / 2;

      shelves.push({
        code,
        tramoId: tramo.id,
        level,
        shelf: {
          x: tramo.position.x,
          y,
          z: tramo.position.z,
          w: tramo.size.width,
          d: tramo.size.depth,
          h,
        },
      });
    });
  }
  return shelves;
}

export function RackSlots({ tramos }: RackSlotsProps) {
  const shelvesRef = useRef<THREE.InstancedMesh>(null);
  const shelves = useMemo(() => buildShelves(tramos), [tramos]);
  const shelvesRefData = useRef(shelves);
  shelvesRefData.current = shelves;

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
    const shelfMesh = shelvesRef.current;
    if (!shelfMesh) return;

    shelves.forEach((slot, i) => {
      const selected = selectedLocationCode === slot.code;
      const boost = selected ? 1.02 : 1;
      dummy.position.set(slot.shelf.x, slot.shelf.y, slot.shelf.z);
      dummy.scale.set(slot.shelf.w * boost, slot.shelf.h, slot.shelf.d * boost);
      dummy.updateMatrix();
      shelfMesh.setMatrixAt(i, dummy.matrix);
      color.set(TRAMO_STRIP_COLOR);
      shelfMesh.setColorAt(i, color);
    });

    shelfMesh.instanceMatrix.needsUpdate = true;
    if (shelfMesh.instanceColor) shelfMesh.instanceColor.needsUpdate = true;
    shelfMesh.computeBoundingSphere();
    invalidate();
  }, [shelves, selectedLocationCode, dummy, color, invalidate]);

  if (shelves.length === 0) return null;

  const handleClick = (instanceId: number | undefined) => {
    if (instanceId == null) return;
    const slot = shelvesRefData.current[instanceId];
    if (!slot) return;

    const focused = useBodegaViewerStore.getState().focusedTramoId;
    if (focused !== slot.tramoId) {
      const tramo = tramosById.get(slot.tramoId);
      if (!tramo) return;
      focusTramo(slot.tramoId, getRackZoomFlyTo(tramo));
      invalidate();
      return;
    }
    selectLevel(slot.code);
    invalidate();
  };

  return (
    <instancedMesh
      ref={shelvesRef}
      args={[undefined, undefined, shelves.length]}
      castShadow
      receiveShadow
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
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        roughness={0.7}
        metalness={0.04}
        toneMapped={false}
      />
    </instancedMesh>
  );
}
