import type { SectionDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/sections/get-sections-res";
import type { SectionMenuState } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/section-shape/components/section-shape-menu/section-shape-menu.types";
import type { Shape } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-shape/warehouse-shape.types";

export interface SectionShapeProps extends Shape<SectionDto> {
  section: SectionDto;
  onContextMenu?: (menu: SectionMenuState) => void;
}