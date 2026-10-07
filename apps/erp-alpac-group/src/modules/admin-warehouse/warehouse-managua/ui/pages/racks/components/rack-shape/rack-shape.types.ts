import type { RackDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/racks/get-racks-res";

export interface RackShapeProps {
  rack: RackDto;
  selected?: boolean;
  pixelsPerMeter?: number;
  canvasWidth?: number;
  isVertical?: boolean;
  onSelect?: (rack: RackDto) => void;
}

