import { WarehouseProvider } from "@app/modules/warehouse/ui/warehouse-managua/context/wareouse-context";
import { DucaPanel } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/duca-index/duca.page";
import { WarehouseManaguaPage } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/reception-index/warehouse-managua.page";
import type { RouteObject } from "react-router-dom";

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