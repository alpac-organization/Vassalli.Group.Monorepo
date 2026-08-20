import type { RouteObject } from "react-router-dom";
import { WarehousePage } from "@app/modules/warehouse/ui/view/warehouse/warehouse";
import { SectionsPage } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/sections";
import { TramosPage } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/tramos/tramos";
import { RacksPage } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/racks";

export const WarehouseAdminRouter: RouteObject[] = [
  {
    path: "management",
    element: <WarehousePage />,
  },
  {
    path: "management/sections/:warehouseId",
    element: <SectionsPage />,
  },
  {
    path: "management/sections/:warehouseId/lots/:sectionId",
    element: <TramosPage />,
  },
  {
    path: "management/sections/:warehouseId/racks/:sectionId",
    element: <RacksPage />,
  },
];
