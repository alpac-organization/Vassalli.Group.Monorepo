export type SlotStatus = "free" | "occupied";

export type PolinCount = 0 | 1 | 2;

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

export const STATUS_COLOR: Record<SlotStatus, string> = {
  free: "#22c55e",
  occupied: "#f97316",
};
export const STATUS_LABEL: Record<SlotStatus, string> = {
  free: "Libre",
  occupied: "Ocupada",
};

export const POLINES_PER_LEVEL = 2 as const;

export function polinesFromStatus(status: SlotStatus): PolinCount {
  return status === "occupied" ? 2 : 0;
}

export function resolvePolines(occ: LocationOccupancy | undefined): PolinCount {
  if (!occ) return 0;
  if (occ.polines === 0 || occ.polines === 1 || occ.polines === 2) {
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

export const BOX_HEIGHT = 0.5;

export const FLOOR_PLATE_HEIGHT = 0.25;

export const RACK_FRAME_HEIGHT = 6;
