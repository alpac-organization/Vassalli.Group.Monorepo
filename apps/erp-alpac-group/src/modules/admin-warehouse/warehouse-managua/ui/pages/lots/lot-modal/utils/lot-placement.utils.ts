import type { LotItem } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-lots-req";

export type DispersionAxis = "X" | "Y";

export type LotPlacementInput = {
  quantity: number;
  width: number;
  length: number;
  sectionWidth: number;
  sectionLength: number;
  /** Eje elegido por el usuario para dispersar los tramos. */
  axis: DispersionAxis;
  /** Origen opcional dentro de la sección. Default 0. */
  initialPositionX?: number;
  initialPositionY?: number;
};

export type LotPlacementResult = {
  axis: DispersionAxis;
  axisMax: number;
  start: number;
  end: number;
  fits: boolean;
  /** Mensaje para mostrar al usuario. */
  message: string;
  /** Items listos para el POST, con coordenadas dispersas. */
  lots: Array<
    Pick<
      LotItem,
      "position_x" | "position_y" | "position_z" | "rotation_y" | "width" | "length"
    >
  >;
};

/**
 * Distribuye N tramos a lo largo del eje indicado por el usuario.
 * - Eje Y: avanza en Y, spacing = length del tramo.
 * - Eje X: avanza en X, spacing = width del tramo.
 *
 * Las coordenadas son relativas al origen de la sección (igual que ValidateLotPlacement).
 */
export const buildDispersedLotPlacements = (
  input: LotPlacementInput,
): LotPlacementResult => {
  const {
    quantity,
    width,
    length,
    sectionWidth,
    sectionLength,
    axis,
    initialPositionX = 0,
    initialPositionY = 0,
  } = input;

  const disperseAlongY = axis === "Y";
  const axisMax = disperseAlongY ? sectionLength : sectionWidth;
  const spacing = disperseAlongY ? length : width;
  const start = disperseAlongY ? initialPositionY : initialPositionX;
  const end = start + Math.max(quantity - 1, 0) * spacing + spacing;

  const crossExtent = disperseAlongY ? width : length;
  const crossMax = disperseAlongY ? sectionWidth : sectionLength;
  const crossOrigin = disperseAlongY ? initialPositionX : initialPositionY;

  const fitsAlongAxis = end <= axisMax + 0.001;
  const fitsCrossAxis = crossOrigin + crossExtent <= crossMax + 0.001;
  const fitsOrigin = initialPositionX >= 0 && initialPositionY >= 0;
  const fits =
    fitsAlongAxis &&
    fitsCrossAxis &&
    fitsOrigin &&
    quantity > 0 &&
    width > 0 &&
    length > 0;

  const lots = Array.from({ length: Math.max(quantity, 0) }, (_, index) => {
    const position_x = disperseAlongY
      ? initialPositionX
      : initialPositionX + index * spacing;
    const position_y = disperseAlongY
      ? initialPositionY + index * spacing
      : initialPositionY;

    return {
      width,
      length,
      position_x: Number(position_x.toFixed(2)),
      position_y: Number(position_y.toFixed(2)),
      position_z: 0,
      rotation_y: 0,
    };
  });

  const message = !quantity || !width || !length
    ? `Ingrese cantidad y dimensiones para proyectar la distribución (disponible: ${axisMax.toFixed(2)} m en eje ${axis}).`
    : fits
      ? `${quantity} tramos desde ${axis}=${start.toFixed(2)} m hasta ${axis}=${end.toFixed(2)} m (disponible: ${axisMax.toFixed(2)} m).`
      : `${quantity} tramos requieren hasta ${axis}=${end.toFixed(2)} m y exceden la sección (${axisMax.toFixed(2)} m en eje ${axis}).`;

  return {
    axis,
    axisMax,
    start,
    end,
    fits,
    message,
    lots,
  };
};

/** Valida un tramo individual contra las dimensiones de la sección (origen sección). */
export const isLotInsideSection = (
  positionX: number,
  positionY: number,
  lotWidth: number,
  lotLength: number,
  sectionWidth: number,
  sectionLength: number,
): boolean => {
  if (positionX < 0 || positionY < 0) return false;
  if (positionX + lotWidth > sectionWidth + 0.001) return false;
  if (positionY + lotLength > sectionLength + 0.001) return false;
  return true;
};
