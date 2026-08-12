import type {
  FloorTramo,
  RackTramo,
  WarehouseLayout,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/types/warehouse-3d.types";
import { rackLevelCodes } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/utils/location-codes";

const WALL_CLEARANCE = 0.6;
const AISLE_WIDTH = 4.4;
const SIDE_W = 8.85;
const CENTER_W = 4.75;
const CENTER_BLOCK_W = 10.85;
const BUILDING_WIDTH = 37.35;
const BUILDING_DEPTH = 61.02;
const GALERON_DEPTH = 12.1;

const ROW_DEPTHS = [5.23, 6, 6, 6, 6, 6, 6, 6, 6, 5.23] as const;

const BUILDING = {
  width: BUILDING_WIDTH,
  depth: BUILDING_DEPTH,
  galeronDepth: GALERON_DEPTH,
  wallClearance: WALL_CLEARANCE,
  aisleWidth: AISLE_WIDTH,
  heightHigh: 9.05,
  heightLow: 6.57,
  sideTramoWidth: SIDE_W,
  centerTramoWidth: CENTER_W,
  centerBlockWidth: CENTER_BLOCK_W,
} as const;

function rowCentersZ(): number[] {
  const centers: number[] = [];
  let z = WALL_CLEARANCE;
  for (const d of ROW_DEPTHS) {
    centers.push(z + d / 2);
    z += d;
  }
  return centers;
}

function columnCentersX() {
  const c = WALL_CLEARANCE;
  const a = AISLE_WIDTH;
  const gapBetweenCenter = CENTER_BLOCK_W - CENTER_W * 2;

  const left = c + SIDE_W / 2;
  const centerLeft = c + SIDE_W + a + CENTER_W / 2;
  const centerRight =
    c + SIDE_W + a + CENTER_W + gapBetweenCenter + CENTER_W / 2;
  const right = BUILDING_WIDTH - c - SIDE_W / 2;
  return { left, centerLeft, centerRight, right };
}

function buildFloorColumn(
  idsSouthToNorth: string[],
  x: number,
  column: FloorTramo["column"],
  centersZ: number[],
): FloorTramo[] {
  return idsSouthToNorth.map((id, i) => ({
    id,
    warehouseNumber: i + 1,
    kind: "floor" as const,
    code: id,
    column,
    position: { x, z: centersZ[i]! },
    size: { width: SIDE_W, depth: ROW_DEPTHS[i]! },
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
    warehouseNumber: i + 1,
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
    name: "Bodega #2",
    building: { ...BUILDING },
    floorTramos: [
      ...buildFloorColumn(leftIds, x.left, "left", centersZ),
      ...buildFloorColumn(rightIds, x.right, "right", centersZ),
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
  { id: "bodega-1-fiscal", name: "Bodega #1" },
  {
    id: BODEGA_2_FISCAL_LAYOUT.bodegaId,
    name: BODEGA_2_FISCAL_LAYOUT.name,
  },
  { id: "bodega-3-fiscal", name: "Bodega #3" },
  { id: "bodega-4-fiscal", name: "Bodega #4" },
  { id: "bodega-5-fiscal", name: "Bodega #5" },
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
