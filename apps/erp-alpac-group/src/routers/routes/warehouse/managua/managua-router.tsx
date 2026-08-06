import { AccessControlPage } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/access-control";
import { CuadrillaPage } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/cuadrillas/cuadrilla";
import { WarehouseAllocationPage } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-allocation/warehouse-allocation";
import type { RouteObject } from "react-router-dom";
import { MerchandisePage } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/merchandise";

export const WarehouseManaguaRouter: RouteObject[] = [
  {
    path: "access-control",
    element: <AccessControlPage />,
  },
  {
    path: "mercaderia",
    element: <MerchandisePage />,
  },
  {
    path: "warehouse-allocation",
    element: <WarehouseAllocationPage />,
  },
  {
    path: "cuadrillas",
    element: <CuadrillaPage />,
  },
  {
    path: "gate-entry",
    element: <h1>Gate Entry</h1>,
  },
];
