import type { LotDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";
import type { WarehouseDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/warehouses/get-warehouse-res";
import type { Coordinate, Size } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-shape/warehouse-shape.types";

export interface LotViewerProps {
  className?: string;
  warehouse?: WarehouseDto;
  lots?: LotDto[];
  selectedLot?: LotDto | null;
  onSelectLot?: (lot: LotDto) => void;
  /** Dimensiones y posición de la sección dentro de la bodega. */
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
