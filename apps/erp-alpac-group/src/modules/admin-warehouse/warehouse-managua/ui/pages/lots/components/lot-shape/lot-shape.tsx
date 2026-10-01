import { useEffect, useRef } from "react";
import { Group, Label, Rect, Tag, Text } from "react-konva";
import type Konva from "konva";
import { RACK_STATUS_COLORS, resolveRackStatus } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/rack-status-badge";
import { clamp, getLotExtents, type LotShapeProps } from "./lot-shape.types";

export const LotShape = ({
  lot,
  width,
  length,
  position,
  selected = false,
  pixelsPerMeter,
  sectionWidth,
  sectionLength,
  isPositioned,
  onSelect,
  onPositionChange,
}: LotShapeProps) => {
  const groupRef = useRef<Konva.Group>(null);

  const { extentX, extentY } = getLotExtents(
    width,
    length,
    position.rotationY,
  );

  const rectWidthPx = extentX * pixelsPerMeter;
  const rectHeightPx = extentY * pixelsPerMeter;

  // Sincroniza el nodo cuando las coordenadas cambian desde arriba (refetch o reset).
  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    group.position({
      x: position.positionX * pixelsPerMeter,
      y: position.positionY * pixelsPerMeter,
    });
  }, [position.positionX, position.positionY, pixelsPerMeter]);

  const handleDragEnd = () => {
    const group = groupRef.current;
    if (!group) return;

    const maxX = Math.max(0, sectionWidth - extentX);
    const maxY = Math.max(0, sectionLength - extentY);

    const nextXMeters = clamp(group.x() / pixelsPerMeter, 0, maxX);
    const nextYMeters = clamp(group.y() / pixelsPerMeter, 0, maxY);

    group.position({
      x: nextXMeters * pixelsPerMeter,
      y: nextYMeters * pixelsPerMeter,
    });

    onPositionChange?.(lot.id, {
      positionX: Number(nextXMeters.toFixed(2)),
      positionY: Number(nextYMeters.toFixed(2)),
      positionZ: position.positionZ ?? 0,
      rotationY: position.rotationY ?? 0,
    });
  };

  const resolved = resolveRackStatus(lot.status);
  const statusKey = (resolved?.textValue ??
    "Available") as keyof typeof RACK_STATUS_COLORS;
  const fillColor = RACK_STATUS_COLORS[statusKey] ?? RACK_STATUS_COLORS.Available;

  const fontSize = Math.min(
    11,
    Math.max(6.5, Math.min(rectWidthPx, rectHeightPx) / 2.2),
  );

  return (
    <Group
      ref={groupRef}
      id={lot.id}
      x={position.positionX * pixelsPerMeter}
      y={position.positionY * pixelsPerMeter}
      draggable
      onClick={() => onSelect?.(lot)}
      onTap={() => onSelect?.(lot)}
      onDragEnd={handleDragEnd}
    >
      <Rect
        width={rectWidthPx}
        height={rectHeightPx}
        fill={fillColor}
        opacity={selected ? 0.9 : 0.6}
        stroke={selected ? "#ffffff" : "#334155"}
        strokeWidth={selected ? 2.5 : 1}
        cornerRadius={2}
        dash={isPositioned ? undefined : [6, 4]}
        shadowColor={selected ? "#38bdf8" : "transparent"}
        shadowBlur={selected ? 8 : 0}
        shadowOpacity={0.8}
      />

      <Text
        text={lot.code || "SIN CÓDIGO"}
        width={rectWidthPx}
        height={rectHeightPx}
        align="center"
        verticalAlign="middle"
        lineHeight={1.1}
        fill="#0f172a"
        fontStyle="bold"
        fontSize={fontSize}
        listening={false}
      />

      {rectHeightPx > 26 && rectWidthPx > 40 && (
        <Text
          text={`${width} x ${length} m`}
          width={rectWidthPx}
          y={rectHeightPx / 2}
          align="center"
          fill="#0f172a"
          opacity={0.75}
          fontSize={Math.max(5.5, fontSize - 2)}
          listening={false}
        />
      )}

      {lot.allows_stacking && (
        <Label x={2} y={2}>
          <Tag fill="#0f172a" cornerRadius={2} opacity={0.8} />
          <Text
            text="E"
            fill="#4ade80"
            fontSize={Math.max(6, fontSize - 2)}
            padding={2}
            listening={false}
          />
        </Label>
      )}

      {selected && (
        <Label x={rectWidthPx + 6} y={Math.max(0, (rectHeightPx + 6) / 2)}>
          <Tag fill="#0f172a" cornerRadius={4} />
          <Text
            text={`X: ${position.positionX.toFixed(2)}m, Y: ${position.positionY.toFixed(2)}m`}
            fontSize={11}
            fill="#e2e8f0"
            padding={4}
            listening={false}
          />
        </Label>
      )}
    </Group>
  );
};
