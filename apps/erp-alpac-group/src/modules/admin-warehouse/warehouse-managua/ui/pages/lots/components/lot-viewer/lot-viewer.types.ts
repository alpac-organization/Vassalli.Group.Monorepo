import type { LotDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";
import type { Coordinate, Size } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-shape/warehouse-shape.types";
import type { WarehouseDetailsDto } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/utils/warehouse-details.mapper";

export interface LotViewerProps {
  className?: string;
  warehouse?: WarehouseDetailsDto;
  lots?: LotDto[];
  selectedLot?: LotDto | null;
  onSelectLot?: (lot: LotDto) => void;
  sectionCode?: string | null;
  sectionWidth?: number;
  sectionLength?: number;
  sectionPositionX?: number;
  sectionPositionY?: number;
  sectionIsActive?: boolean;
}

export type EditMode = "edit" | null;

export type LotCoordinate = Record<string, Coordinate>;

export type LotSize = Record<string, Size>;
