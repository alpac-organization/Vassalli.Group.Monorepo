import type { LotDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";
import type { MenuState } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/shape-context-menu/shape-context-menu.types";
import type { Shape } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-shape/warehouse-shape.types";

export interface LotShapeProps extends Shape<LotDto> {
  lot: LotDto;
  onContextMenu?: (menu: MenuState<LotDto>) => void;
}

/** Acota un valor entre min y max. */
export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));
