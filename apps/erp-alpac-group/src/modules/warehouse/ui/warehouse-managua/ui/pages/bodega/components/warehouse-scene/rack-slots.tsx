import { useEffect, useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { OccupancyMap, RackTramo } from "../../types/warehouse-3d.types";
import {
  BOX_HEIGHT,
  FLOOR_PLATE_HEIGHT,
  LEVEL_HEIGHT,
  STATUS_COLOR,
} from "../../types/warehouse-3d.types";
import { useBodegaViewerStore } from "../../stores/use-bodega-viewer-store";
import { getRackZoomFlyTo } from "../../utils/camera-fly";

interface RackSlotsProps {
  tramos: RackTramo[];
  occupancy: OccupancyMap;
}

type SlotInstance = {
  code: string;
  tramoId: string;
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
};

function buildInstances(tramos: RackTramo[]): SlotInstance[] {
  const list: SlotInstance[] = [];
  for (const tramo of tramos) {
    tramo.levels.forEach((code, level) => {
      const h = level === 0 ? FLOOR_PLATE_HEIGHT : BOX_HEIGHT;
      const y =
        level === 0
          ? FLOOR_PLATE_HEIGHT / 2
          : LEVEL_HEIGHT * level + BOX_HEIGHT / 2;
      list.push({
        code,
        tramoId: tramo.id,
        x: tramo.position.x,
        y,
        z: tramo.position.z,
        w: tramo.size.width * 0.88,
        d: tramo.size.depth * 0.88,
        h,
      });
    });
  }
  return list;
}

export function RackSlots({ tramos, occupancy }: RackSlotsProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const instances = useMemo(() => buildInstances(tramos), [tramos]);
  const instancesRef = useRef(instances);
  instancesRef.current = instances;

  const tramosById = useMemo(() => {
    const map = new Map<string, RackTramo>();
    for (const t of tramos) map.set(t.id, t);
    return map;
  }, [tramos]);

  const focusedTramoId = useBodegaViewerStore((s) => s.focusedTramoId);
  const selectedLocationCode = useBodegaViewerStore(
    (s) => s.selectedLocationCode,
  );
  const focusTramo = useBodegaViewerStore((s) => s.focusTramo);
  const selectLevel = useBodegaViewerStore((s) => s.selectLevel);
  const invalidate = useThree((s) => s.invalidate);

  const color = useMemo(() => new THREE.Color(), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    instances.forEach((slot, i) => {
      const isFocused = focusedTramoId === slot.tramoId;
      const isSelected = selectedLocationCode === slot.code;
      const dimOthers = Boolean(focusedTramoId) && !isFocused;

      dummy.position.set(slot.x, slot.y, slot.z);
      const scaleBoost = isSelected ? 1.04 : 1;
      dummy.scale.set(
        slot.w * scaleBoost,
        slot.h * scaleBoost,
        slot.d * scaleBoost,
      );
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      const status = occupancy[slot.code] ?? "free";
      color.set(STATUS_COLOR[status]);
      if (dimOthers) color.multiplyScalar(0.35);
      else if (isSelected) color.offsetHSL(0, 0.05, 0.08);
      mesh.setColorAt(i, color);
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
    mesh.computeBoundingBox();
    invalidate();
  }, [
    instances,
    occupancy,
    focusedTramoId,
    selectedLocationCode,
    dummy,
    color,
    invalidate,
  ]);

  if (instances.length === 0) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, instances.length]}
      castShadow
      frustumCulled={false}
      onClick={(e) => {
        e.stopPropagation();
        const id = e.instanceId;
        if (id == null) return;
        const slot = instancesRef.current[id];
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
        roughness={0.55}
        metalness={0.1}
        toneMapped={false}
      />
    </instancedMesh>
  );
}
