import { Group, Rect, Text, Transformer } from "react-konva";
import { useEffect, useRef } from "react";
import type Konva from "konva";
import type { LotShapeProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/components/lot-shape/lot-shape.types";
import {
  RACK_STATUS_COLORS,
  resolveRackStatus,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/rack-status-badge";
import {
  bindShapeTransformer,
  commitMeasuredRect,
  commitShapeDragEnd,
  commitShapeResize,
  dragPositionLabel,
  metersToPixels,
  minimumTransformerBox,
  selectRaisedShape,
  shapeCaptionProps,
  shapeMenuFromEvent,
  useShapeLayout,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/utils/warehouse-utils";
import { ShapeLayoutLabel } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/shape-layout-label/shape-layout-label";
import { PositionShape } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/position-shape/position-shape";

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
  positions = [],
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

  const { size, setSize, layoutLabel, setLayoutLabel, textOffset, setTextOffset } = useShapeLayout(pixelWidth, pixelLength);

  useEffect(() => {
    bindShapeTransformer(transformRef.current, shapeRef.current, Boolean(resizable));
  }, [resizable, selected]);

  return (
    <>
      <Group
        ref={groupRef}
        id={lot.id}
        x={pixelX}
        y={pixelY}
        rotation={rotation}
        draggable={draggable}
        onDragMove={(e) => setLayoutLabel(dragPositionLabel(e.target).label)}
        onDragEnd={(e) => commitShapeDragEnd(e.target, lot.id, setLayoutLabel, onCoordinateChange)}
        onContextMenu={(e) => onContextMenu?.(shapeMenuFromEvent(e, lot))}
        onClick={(e) => selectRaisedShape(e, lot, onSelect)}
        onTap={(e) => selectRaisedShape(e, lot, onSelect)}
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
          onTransform={() => commitMeasuredRect(shapeRef.current, textRef.current, setSize, setTextOffset, setLayoutLabel)}
          onTransformEnd={() => commitShapeResize(
            shapeRef.current,
            groupRef.current,
            textRef.current,
            lot.id,
            setSize,
            setTextOffset,
            onCoordinateChange,
            onResizeChange,
          )}
        />

        <PositionShape
          positions={positions}
          containerWidthM={width}
          containerLengthM={length}
          layout="lot"
          levels={[1]}
        />


        {lot.code ? (
          <Text
            ref={textRef}
            text={lot.code}
            fill="#0f172a"
            {...shapeCaptionProps(textOffset, size)}
          />
        ) : null}
      </Group>

      {resizable && (
        <Transformer
          ref={transformRef}
          rotateEnabled={false}
          boundBoxFunc={minimumTransformerBox(10)}
        />
      )}
    </>
  );
};
