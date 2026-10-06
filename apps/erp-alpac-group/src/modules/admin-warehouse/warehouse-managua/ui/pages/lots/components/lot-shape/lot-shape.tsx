import { Group, Rect, Text, Transformer } from "react-konva";
import { useEffect, useRef, useState } from "react";
import type Konva from "konva";
import type { LotShapeProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/components/lot-shape/lot-shape.types";
import type { Coordinate, Size } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-shape/warehouse-shape.types";
import { PIXELS_PER_METER } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/warehouse-config";
import {
  RACK_STATUS_COLORS,
  resolveRackStatus,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/rack-status-badge";
import {
  applyShapeTransformEnd,
  bindShapeTransformer,
  formatPositionLabel,
  formatSizeLabel,
  keepMinimumTransformerBox,
  measureScaledRect,
  metersToPixels,
  raiseShape,
  readNodePositionInMeters,
  readShapeContextPoint,
  syncShapeLabel,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/utils/warehouse-utils";
import { ShapeLayoutLabel } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/shape-layout-label/shape-layout-label";

export const LotShape = ({
  x,
  y,
  width,
  length,
  rotation = 0,
  fill,
  strokeColor,
  selected = false,
  lot,
  draggable,
  resizable,
  onSelect,
  onContextMenu,
  onCoordinateChange,
  onResizeChange,
}: LotShapeProps) => {
  const pixelX = metersToPixels(x);
  const pixelY = metersToPixels(y);
  const pixelWidth = metersToPixels(width);
  const pixelLength = metersToPixels(length);

  const resolved = resolveRackStatus(lot.status);
  const statusKey = (resolved?.textValue ??
    "Available") as keyof typeof RACK_STATUS_COLORS;
  const fillColor =
    fill ?? RACK_STATUS_COLORS[statusKey] ?? RACK_STATUS_COLORS.Available;
  const borderColor = strokeColor ?? "#94a3b8";

  const groupRef = useRef<Konva.Group>(null);
  const shapeRef = useRef<Konva.Rect>(null);
  const textRef = useRef<Konva.Text>(null);
  const transformRef = useRef<Konva.Transformer>(null);

  const [size, setSize] = useState<Size>({
    width: pixelWidth,
    length: pixelLength,
  });
  const [layoutLabel, setLayoutLabel] = useState<string | null>(null);
  const [textOffset, setTextOffset] = useState<Coordinate>({ x: 0, y: 0 });

  useEffect(() => {
    setSize({ width: pixelWidth, length: pixelLength });
    setTextOffset({ x: 0, y: 0 });
  }, [pixelWidth, pixelLength]);

  useEffect(() => {
    bindShapeTransformer(transformRef.current, shapeRef.current, Boolean(resizable));
  }, [resizable, selected]);

  const syncTextWithRect = (node: Konva.Rect) => {
    const measure = measureScaledRect(node);
    setSize({ width: measure.width, length: measure.length });
    setTextOffset({ x: measure.x, y: measure.y });
    syncShapeLabel(textRef.current, measure);
    return measure;
  };

  return (
    <>
      <Group
        ref={groupRef}
        id={lot.id}
        x={pixelX}
        y={pixelY}
        rotation={rotation}
        draggable={draggable}
        onDragMove={(e) => {
          const position = readNodePositionInMeters(e.target);
          setLayoutLabel(formatPositionLabel(position.x, position.y));
        }}
        onDragEnd={(e) => {
          const position = readNodePositionInMeters(e.target);
          setLayoutLabel(null);
          onCoordinateChange?.(lot.id, position.x, position.y);
        }}
        onContextMenu={(e) => {
          const point = readShapeContextPoint(e);
          onContextMenu?.({
            x: point.x,
            y: point.y,
            data: lot,
            node: point.node,
          });
        }}
        onClick={(e) => {
          raiseShape(e);
          onSelect?.(lot);
        }}
        onTap={(e) => {
          raiseShape(e);
          onSelect?.(lot);
        }}
      >
        {resizable && layoutLabel && (
          <ShapeLayoutLabel x={textOffset.x} y={textOffset.y} text={layoutLabel} />
        )}

        <Rect
          ref={shapeRef}
          width={pixelWidth}
          height={pixelLength}
          fill={fillColor}
          opacity={selected ? 1 : 0.4}
          stroke={selected ? borderColor : "#94a3b8"}
          strokeWidth={selected ? 2 : 1}
          onTransform={() => {
            const node = shapeRef.current;
            if (!node) return;
            const measure = syncTextWithRect(node);
            setLayoutLabel(formatSizeLabel(measure.width, measure.length));
          }}
          onTransformEnd={() => {
            const node = shapeRef.current;
            const group = groupRef.current;
            if (!node || !group) return;

            const next = applyShapeTransformEnd({
              shapeRect: node,
              shapeGroup: group,
              labelText: textRef.current,
              pixelPerMeter: PIXELS_PER_METER
            });

            setSize({ width: next.widthInPixels, length: next.lengthInPixels });
            setTextOffset({ x: 0, y: 0 });
            onCoordinateChange?.(lot.id, next.xInMeters, next.yInMeters);
            onResizeChange?.(lot.id, next.widthInMeters, next.lengthInMeters);
          }}
        />

        {lot.code ? (
          <Text
            ref={textRef}
            x={textOffset.x}
            y={textOffset.y}
            text={lot.code}
            width={size.width}
            height={size.length}
            align="center"
            verticalAlign="middle"
            fill="#0f172a"
            fontSize={Math.min(12, Math.max(8, size.width / 6))}
            listening={false}
          />
        ) : null}
      </Group>

      {resizable && (
        <Transformer
          ref={transformRef}
          rotateEnabled={false}
          boundBoxFunc={(oldBox, newBox) =>
            keepMinimumTransformerBox(oldBox, newBox, 10)
          }
        />
      )}
    </>
  );
};
