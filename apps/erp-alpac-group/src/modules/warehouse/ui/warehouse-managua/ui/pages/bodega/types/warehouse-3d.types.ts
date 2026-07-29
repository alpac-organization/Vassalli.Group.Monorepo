export type SlotStatus = "free" | "occupied";

export type PolinCount = number;

export type LocationCode = string;

export type TramoProps = "floor" | "rack";

export type CameraProps = "isometric" | "reset";

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface TramoSize {
  width: number;
  depth: number;
}

export interface FloorTramo {
  id: string;
  warehouseNumber: number;
  kind: "floor";
  code: LocationCode;
  column: "left" | "right";
  position: { x: number; z: number };
  size: TramoSize;
}

export interface RackTramo {
  id: string;
  warehouseNumber: number;
  kind: "rack";
  baseCode: LocationCode;
  column: "centerLeft" | "centerRight";
  position: { x: number; z: number };
  size: TramoSize;
  levels: readonly [LocationCode, LocationCode, LocationCode];
}

export type Tramo = FloorTramo | RackTramo;

export interface WarehouseBuilding {
  width: number;
  depth: number;
  galeronDepth: number;
  wallClearance: number;
  aisleWidth: number;
  heightHigh: number;
  heightLow: number;
  sideTramoWidth: number;
  centerTramoWidth: number;
  centerBlockWidth: number;
}

export interface WarehouseLayout {
  bodegaId: string;
  name: string;
  building: WarehouseBuilding;
  floorTramos: FloorTramo[];
  rackTramos: RackTramo[];
}

export interface LocationOccupancy {
  status: SlotStatus;
  polines?: PolinCount;
}

export type OccupancyMap = Record<LocationCode, LocationOccupancy>;

export const CM = 0.01;

export const POLIN_WIDTH = 2.2;
export const POLIN_DEPTH = 2.2;

export const FLOOR_POLINES_MAX = 7 as const;
export const FLOOR_POLINES_BOTH_SIDES = FLOOR_POLINES_MAX * 2;

export const RACK_FLOOR_POLINES_MAX = 4 as const;
export const POLINES_PER_LEVEL = 2 as const;

export const BOXES_PER_POLIN = 2 as const;
export const POLIN_HEIGHT = 0.24;
export const SMALL_BOX_WIDTH = 0.82;
export const SMALL_BOX_DEPTH = 0.5;
export const SMALL_BOX_HEIGHT = 0.36;

export const TRAMO_STRIP_COLOR = "#e8d98a";
export const POLIN_SLOT_COLOR = "#0a1628";

export const STATUS_COLOR: Record<SlotStatus, string> = {
  free: POLIN_SLOT_COLOR,
  occupied: "#f97316",
};

export const STATUS_LABEL: Record<SlotStatus, string> = {
  free: "Libre",
  occupied: "Ocupada",
};

export function polinesFromStatus(status: SlotStatus): PolinCount {
  return status === "occupied" ? POLINES_PER_LEVEL : 0;
}

export function resolvePolines(occ: LocationOccupancy | undefined): PolinCount {
  if (!occ) return 0;
  if (typeof occ.polines === "number" && occ.polines >= 0) {
    return occ.polines;
  }
  return polinesFromStatus(occ.status);
}

export function resolveStatus(occ: LocationOccupancy | undefined): SlotStatus {
  return resolvePolines(occ) > 0 ? "occupied" : "free";
}

export function occupancyOf(
  map: OccupancyMap,
  code: LocationCode,
): LocationOccupancy {
  return map[code] ?? { status: "free", polines: 0 };
}

export const LEVEL_HEIGHT = 2;
export const BOX_HEIGHT = SMALL_BOX_HEIGHT;
export const FLOOR_PLATE_HEIGHT = 0.12;
export const RACK_FRAME_HEIGHT = 6;
export const SHELF_THICKNESS = 0.1;
