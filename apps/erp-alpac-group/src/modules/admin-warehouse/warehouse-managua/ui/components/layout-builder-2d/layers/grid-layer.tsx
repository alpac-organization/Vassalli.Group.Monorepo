import { memo, useMemo } from "react";
import { Group, Line, Rect } from "react-konva";
import {
  METERS_TO_PIXELS,
  SNAP_PIXELS,
} from "../layout-builder-2d.constants";

interface GridLayerProps {
  containerWidthMetres: number;
  containerLengthMetres: number;
  scale: number;
}

export const GridLayer = memo(function GridLayer({
  containerWidthMetres,
  containerLengthMetres,
  scale,
}: GridLayerProps) {
  const widthPx = containerWidthMetres * METERS_TO_PIXELS;
  const heightPx = containerLengthMetres * METERS_TO_PIXELS;

  const gridLines = useMemo(() => {
    const lines = [];
    const strokeWidth = 1 / scale;

    for (let x = 0; x <= widthPx; x += SNAP_PIXELS) {
      lines.push(
        <Line
          key={`v-${x}`}
          points={[x, 0, x, heightPx]}
          stroke="#334155"
          strokeWidth={strokeWidth}
          listening={false}
        />,
      );
    }

    for (let y = 0; y <= heightPx; y += SNAP_PIXELS) {
      lines.push(
        <Line
          key={`h-${y}`}
          points={[0, y, widthPx, y]}
          stroke="#334155"
          strokeWidth={strokeWidth}
          listening={false}
        />,
      );
    }

    return lines;
  }, [heightPx, scale, widthPx]);

  return (
    <Group listening={false}>
      <Rect
        x={0}
        y={0}
        width={widthPx}
        height={heightPx}
        fill="#1e293b"
        stroke="#475569"
        strokeWidth={2 / scale}
        listening={false}
      />
      {gridLines}
    </Group>
  );
});
