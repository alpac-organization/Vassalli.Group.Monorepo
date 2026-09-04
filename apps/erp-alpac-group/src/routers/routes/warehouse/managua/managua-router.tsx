import { AccessControlPage } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/access-control";
import { CuadrillaPage } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/cuadrillas/cuadrilla";
import type { RouteObject } from "react-router-dom";
import { MerchandisePage } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/merchandise";
import { WarehousePage } from "@app/modules/warehouse/ui/view/warehouse/warehouse";
import { SectionsPage } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/sections";
import Bodega from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/Bodega";
import { MerchandiseUnloadingControl } from "@app/modules/warehouse/ui/warehouse-managua/pages/merchandise-unloading-control/merchandise-unloading-control";
import { MerchandiseManagement } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise-management/merchandise-management";

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
    path: "cuadrillas",
    element: <CuadrillaPage />,
  },
  {
    path: "gate-entry",
    element: <h1>Gate Entry</h1>,
  },
  {
    path: "warehouse",
    element: <WarehousePage />,
  },
  {
    path: "warehouse/:warehouseId/sections",
    element: <SectionsPage />,
  },
  {
    path: "bodegas",
    element: <Bodega />,
  },
  {
    path: "merchandise-management",
    // element: <MerchandiseUnloadingControl />,
    element: <MerchandiseManagement />
  }
];
