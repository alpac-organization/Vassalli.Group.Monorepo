import type { RackDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/racks/get-racks-res";

export interface RackViewerProps {
  className?: string;
  racks?: RackDto[];
  selectedRackId?: string | null;
  sectionCode?: string;
  warehouseName?: string;
  sectionWidth?: number;
  sectionLength?: number;
  sectionPositionX?: number;
  sectionPositionY?: number;
  onSelectRack?: (rack: RackDto) => void;
}
