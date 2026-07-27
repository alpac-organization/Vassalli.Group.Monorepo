export type SlotStatus = "free" | "occupied" | "reserved";

export type LocationCode = string;

export type TramoKind = "floor" | "rack";

export type CameraPreset = "isometric" | "top" | "reset";

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
  kind: "floor";
  code: LocationCode;
  column: "left" | "right";
  position: { x: number; z: number };
  size: TramoSize;
}

export interface RackTramo {
  id: string;
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

export type OccupancyMap = Record<LocationCode, SlotStatus>;

export const STATUS_COLOR: Record<SlotStatus, string> = {
  free: "#22c55e",
  occupied: "#ef4444",
  reserved: "#eab308",
};

export const STATUS_LABEL: Record<SlotStatus, string> = {
  free: "Libre",
  occupied: "Ocupada",
  reserved: "Reservada",
};

export const LEVEL_HEIGHT = 2;

export const BOX_HEIGHT = 1.4;

export const FLOOR_PLATE_HEIGHT = 0.25;

export const RACK_FRAME_HEIGHT = 6;
