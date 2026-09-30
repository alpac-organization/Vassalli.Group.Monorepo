import type { SectionDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/sections/get-sections-res";
import type { WarehouseDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/warehouses/get-warehouse-res";
import type { Coordinate, Size } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-shape/warehouse-shape.types";

export interface SectionViewerProps {
  className?: string;
  warehouse?: WarehouseDto;
  sections?: SectionDto[];
  selectedSection?: SectionDto | null;
  onSelectSection?: (section: SectionDto) => void;
}

export type EditMode = "edit" | null;

export type SectionCoordinate = Record<string, Coordinate>;

export type SectionSize = Record<string, Size>;