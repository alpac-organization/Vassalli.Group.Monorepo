import type { RouteObject } from "react-router-dom";
import { WarehouseManaguaPage } from "@app/modules/warehouse/ui/pages/warehouse-managua-index/warehouse-managua.page";

export const WarehouseManaguaRoutes: RouteObject[] = [
   {
      index: true,
      element: <WarehouseManaguaPage />,
   }
];
