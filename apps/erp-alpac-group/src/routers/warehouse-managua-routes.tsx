import type { RouteObject } from "react-router-dom";
import { WarehouseManaguaPage } from "@app/modules/warehouse/ui/pages/warehouse-managua-index/ui/pages/warehouse-managua.page";
import { WarehouseProvider } from "@app/modules/warehouse/ui/pages/warehouse-managua-index/context/wareouse-context";

export const WarehouseManaguaRoutes: RouteObject[] = [
   {
      index: true,
      element: (
         <WarehouseProvider>
            <WarehouseManaguaPage />
         </WarehouseProvider>
      ),
   },
   {
      path: "access-control",
      element: (
         <WarehouseProvider>
            <WarehouseManaguaPage />
         </WarehouseProvider>
      ),
   },
   {
      path: "merchandise-registration",
      element: (
         <WarehouseProvider>
            <WarehouseManaguaPage />
         </WarehouseProvider>
      ),
   },
];