import { useEffect, useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import type {
  OccupancyMap,
  RackTramo,
  SlotStatus,
} from "../../types/warehouse-3d.types";
import { BOX_HEIGHT, LEVEL_HEIGHT } from "../../types/warehouse-3d.types";
import { useBodegaViewerStore } from "../../stores/use-bodega-viewer-store";
import { getRackZoomFlyTo } from "../../utils/camera-fly";
import { useCardboardBoxAsset } from "../../hooks/use-cardboard-box-geometry";

interface RackSlotsProps {
  tramos: RackTramo[];
  occupancy: OccupancyMap;
}

const SHELF_THICKNESS = 0.14;

/** Shelf colors in 3D — occupied uses neutral (box shows occupancy), never red. */
const SHELF_COLOR: Record<SlotStatus, string> = {
  free: "#22c55e",
  reserved: "#eab308",
  occupied: "#475569",
};

type LevelSlot = {
  code: string;
  tramoId: string;
  status: SlotStatus;
  shelf: { x: number; y: number; z: number; w: number; d: number };
  box: { x: number; y: number; z: number; w: number; d: number; h: number };
};

function buildSlots(tramos: RackTramo[], occupancy: OccupancyMap): LevelSlot[] {
  const list: LevelSlot[] = [];

  for (const tramo of tramos) {
    const shelfW = tramo.size.width * 0.9;
    const shelfD = tramo.size.depth * 0.9;
    const boxW = Math.min(1.25, shelfW * 0.42);
    const boxD = Math.min(1.05, shelfD * 0.55);
    const boxH = BOX_HEIGHT * 0.7;

    tramo.levels.forEach((code, level) => {
      const status = occupancy[code] ?? "free";
      const shelfY = LEVEL_HEIGHT * level + SHELF_THICKNESS / 2;
      const boxY = LEVEL_HEIGHT * level + SHELF_THICKNESS + boxH / 2 + 0.02;

      list.push({
        code,
        tramoId: tramo.id,
        status,
        shelf: {
          x: tramo.position.x,
          y: shelfY,
          z: tramo.position.z,
          w: shelfW,
          d: shelfD,
        },
        box: {
          x: tramo.position.x,
          y: boxY,
          z: tramo.position.z,
          w: boxW,
          d: boxD,
          h: boxH,
        },
      });
    });
  }

  return list;
}

export function RackSlots({ tramos, occupancy }: RackSlotsProps) {
  const { geometry, material } = useCardboardBoxAsset();
  const shelvesRef = useRef<THREE.InstancedMesh>(null);
  const boxesRef = useRef<THREE.InstancedMesh>(null);

  const slots = useMemo(
    () => buildSlots(tramos, occupancy),
    [tramos, occupancy],
  );
  const slotsRef = useRef(slots);
  slotsRef.current = slots;

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
    const shelves = shelvesRef.current;
    const boxes = boxesRef.current;
    if (!shelves || !boxes) return;

    slots.forEach((slot, i) => {
      const selected = selectedLocationCode === slot.code;
      const boost = selected ? 1.03 : 1;

      dummy.position.set(slot.shelf.x, slot.shelf.y, slot.shelf.z);
      dummy.scale.set(slot.shelf.w * boost, 1, slot.shelf.d * boost);
      dummy.updateMatrix();
      shelves.setMatrixAt(i, dummy.matrix);
      color.set(SHELF_COLOR[slot.status]);
      shelves.setColorAt(i, color);

      if (slot.status === "occupied") {
        dummy.position.set(slot.box.x, slot.box.y, slot.box.z);
        dummy.scale.set(
          slot.box.w * boost,
          slot.box.h * boost,
          slot.box.d * boost,
        );
      } else {
        dummy.position.set(slot.box.x, slot.box.y, slot.box.z);
        dummy.scale.set(0, 0, 0);
      }
      dummy.updateMatrix();
      boxes.setMatrixAt(i, dummy.matrix);
    });

    shelves.instanceMatrix.needsUpdate = true;
    if (shelves.instanceColor) shelves.instanceColor.needsUpdate = true;
    boxes.instanceMatrix.needsUpdate = true;
    shelves.computeBoundingSphere();
    shelves.computeBoundingBox();
    boxes.computeBoundingSphere();
    boxes.computeBoundingBox();
    invalidate();
  }, [slots, selectedLocationCode, dummy, color, invalidate]);

  if (slots.length === 0) return null;

  const handleClick = (instanceId: number | undefined) => {
    if (instanceId == null) return;
    const slot = slotsRef.current[instanceId];
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
        args={[undefined, undefined, slots.length]}
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
        args={[geometry, material, slots.length]}
        castShadow
        receiveShadow
        frustumCulled={false}
        raycast={() => {}}
      />
    </group>
  );
}
