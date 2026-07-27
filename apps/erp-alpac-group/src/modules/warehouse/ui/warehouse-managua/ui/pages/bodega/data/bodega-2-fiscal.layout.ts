import type {
  FloorTramo,
  RackTramo,
  WarehouseLayout,
} from "../types/warehouse-3d.types";
import { rackLevelCodes } from "../utils/location-codes";

const BUILDING = {
  width: 37.35,
  depth: 61.02,
  galeronDepth: 12.1,
  wallClearance: 0.6,
  aisleWidth: 4.4,
  heightHigh: 9.05,
  heightLow: 6.57,
} as const;

const LEFT_W = 8.85;
const CENTER_W = 4.75;
const RIGHT_W = 8.85;
const CENTER_BLOCK_W = 10.85;

const ROW_DEPTHS = [5.23, 6, 6, 6, 6, 6, 6, 6, 6, 5.23] as const;

function rowCentersZ(): number[] {
  const centers: number[] = [];
  let z = BUILDING.wallClearance;
  for (const d of ROW_DEPTHS) {
    centers.push(z + d / 2);
    z += d;
  }
  return centers;
}

function columnCentersX() {
  const { wallClearance: c, aisleWidth: a } = BUILDING;
  const gapBetweenCenter = CENTER_BLOCK_W - CENTER_W * 2;

  const left = c + LEFT_W / 2;
  const centerLeft = c + LEFT_W + a + CENTER_W / 2;
  const centerRight =
    c + LEFT_W + a + CENTER_W + gapBetweenCenter + CENTER_W / 2;
  const right = BUILDING.width - c - RIGHT_W / 2;

  return { left, centerLeft, centerRight, right };
}

function buildFloorColumn(
  idsSouthToNorth: string[],
  x: number,
  width: number,
  column: FloorTramo["column"],
  centersZ: number[],
): FloorTramo[] {
  return idsSouthToNorth.map((id, i) => ({
    id,
    kind: "floor" as const,
    code: id,
    column,
    position: { x, z: centersZ[i]! },
    size: { width, depth: ROW_DEPTHS[i]! },
  }));
}

function buildRackColumn(
  idsSouthToNorth: string[],
  x: number,
  column: RackTramo["column"],
  centersZ: number[],
): RackTramo[] {
  return idsSouthToNorth.map((id, i) => ({
    id,
    kind: "rack" as const,
    baseCode: id,
    column,
    position: { x, z: centersZ[i]! },
    size: { width: CENTER_W, depth: ROW_DEPTHS[i]! },
    levels: rackLevelCodes(id),
  }));
}

function buildLayout(): WarehouseLayout {
  const centersZ = rowCentersZ();
  const x = columnCentersX();

  // South → north numbering from plan
  const leftIds = [
    "T-41",
    "T-42",
    "T-43",
    "T-44",
    "T-45",
    "T-46",
    "T-47",
    "T-48",
    "T-49",
    "T-50",
  ];
  const centerLeftIds = [
    "T-60",
    "T-59",
    "T-58",
    "T-57",
    "T-56",
    "T-55",
    "T-54",
    "T-53",
    "T-52",
    "T-51",
  ];
  const centerRightIds = [
    "T-61",
    "T-62",
    "T-63",
    "T-64",
    "T-65",
    "T-66",
    "T-67",
    "T-68",
    "T-69",
    "T-70",
  ];
  const rightIds = [
    "T-80",
    "T-79",
    "T-78",
    "T-77",
    "T-76",
    "T-75",
    "T-74",
    "T-73",
    "T-72",
    "T-71",
  ];

  return {
    bodegaId: "bodega-2-fiscal",
    name: "Bodega #2 Fiscal",
    building: { ...BUILDING },
    floorTramos: [
      ...buildFloorColumn(leftIds, x.left, LEFT_W, "left", centersZ),
      ...buildFloorColumn(rightIds, x.right, RIGHT_W, "right", centersZ),
    ],
    rackTramos: [
      ...buildRackColumn(centerLeftIds, x.centerLeft, "centerLeft", centersZ),
      ...buildRackColumn(
        centerRightIds,
        x.centerRight,
        "centerRight",
        centersZ,
      ),
    ],
  };
}

export const BODEGA_2_FISCAL_LAYOUT = buildLayout();

export const AVAILABLE_BODEGAS = [
  {
    id: BODEGA_2_FISCAL_LAYOUT.bodegaId,
    name: BODEGA_2_FISCAL_LAYOUT.name,
  },
] as const;

export function getLayoutByBodegaId(bodegaId: string): WarehouseLayout | null {
  if (bodegaId === BODEGA_2_FISCAL_LAYOUT.bodegaId) {
    return BODEGA_2_FISCAL_LAYOUT;
  }
  return null;
}

export function getWarehouseCenter(layout: WarehouseLayout) {
  return {
    x: layout.building.width / 2,
    y: 0,
    z: layout.building.depth / 2,
  };
}
