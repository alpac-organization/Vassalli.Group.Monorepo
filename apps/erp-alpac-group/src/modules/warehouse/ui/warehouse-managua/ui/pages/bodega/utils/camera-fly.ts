import type { RackTramo, Vec3, WarehouseLayout } from "../types/warehouse-3d.types";
import { LEVEL_HEIGHT, RACK_FRAME_HEIGHT } from "../types/warehouse-3d.types";
import { getWarehouseCenter } from "../data/bodega-2-fiscal.layout";
import type { CameraFlyTo } from "../stores/use-bodega-viewer-store";

/** Camera approach from the facing aisle for a clear rack view. */
export function getRackZoomFlyTo(tramo: RackTramo): CameraFlyTo {
  const aisleSide = tramo.column === "centerLeft" ? -1 : 1;
  const standOff = tramo.size.width / 2 + 7.5;

  const target: Vec3 = {
    x: tramo.position.x,
    y: LEVEL_HEIGHT * 0.85,
    z: tramo.position.z,
  };

  const position: Vec3 = {
    x: tramo.position.x + aisleSide * standOff,
    y: RACK_FRAME_HEIGHT * 0.72,
    z: tramo.position.z + tramo.size.depth * 0.15,
  };

  return { position, target, minDistance: 3.5 };
}

export function getOverviewFlyTo(layout: WarehouseLayout): CameraFlyTo {
  const center = getWarehouseCenter(layout);
  return {
    position: {
      x: center.x + 28,
      y: 22,
      z: center.z + 48,
    },
    target: { x: center.x, y: 0.5, z: center.z },
    minDistance: 8,
  };
}
