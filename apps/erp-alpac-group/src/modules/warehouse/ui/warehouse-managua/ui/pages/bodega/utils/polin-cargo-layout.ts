import type {
  FloorTramo,
  OccupancyMap,
  RackTramo,
} from "../types/warehouse-3d.types";
import {
  BOXES_PER_POLIN,
  FLOOR_PLATE_HEIGHT,
  FLOOR_POLIN_COLS,
  FLOOR_POLIN_ROWS,
  FLOOR_POLINES_MAX,
  LEVEL_HEIGHT,
  POLINES_PER_LEVEL,
  POLIN_DEPTH,
  POLIN_HEIGHT,
  POLIN_WIDTH,
  RACK_FLOOR_POLINES_MAX,
  RACK_SHELF_BOX_COLS,
  RACK_SHELF_BOX_ROWS,
  RACK_SHELF_POLIN_GAP,
  SHELF_THICKNESS,
  SMALL_BOX_DEPTH,
  SMALL_BOX_HEIGHT,
  SMALL_BOX_WIDTH,
  occupancyOf,
  resolvePolines,
} from "../types/warehouse-3d.types";

export type PolinMeshInstance = {
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  d: number;
};

export type CargoBoxInstance = {
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  d: number;
};

export type PolinCargoBuild = {
  polines: PolinMeshInstance[];
  boxes: CargoBoxInstance[];
};

type BoxLayout = "pair" | "grid2x2";

function pushOccupiedCargo(
  polines: PolinMeshInstance[],
  boxes: CargoBoxInstance[],
  opts: {
    x: number;
    polinY: number;
    z: number;
    polinW: number;
    polinD: number;
    boxLayout?: BoxLayout;
  },
) {
  const { x, polinY, z, polinW, polinD } = opts;
  const boxLayout = opts.boxLayout ?? "pair";

  polines.push({
    x,
    y: polinY,
    z,
    w: polinW,
    h: POLIN_HEIGHT,
    d: polinD,
  });

  if (boxLayout === "grid2x2") {
    // Niveles 2–3: 2 columnas (X) × 2 filas (Z), filling the polín
    const gapX = Math.max(0.1, polinW * 0.06);
    const gapZ = Math.max(0.1, polinD * 0.06);
    const boxW = ((polinW - gapX) / RACK_SHELF_BOX_COLS) * 0.9;
    const boxD = ((polinD - gapZ) / RACK_SHELF_BOX_ROWS) * 0.9;
    const boxH = Math.min(Math.max(SMALL_BOX_HEIGHT, 0.42), 0.65);
    const boxY = polinY + POLIN_HEIGHT / 2 + boxH / 2 + 0.01;
    const xOffset = (boxW + gapX) / 2;
    const zOffset = (boxD + gapZ) / 2;

    for (let col = 0; col < RACK_SHELF_BOX_COLS; col++) {
      const sx = col === 0 ? -1 : 1;
      for (let row = 0; row < RACK_SHELF_BOX_ROWS; row++) {
        const sz = row === 0 ? -1 : 1;
        boxes.push({
          x: x + sx * xOffset,
          y: boxY,
          z: z + sz * zOffset,
          w: boxW,
          h: boxH,
          d: boxD,
        });
      }
    }
    return;
  }

  // Default: 2 boxes side-by-side on X (floor / nivel 1)
  const boxW = Math.min(Math.max(SMALL_BOX_WIDTH * 0.85, polinW * 0.38), 1.05);
  const boxD = Math.min(Math.max(SMALL_BOX_DEPTH * 0.85, polinD * 0.55), 1.35);
  const boxH = Math.min(Math.max(SMALL_BOX_HEIGHT, 0.32), 0.55);
  const boxY = polinY + POLIN_HEIGHT / 2 + boxH / 2 + 0.01;
  const gap = Math.max(0.04, polinW * 0.05);
  const xOffset = (boxW + gap) / 2;

  for (let b = 0; b < BOXES_PER_POLIN; b++) {
    const side = b === 0 ? -1 : 1;
    boxes.push({
      x: x + side * xOffset,
      y: boxY,
      z,
      w: boxW,
      h: boxH,
      d: boxD,
    });
  }
}

/** Rack / simple row: polines along X. */
function placeOccupiedOnX(
  out: PolinCargoBuild,
  opts: {
    count: number;
    max: number;
    centerX: number;
    centerZ: number;
    polinY: number;
    polinW: number;
    polinD: number;
    gap?: number;
    boxLayout?: BoxLayout;
  },
) {
  const { count, max, centerX, centerZ, polinY, polinW, polinD } = opts;
  if (count <= 0) return;

  const gap = opts.gap ?? 0;
  const gridW = max * polinW + Math.max(0, max - 1) * gap;
  const originX = centerX - gridW / 2 + polinW / 2;
  const stride = polinW + gap;

  for (let i = 0; i < count; i++) {
    pushOccupiedCargo(out.polines, out.boxes, {
      x: originX + i * stride,
      polinY,
      z: centerZ,
      polinW,
      polinD,
      boxLayout: opts.boxLayout,
    });
  }
}

