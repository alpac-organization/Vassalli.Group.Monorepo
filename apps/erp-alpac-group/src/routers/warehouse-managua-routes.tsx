import type { RouteObject } from "react-router-dom";
import { WarehouseManaguaPage } from "@app/modules/warehouse/ui/pages/warehouse-managua/ui/pages/reception-index/warehouse-managua.page";
import { WarehouseProvider } from "@app/modules/warehouse/ui/pages/warehouse-managua/ui/pages/reception-index/warehouse-managua.page";
import { DucaPanel } from "@app/modules/warehouse/ui/pages/warehouse-managua/ui/pages/duca-index/duca.page";

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
            <DucaPanel />
         </WarehouseProvider>
      ),
   },
];