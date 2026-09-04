import {
  METERS_TO_PIXELS,
  MIN_DRAW_METRES,
  SNAP_PIXELS,
} from "./layout-builder-2d.constants";
import type {
  CollisionContext,
  CollisionValidator,
  ExistingEntity,
  NormalizedRect,
  PixelRect,
  SpatialDraft,
} from "./layout-builder-2d.types";

export const snapToGrid = (value: number) =>
  Math.round(value / SNAP_PIXELS) * SNAP_PIXELS;

export const normalizePixelRect = (rect: PixelRect): NormalizedRect => {
  const x = Math.min(rect.x, rect.x + rect.width);
  const y = Math.min(rect.y, rect.y + rect.height);
  const width = Math.abs(rect.width);
  const height = Math.abs(rect.height);

  return { x, y, width, height };
};

export const entityToNormalizedRect = (entity: ExistingEntity): NormalizedRect => ({
  x: entity.position_x * METERS_TO_PIXELS,
  y: entity.position_z * METERS_TO_PIXELS,
  width: entity.width_metres * METERS_TO_PIXELS,
  height: entity.length_metres * METERS_TO_PIXELS,
});

export const rectsIntersect = (a: NormalizedRect, b: NormalizedRect) =>
  a.x < b.x + b.width &&
  a.x + a.width > b.x &&
  a.y < b.y + b.height &&
  a.y + a.height > b.y;

export const isWithinContainer = (
  rect: NormalizedRect,
  containerWidthMetres: number,
  containerLengthMetres: number,
) => {
  const maxX = containerWidthMetres * METERS_TO_PIXELS;
  const maxY = containerLengthMetres * METERS_TO_PIXELS;

  return (
    rect.x >= 0 &&
    rect.y >= 0 &&
    rect.x + rect.width <= maxX &&
    rect.y + rect.height <= maxY
  );
};

export const defaultCollisionValidator: CollisionValidator = (
  draft,
  existing,
) => {
  for (const entity of existing) {
    if (rectsIntersect(draft, entityToNormalizedRect(entity))) {
      return false;
    }
  }

  return true;
};

export const validateDraftRect = (
  rect: PixelRect,
  containerWidthMetres: number,
  containerLengthMetres: number,
  existingEntities: ExistingEntity[],
  collisionValidator: CollisionValidator,
  context: CollisionContext,
) => {
  const normalized = normalizePixelRect(rect);

  if (normalized.width === 0 || normalized.height === 0) {
    return false;
  }

  if (!isWithinContainer(normalized, containerWidthMetres, containerLengthMetres)) {
    return false;
  }

  return collisionValidator(normalized, existingEntities, context);
};

export const pixelRectToSpatialDraft = (rect: PixelRect): SpatialDraft => {
  const normalized = normalizePixelRect(rect);

  return {
    position_x: normalized.x / METERS_TO_PIXELS,
    position_y: 0,
    position_z: normalized.y / METERS_TO_PIXELS,
    rotation_y: 0,
    width_metres: normalized.width / METERS_TO_PIXELS,
    length_metres: normalized.height / METERS_TO_PIXELS,
  };
};

export const formatMetres = (value: number) =>
  `${value.toFixed(1)} m`;

export const formatDimensions = (widthMetres: number, lengthMetres: number) =>
  `${formatMetres(widthMetres)} × ${formatMetres(lengthMetres)}`;

export const isValidDrawSize = (rect: PixelRect) => {
  const normalized = normalizePixelRect(rect);
  const widthMetres = normalized.width / METERS_TO_PIXELS;
  const lengthMetres = normalized.height / METERS_TO_PIXELS;

  return widthMetres >= MIN_DRAW_METRES && lengthMetres >= MIN_DRAW_METRES;
};

export const toScreenPosition = (
  rect: NormalizedRect,
  stagePosition: { x: number; y: number },
  scale: number,
) => ({
  x: stagePosition.x + (rect.x + rect.width / 2) * scale,
  y: stagePosition.y + (rect.y + rect.height / 2) * scale,
});
