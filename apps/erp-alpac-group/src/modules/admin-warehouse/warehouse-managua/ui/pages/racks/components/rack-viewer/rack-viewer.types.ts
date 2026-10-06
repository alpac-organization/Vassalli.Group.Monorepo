import type { RackDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/racks/get-racks-res";
import type { WarehouseDetailsDto } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/utils/warehouse-details.mapper";

export interface RackViewerProps {
  className?: string;
  warehouse?: WarehouseDetailsDto;
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
