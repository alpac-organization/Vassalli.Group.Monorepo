import type { RackDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/racks/get-racks-res";
import type { PositionItemDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/sections/get-positions-res";

export interface RackShapeProps {
  rack: RackDto;
  positions?: PositionItemDto[];
  selected?: boolean;
  pixelsPerMeter?: number;
  canvasWidth?: number;
  isVertical?: boolean;
  onSelect?: (rack: RackDto) => void;
}

