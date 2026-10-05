import type { LotDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";
import type { LotMenuState } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/components/lot-shape/components/lot-shape-menu/lot-shape-menu.types";
import type { Shape } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-shape/warehouse-shape.types";

export interface LotShapeProps extends Shape<LotDto> {
  lot: LotDto;
  onContextMenu?: (menu: LotMenuState) => void;
}

/** Acota un valor entre min y max. */
export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));
