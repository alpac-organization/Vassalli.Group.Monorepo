import type {
  FloorTramo,
  OccupancyMap,
  RackTramo,
} from "../types/warehouse-3d.types";
import {
  BOXES_PER_POLIN,
  FLOOR_PLATE_HEIGHT,
  FLOOR_POLINES_MAX,
  LEVEL_HEIGHT,
  POLINES_PER_LEVEL,
  POLIN_DEPTH,
  POLIN_HEIGHT,
  POLIN_WIDTH,
  RACK_FLOOR_POLINES_MAX,
  SHELF_THICKNESS,
  SMALL_BOX_DEPTH,
  SMALL_BOX_HEIGHT,
  SMALL_BOX_WIDTH,
  occupancyOf,
  resolvePolines,
} from "../types/warehouse-3d.types";

export type PolinMeshInstance = {
  visible: boolean;
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  d: number;
};

export type CargoBoxInstance = {
  visible: boolean;
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  d: number;
};

function pushCargoOnPolin(
  polines: PolinMeshInstance[],
  boxes: CargoBoxInstance[],
  opts: {
    occupied: boolean;
    x: number;
    polinY: number;
    z: number;
    polinD: number;
  },
) {
  const { occupied, x, polinY, z, polinD } = opts;

  polines.push({
    visible: occupied,
    x,
    y: polinY,
    z,
    w: POLIN_WIDTH,
    h: POLIN_HEIGHT,
    d: polinD,
  });

  const boxY = polinY + POLIN_HEIGHT / 2 + SMALL_BOX_HEIGHT / 2 + 0.01;
  const gap = 0.06;
  const xOffset = (SMALL_BOX_WIDTH + gap) / 2;

  for (let b = 0; b < BOXES_PER_POLIN; b++) {
    const side = b === 0 ? -1 : 1;
    boxes.push({
      visible: occupied,
      x: x + side * xOffset,
      y: boxY,
      z,
      w: SMALL_BOX_WIDTH,
      h: SMALL_BOX_HEIGHT,
      d: Math.min(SMALL_BOX_DEPTH, polinD * 0.85),
    });
  }
}

function placePolinesOnX(
  polines: PolinMeshInstance[],
  boxes: CargoBoxInstance[],
  opts: {
    count: number;
    max: number;
    centerX: number;
    centerZ: number;
    polinY: number;
    availableDepth: number;
  },
) {
  const { count, max, centerX, centerZ, polinY, availableDepth } = opts;
  const gridW = max * POLIN_WIDTH;
  const originX = centerX - gridW / 2 + POLIN_WIDTH / 2;
  const polinD = Math.min(POLIN_DEPTH, availableDepth * 0.92);

  for (let i = 0; i < max; i++) {
    pushCargoOnPolin(polines, boxes, {
      occupied: i < count,
      x: originX + i * POLIN_WIDTH,
      polinY,
      z: centerZ,
      polinD,
    });
  }
}

export function buildFloorPolinCargo(
  tramos: FloorTramo[],
  occupancy: OccupancyMap,
) {
  const polines: PolinMeshInstance[] = [];
  const boxes: CargoBoxInstance[] = [];

  for (const tramo of tramos) {
    const count = Math.min(
      resolvePolines(occupancyOf(occupancy, tramo.code)),
      FLOOR_POLINES_MAX,
    );
    placePolinesOnX(polines, boxes, {
      count,
      max: FLOOR_POLINES_MAX,
      centerX: tramo.position.x,
      centerZ: tramo.position.z,
      polinY: FLOOR_PLATE_HEIGHT + POLIN_HEIGHT / 2 + 0.01,
      availableDepth: tramo.size.depth,
    });
  }

  return { polines, boxes };
}

export function buildRackPolinCargo(
  tramos: RackTramo[],
  occupancy: OccupancyMap,
) {
  const polines: PolinMeshInstance[] = [];
  const boxes: CargoBoxInstance[] = [];

  for (const tramo of tramos) {
    tramo.levels.forEach((code, level) => {
      const isFloorLevel = level === 0;
      const max = isFloorLevel ? RACK_FLOOR_POLINES_MAX : POLINES_PER_LEVEL;
      const count = Math.min(resolvePolines(occupancyOf(occupancy, code)), max);

      const polinY = isFloorLevel
        ? FLOOR_PLATE_HEIGHT + POLIN_HEIGHT / 2 + 0.08
        : LEVEL_HEIGHT * level + SHELF_THICKNESS + POLIN_HEIGHT / 2 + 0.02;

      placePolinesOnX(polines, boxes, {
        count,
        max,
        centerX: tramo.position.x,
        centerZ: tramo.position.z,
        polinY,
        availableDepth: tramo.size.depth,
      });
    });
  }

  return { polines, boxes };
}

export function buildAllPolinCargo(
  floorTramos: FloorTramo[],
  rackTramos: RackTramo[],
  occupancy: OccupancyMap,
) {
  const floor = buildFloorPolinCargo(floorTramos, occupancy);
  const rack = buildRackPolinCargo(rackTramos, occupancy);
  return {
    polines: [...floor.polines, ...rack.polines],
    boxes: [...floor.boxes, ...rack.boxes],
  };
}
