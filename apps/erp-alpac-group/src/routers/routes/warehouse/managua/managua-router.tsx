import type { RouteObject } from "react-router-dom";
import { AccessControlPage } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/access-control";
import { WarehouseAssignmentPage } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/warehouse-assignment";
import { SectionsPage } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/sections";
import Bodega from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/Bodega";

export const WarehouseManaguaRouter: RouteObject[] = [
  {
    path: "access-control",
    element: <AccessControlPage />,
  },
  {
    path: "warehouse-assignment",
    element: <WarehouseAssignmentPage />,
  },
  {
    path: "gate-entry",
    element: <h1>Gate Entry</h1>,
  },
  {
    path: "warehouse/:warehouseId/sections",
    element: <SectionsPage />,
  },
  {
    path: "bodegas",
    element: <Bodega />,
  },
];
