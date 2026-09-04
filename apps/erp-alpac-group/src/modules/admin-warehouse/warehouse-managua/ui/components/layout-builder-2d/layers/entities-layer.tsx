import { memo, useMemo } from "react";
import { Group, Line, Rect, Text } from "react-konva";
import {
  ENTITY_COLORS,
  METERS_TO_PIXELS,
  STORAGE_TYPE_COLORS,
} from "../layout-builder-2d.constants";
import type { ExistingEntity } from "../layout-builder-2d.types";
import { SectionStorageTypeEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-storage-type";

interface EntitiesLayerProps {
  entities: ExistingEntity[];
  scale: number;
  selectedEntityId?: string;
  dimUnselected?: boolean;
}

const getEntityStyle = (entity: ExistingEntity) => {
  if (entity.storage_type && STORAGE_TYPE_COLORS[entity.storage_type]) {
    return STORAGE_TYPE_COLORS[entity.storage_type];
  }

  if (entity.kind && ENTITY_COLORS[entity.kind]) {
    return ENTITY_COLORS[entity.kind];
  }

  return ENTITY_COLORS.section;
};

const buildHatchLines = (
  x: number,
  y: number,
  width: number,
  height: number,
  step: number,
) => {
  const lines: number[][] = [];
  const max = width + height;

  for (let offset = -height; offset < max; offset += step) {
    const x1 = x + Math.max(0, offset);
    const y1 = y + Math.max(0, -offset);
    const x2 = x + Math.min(width, offset + height);
    const y2 = y + Math.min(height, width - offset);

    if (x2 > x1 && y2 > y1) {
      lines.push([x1, y1, x2, y2]);
    }
  }

  return lines;
};

const getRenderPriority = (entity: ExistingEntity) => {
  if (entity.storage_type === SectionStorageTypeEnum.Racks.textValue) {
    return 2;
  }
  if (entity.kind === "rack") {
    return 2;
  }
  if (entity.storage_type === SectionStorageTypeEnum.Lots.textValue) {
    return 1;
  }
  if (entity.kind === "lot") {
    return 1;
  }
  return 0;
};

export const EntitiesLayer = memo(function EntitiesLayer({
  entities,
  scale,
  selectedEntityId,
  dimUnselected = false,
}: EntitiesLayerProps) {
  const sortedEntities = useMemo(
    () =>
      [...entities].sort(
        (a, b) => getRenderPriority(a) - getRenderPriority(b),
      ),
    [entities],
  );

  return (
    <>
      {sortedEntities.map((entity) => {
        const style = getEntityStyle(entity);
        const x = entity.position_x * METERS_TO_PIXELS;
        const y = entity.position_z * METERS_TO_PIXELS;
        const width = entity.width_metres * METERS_TO_PIXELS;
        const height = entity.length_metres * METERS_TO_PIXELS;
        const isElevated = (entity.position_y ?? 0) > 0;
        const dash =
          "dash" in style && Array.isArray(style.dash)
            ? (style.dash as number[])
            : undefined;
        const hatchLines = isElevated
          ? buildHatchLines(x, y, width, height, 14 / scale)
          : [];
        const isSelected = entity.id === selectedEntityId;
        const opacity = dimUnselected && !isSelected ? 0.38 : 1;

        return (
          <Group
            key={entity.id}
            listening={false}
            x={x}
            y={y}
            rotation={entity.rotation_y ?? 0}
            opacity={opacity}
          >
            <Rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill={style.fill}
              stroke={isSelected ? "#f8fafc" : style.stroke}
              strokeWidth={(isSelected ? 4 : isElevated ? 2.5 : 2) / scale}
              dash={dash ? dash.map((value: number) => value / scale) : undefined}
              cornerRadius={2 / scale}
            />
            {hatchLines.map((points, index) => (
              <Line
                key={`${entity.id}-hatch-${index}`}
                points={points.map((value, pointIndex) =>
                  pointIndex % 2 === 0 ? value - x : value - y,
                )}
                stroke={style.stroke}
                strokeWidth={1 / scale}
                opacity={0.35}
                listening={false}
              />
            ))}
            {entity.name ? (
              <Text
                x={6 / scale}
                y={6 / scale}
                text={
                  isElevated && entity.kind === "section"
                    ? `${entity.name} (Y: ${entity.position_y?.toFixed(1)}m)`
                    : entity.name
                }
                fill="#f8fafc"
                fontSize={12 / scale}
                listening={false}
              />
            ) : null}
            <Text
              x={6 / scale}
              y={height - 18 / scale}
              text={`${entity.width_metres.toFixed(1)}m × ${entity.length_metres.toFixed(1)}m`}
              fill="#cbd5e1"
              fontSize={10 / scale}
              listening={false}
            />
          </Group>
        );
      })}
    </>
  );
});
