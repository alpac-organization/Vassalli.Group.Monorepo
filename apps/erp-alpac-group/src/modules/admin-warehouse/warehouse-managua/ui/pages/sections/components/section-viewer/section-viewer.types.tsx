import type { Coordinate, Size } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-shape/warehouse-shape.types";
import type { SectionDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/sections/get-sections-res";
import type { WarehouseDetailsDto } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/utils/warehouse-details.mapper";

export interface SectionViewerProps {
  className?: string;
  warehouse?: WarehouseDetailsDto;
  sections?: SectionDto[];
  selectedSection?: SectionDto | null;
  onSelectSection?: (section: SectionDto) => void;
}

export type EditMode = "edit" | null;

export type SectionCoordinate = Record<string, Coordinate>;

export type SectionSize = Record<string, Size>;