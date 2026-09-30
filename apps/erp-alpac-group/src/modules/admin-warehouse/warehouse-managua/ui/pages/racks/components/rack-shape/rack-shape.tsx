import { Group, Label, Rect, Tag, Text } from "react-konva";
import { RACK_STATUS_COLORS, resolveRackStatus } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/rack-status-badge";
import type { RackShapeProps } from "./rack-shape.types";
import { DEFAULT_PIXELS_PER_METER } from "../../utils/style.racks";

export const RackShape = ({
  rack,
  selected = false,
  pixelsPerMeter = DEFAULT_PIXELS_PER_METER,
  isVertical = true,
  onSelect,
}: RackShapeProps) => {
  // Determinamos si está rotado 90° por su propiedad rotation_y, o fallback por la sección
  const isRotated90 = rack.rotation_y !== undefined && rack.rotation_y !== null
    ? Math.abs(rack.rotation_y - 90) < 0.01 || Math.abs(rack.rotation_y - 270) < 0.01
    : isVertical;

  // Dimensiones base del rack
  const rackWidthPx = (rack.width ?? 1.07) * pixelsPerMeter;
  const rackLengthPx = (rack.length ?? 2.44) * pixelsPerMeter;

  // Rotado 90° (vertical): ancho en X = Width, alto en Y = Length
  // Rotado 0° (horizontal): ancho en X = Length, alto en Y = Width
  const rectWidth = isRotated90 ? rackWidthPx : rackLengthPx;
  const rectHeight = isRotated90 ? rackLengthPx : rackWidthPx;

  // Coordenadas físicas directas
  const posX = (rack.position_x ?? 0) * pixelsPerMeter;
  const posY = (rack.position_y ?? 0) * pixelsPerMeter;

  const displayX = rack.position_x ?? 0;
  const displayY = rack.position_y ?? 0;

  const rackId = rack.rack_id;

  const resolved = resolveRackStatus(rack.status);
  const statusKey = (resolved?.textValue ?? "Available") as keyof typeof RACK_STATUS_COLORS;
  const fillColor = RACK_STATUS_COLORS[statusKey] ?? RACK_STATUS_COLORS.Available;

  const baseCode = rack.code?.includes("-")
    ? rack.code.split("-").slice(-1)[0]
    : (rack.code ?? "");
  const labelText = isRotated90
    ? `R\n${baseCode}\nN${rack.level_number}`
    : `R${baseCode} N${rack.level_number}`;

  return (
    <Group
      id={rackId}
      x={posX}
      y={posY}
      onClick={() => onSelect?.(rack)}
      onTap={() => onSelect?.(rack)}
    >
      <Rect
        width={rectWidth}
        height={rectHeight}
        fill={fillColor}
        opacity={selected ? 0.95 : 0.75}
        stroke={selected ? "#ffffff" : "#475569"}
        strokeWidth={selected ? 2.5 : 1}
        cornerRadius={2}
        shadowColor={selected ? "#38bdf8" : "transparent"}
        shadowBlur={selected ? 8 : 0}
        shadowOpacity={0.8}
      />
      <Text
        text={labelText}
        width={rectWidth}
        height={rectHeight}
        align="center"
        verticalAlign="middle"
        lineHeight={1.1}
        fill="#0f172a"
        fontStyle="bold"
        fontSize={Math.min(8.5, Math.max(6.5, Math.min(rectWidth, rectHeight) / 1.7))}
        listening={false}
      />    
      {selected && (
        <Label x={rectWidth + 6} y={Math.max(0, (rectHeight + 6) / 2)}>
          <Tag fill="#0f172a" cornerRadius={4} />
          <Text
            text={`X: ${displayX.toFixed(2)}m, Y: ${displayY.toFixed(2)}m`}
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