/**
 * Lateral floor: 7 cols × 4 rows sized to fit inside the yellow border.
 */
function placeFloorGrid(
  out: PolinCargoBuild,
  opts: {
    count: number;
    centerX: number;
    centerZ: number;
    tramoW: number;
    tramoD: number;
    polinY: number;
  },
) {
  const { count, centerX, centerZ, tramoW, tramoD, polinY } = opts;
  if (count <= 0) return;

  const inset = 0.1;
  const usableW = Math.max(0.5, tramoW - inset * 2);
  const usableD = Math.max(0.5, tramoD - inset * 2);
  const cellW = usableW / FLOOR_POLIN_COLS;
  const cellD = usableD / FLOOR_POLIN_ROWS;
  const polinW = cellW * 0.86;
  const polinD = cellD * 0.86;

  const originX = centerX - usableW / 2 + cellW / 2;
  const originZ = centerZ - usableD / 2 + cellD / 2;

  const n = Math.min(count, FLOOR_POLINES_MAX);
  for (let i = 0; i < n; i++) {
    const col = i % FLOOR_POLIN_COLS;
    const row = Math.floor(i / FLOOR_POLIN_COLS);
    pushOccupiedCargo(out.polines, out.boxes, {
      x: originX + col * cellW,
      polinY,
      z: originZ + row * cellD,
      polinW,
      polinD,
    });
  }
}

function emptyBuild(): PolinCargoBuild {
  return { polines: [], boxes: [] };
}

export function buildFloorPolinCargo(
  tramos: FloorTramo[],
  occupancy: OccupancyMap,
): PolinCargoBuild {
  const out = emptyBuild();

  for (const tramo of tramos) {
    const count = Math.min(
      resolvePolines(occupancyOf(occupancy, tramo.code)),
      FLOOR_POLINES_MAX,
    );
    placeFloorGrid(out, {
      count,
      centerX: tramo.position.x,
      centerZ: tramo.position.z,
      tramoW: tramo.size.width,
      tramoD: tramo.size.depth,
      polinY: FLOOR_PLATE_HEIGHT + POLIN_HEIGHT / 2 + 0.01,
    });
  }

  return out;
}

export function buildRackPolinCargo(
  tramos: RackTramo[],
  occupancy: OccupancyMap,
): PolinCargoBuild {
  const out = emptyBuild();

  for (const tramo of tramos) {
    tramo.levels.forEach((code, level) => {
      const isFloorLevel = level === 0;
      const max = isFloorLevel ? RACK_FLOOR_POLINES_MAX : POLINES_PER_LEVEL;
      const count = Math.min(resolvePolines(occupancyOf(occupancy, code)), max);

      const polinY = isFloorLevel
        ? FLOOR_PLATE_HEIGHT + POLIN_HEIGHT / 2 + 0.01
        : LEVEL_HEIGHT * level + SHELF_THICKNESS + POLIN_HEIGHT / 2 + 0.02;

      let polinW: number;
      let polinD: number;
      let gap = 0;

      if (isFloorLevel) {
        // Nivel 1: up to 4 polines across full tramo width
        polinW = Math.min(POLIN_WIDTH, (tramo.size.width * 0.9) / max);
        polinD = Math.min(POLIN_DEPTH, tramo.size.depth * 0.85);
      } else {
        // Niveles 2–3: 2 large polines filling the shelf (width + depth)
        gap = RACK_SHELF_POLIN_GAP;
        polinW = (tramo.size.width * 0.96 - gap) / POLINES_PER_LEVEL;
        polinD = tramo.size.depth * 0.9;
      }

      placeOccupiedOnX(out, {
        count,
        max,
        centerX: tramo.position.x,
        centerZ: tramo.position.z,
        polinY,
        polinW,
        polinD,
        gap,
        boxLayout: isFloorLevel ? "pair" : "grid2x2",
      });
    });
  }

  return out;
}

export function buildAllPolinCargo(
  floorTramos: FloorTramo[],
  rackTramos: RackTramo[],
  occupancy: OccupancyMap,
): PolinCargoBuild {
  const floor = buildFloorPolinCargo(floorTramos, occupancy);
  const rack = buildRackPolinCargo(rackTramos, occupancy);
  return {
    polines: [...floor.polines, ...rack.polines],
    boxes: [...floor.boxes, ...rack.boxes],
  };
}
