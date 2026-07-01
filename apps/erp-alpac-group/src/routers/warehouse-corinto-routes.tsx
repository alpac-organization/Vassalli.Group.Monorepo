import type { RouteObject } from "react-router-dom";
import { WarehouseCorintoPage } from "@app/modules/warehouse/ui/pages/warehouse-corinto-index/warehouse-corinto.page";

export const WarehouseCorintoRoutes: RouteObject[] = [
   {
      index: true,
      element: <WarehouseCorintoPage />,
   }
];
