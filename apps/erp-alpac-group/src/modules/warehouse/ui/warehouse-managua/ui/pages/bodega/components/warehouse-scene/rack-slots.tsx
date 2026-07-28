import { useEffect, useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import type {
  OccupancyMap,
  RackTramo,
  SlotStatus,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/types/warehouse-3d.types";
import {
  BOX_HEIGHT,
  LEVEL_HEIGHT,
  POLINES_PER_LEVEL,
  occupancyOf,
  resolvePolines,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/types/warehouse-3d.types";
import { useBodegaViewerStore } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/stores/use-bodega-viewer-store";
import { getRackZoomFlyTo } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/utils/camera-fly";
import { useCardboardBoxAsset } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/hooks/use-cardboard-box-geometry";

interface RackSlotsProps {
  tramos: RackTramo[];
  occupancy: OccupancyMap;
}

const SHELF_THICKNESS = 0.14;
const POLIN_GAP = 0.18;

const SHELF_COLOR: Record<SlotStatus, string> = {
  free: "#22c55e",
  occupied: "#f97316",
};

type ShelfSlot = {
  code: string;
  tramoId: string;
  status: SlotStatus;
  shelf: { x: number; y: number; z: number; w: number; d: number };
};

type PolinInstance = {
  code: string;
  tramoId: string;
  visible: boolean;
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
};
function buildSlots(tramos: RackTramo[], occupancy: OccupancyMap) {
  const shelves: ShelfSlot[] = [];
  const polines: PolinInstance[] = [];

  for (const tramo of tramos) {
    const shelfW = tramo.size.width * 0.9;
    const shelfD = tramo.size.depth * 0.9;

    const padD = (shelfD - POLIN_GAP) / 2;
    const polinW = shelfW * 0.92;
    const polinD = padD * 0.92;
    const polinH = BOX_HEIGHT * 2.65;
    const zOffset = (padD + POLIN_GAP) / 2;

    tramo.levels.forEach((code, level) => {
      const occ = occupancyOf(occupancy, code);
      const count = resolvePolines(occ);
      //Ok haber necesito
      const shelfY = LEVEL_HEIGHT * level + SHELF_THICKNESS / 2;
      const boxY = LEVEL_HEIGHT * level + SHELF_THICKNESS + polinH / 2 + 0.02;

      for (let p = 0; p < POLINES_PER_LEVEL; p++) {
        const side = p === 0 ? -1 : 1;
        const occupied = p < count;
        const z = tramo.position.z + side * zOffset;
        shelves.push({
          code,
          tramoId: tramo.id,
          status: occupied ? "occupied" : "free",
          shelf: {
            x: tramo.position.x,
            y: shelfY,
            z,
            w: shelfW,
            d: padD,
          },
        });
        polines.push({
          code,
          tramoId: tramo.id,
          visible: occupied,
          x: tramo.position.x,
          y: boxY,
          z,
          w: polinW,
          d: polinD,
          h: polinH,
        });
      }
    });
  }

  return { shelves, polines };
}

export function RackSlots({ tramos, occupancy }: RackSlotsProps) {
  const { geometry, material } = useCardboardBoxAsset();
  const shelvesRef = useRef<THREE.InstancedMesh>(null);
  const boxesRef = useRef<THREE.InstancedMesh>(null);

  const { shelves, polines } = useMemo(
    () => buildSlots(tramos, occupancy),
    [tramos, occupancy],
  );
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
    const boxMesh = boxesRef.current;
    if (!shelfMesh || !boxMesh) return;

    shelves.forEach((slot, i) => {
      const selected = selectedLocationCode === slot.code;
      const boost = selected ? 1.03 : 1;

      dummy.position.set(slot.shelf.x, slot.shelf.y, slot.shelf.z);
      dummy.scale.set(slot.shelf.w * boost, 1, slot.shelf.d * boost);
      dummy.updateMatrix();
      shelfMesh.setMatrixAt(i, dummy.matrix);
      color.set(SHELF_COLOR[slot.status]);
      shelfMesh.setColorAt(i, color);
    });

    polines.forEach((polin, i) => {
      const selected = selectedLocationCode === polin.code;
      const boost = selected ? 1.04 : 1;

      if (polin.visible) {
        dummy.position.set(polin.x, polin.y, polin.z);
        dummy.scale.set(polin.w * boost, polin.h * boost, polin.d * boost);
      } else {
        dummy.position.set(polin.x, polin.y, polin.z);
        dummy.scale.set(0, 0, 0);
      }
      dummy.updateMatrix();
      boxMesh.setMatrixAt(i, dummy.matrix);
    });

    shelfMesh.instanceMatrix.needsUpdate = true;
    if (shelfMesh.instanceColor) shelfMesh.instanceColor.needsUpdate = true;
    boxMesh.instanceMatrix.needsUpdate = true;
    shelfMesh.computeBoundingSphere();
    shelfMesh.computeBoundingBox();
    boxMesh.computeBoundingSphere();
    boxMesh.computeBoundingBox();
    invalidate();
  }, [shelves, polines, selectedLocationCode, dummy, color, invalidate]);

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
    <group>
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
        <boxGeometry args={[1, SHELF_THICKNESS, 1]} />
        <meshStandardMaterial
          roughness={0.55}
          metalness={0.08}
          toneMapped={false}
        />
      </instancedMesh>

      <instancedMesh
        ref={boxesRef}
        args={[geometry, material, polines.length]}
        castShadow
        receiveShadow
        frustumCulled={false}
        raycast={() => {}}
      />
    </group>
  );
}
