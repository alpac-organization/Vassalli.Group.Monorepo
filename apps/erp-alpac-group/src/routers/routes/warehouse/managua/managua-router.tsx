import { AccessControlPage } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/access-control";
import { CuadrillaPage } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/cuadrillas/cuadrilla";
import { GoodsReceiptsPage } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/goods-receipts/goods-receipts";
import { WarehouseAllocationPage } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-allocation/warehouse-allocation";
import type { RouteObject } from "react-router-dom";

export const WarehouseManaguaRouter: RouteObject[] = [
  {
    path: "access-control",
    element: <AccessControlPage />,
  },
  {
    path: "merchandise-registration",
    element: <GoodsReceiptsPage />,
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
