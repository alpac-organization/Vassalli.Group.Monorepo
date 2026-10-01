import type { LotListItemResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";

/** Posicion del tramo en metros, relativa al origen (0,0) de la seccion. */
export interface LotPosition {
  positionX: number;
  positionY: number;
  positionZ: number;
  rotationY: number;
}

export interface LotShapeProps {
  lot: LotListItemResponse;
  /** Dimensiones del tramo en metros, vindas del endpoint de capacidades. */
  width: number;
  length: number;
  position: LotPosition;
  selected?: boolean;
  pixelsPerMeter: number;
  /** Limites de la seccion en metros, para acotar el arrastre. */
  sectionWidth: number;
  sectionLength: number;
  /** El tramo ya tiene coordenadas persistidas en el backend. */
  isPositioned: boolean;
  onSelect?: (lot: LotListItemResponse) => void;
  onPositionChange?: (lotId: string, position: LotPosition) => void;
}

export const DEFAULT_LOT_PIXELS_PER_METER = 12;

/** Acota un valor entre min y max. */
export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

/** Normaliza un angulo a 0..359. */
export const normalizeAngle = (degrees: number) =>
  ((degrees % 360) + 360) % 360;

/**
 * Extents del rect en metros segun la rotacion en Y.
 * Sin rotacion el largo ocupa X y el ancho Y; con 90/270 se invierten,
 * igual que el criterio usado en RackShape.
 */
export const getLotExtents = (width: number, length: number, rotationY: number) => {
  const angle = normalizeAngle(rotationY);
  const isRotated90 = angle === 90 || angle === 270;

  return isRotated90
    ? { extentX: width, extentY: length }
    : { extentX: length, extentY: width };
};
