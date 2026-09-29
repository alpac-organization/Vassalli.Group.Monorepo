import type { RouteObject } from "react-router-dom";
import { SectionsPage } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/sections";
import { TramosPage } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/lots";
import { RacksPage } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/racks";
import { WarehousePage } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/warehouse";

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
