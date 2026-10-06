import type { SectionDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/sections/get-sections-res";
import type { MenuState } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/shape-context-menu/shape-context-menu.types";
import type { Shape } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-shape/warehouse-shape.types";

export interface SectionShapeProps extends Shape<SectionDto> {
  section: SectionDto;
  onContextMenu?: (menu: MenuState<SectionDto>) => void;
}