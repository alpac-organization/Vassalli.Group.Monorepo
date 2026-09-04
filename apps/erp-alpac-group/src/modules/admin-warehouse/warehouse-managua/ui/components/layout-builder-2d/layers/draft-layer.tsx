import { memo } from "react";
import { Group, Rect, Text } from "react-konva";
import type { PixelRect } from "../layout-builder-2d.types";
import {
  formatDimensions,
  normalizePixelRect,
} from "../layout-builder-2d.utils";
import { METERS_TO_PIXELS } from "../layout-builder-2d.constants";

interface DraftLayerProps {
  draftRect: PixelRect | null;
  isValid: boolean;
  scale: number;
  pointerPosition: { x: number; y: number } | null;
}

export const DraftLayer = memo(function DraftLayer({
  draftRect,
  isValid,
  scale,
  pointerPosition,
}: DraftLayerProps) {
  if (!draftRect) {
    return null;
  }

  const normalized = normalizePixelRect(draftRect);
  const widthMetres = normalized.width / METERS_TO_PIXELS;
  const lengthMetres = normalized.height / METERS_TO_PIXELS;
  const dimensionLabel = formatDimensions(widthMetres, lengthMetres);

  const labelX = normalized.x + normalized.width / 2;
  const labelY = normalized.y + normalized.height / 2;

  return (
    <Group listening={false}>
      <Rect
        x={normalized.x}
        y={normalized.y}
        width={normalized.width}
        height={normalized.height}
        fill={isValid ? "rgba(59, 130, 246, 0.3)" : "rgba(239, 68, 68, 0.3)"}
        stroke={isValid ? "#3b82f6" : "#ef4444"}
        strokeWidth={2 / scale}
        dash={[6 / scale, 4 / scale]}
      />

      <Group>
        <Rect
          x={labelX - 52 / scale}
          y={labelY - 12 / scale}
          width={104 / scale}
          height={24 / scale}
          fill="rgba(15, 23, 42, 0.9)"
          cornerRadius={4 / scale}
        />
        <Text
          x={labelX}
          y={labelY}
          text={dimensionLabel}
          fill="#f8fafc"
          fontSize={12 / scale}
          align="center"
          offsetX={50 / scale}
          offsetY={6 / scale}
        />
      </Group>

      {pointerPosition ? (
        <Group>
          <Rect
            x={pointerPosition.x + 12 / scale}
            y={pointerPosition.y + 12 / scale}
            width={120 / scale}
            height={22 / scale}
            fill="rgba(15, 23, 42, 0.92)"
            cornerRadius={4 / scale}
          />
          <Text
            x={pointerPosition.x + 18 / scale}
            y={pointerPosition.y + 18 / scale}
            text={`Pos: ${(pointerPosition.x / METERS_TO_PIXELS).toFixed(1)}m, ${(pointerPosition.y / METERS_TO_PIXELS).toFixed(1)}m`}
            fill="#94a3b8"
            fontSize={10 / scale}
          />
        </Group>
      ) : null}
    </Group>
  );
});
