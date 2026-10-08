import type { RouteObject } from "react-router-dom";
import Bodega from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/Bodega";
import { AccessControlPage } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/access-control";
import { SectionsPage } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/sections";
import { OngoingOperationsPage } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/ongoing-operations/ongoing-operations";

export const WarehouseManaguaRouter: RouteObject[] = [
  {
    path: "access-control",
    element: <AccessControlPage />,
  },
  {
    path: "ongoing-operations",
    element: <OngoingOperationsPage />,
  },
  {
    path: "warehouse-assignment",
    element: <h1>Asignación</h1>,
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
