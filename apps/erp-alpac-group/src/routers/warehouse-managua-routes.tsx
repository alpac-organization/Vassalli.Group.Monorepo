import type { RouteObject } from "react-router-dom";
import { WarehouseManaguaPage } from "@app/modules/warehouse/ui/pages/warehouse-managua-index/ui/pages/managua-reception/warehouse-managua.page";
import { DucaDetailsPanel } from "@app/modules/warehouse/ui/pages/warehouse-managua-index/ui/pages/managua-reception/components/duca-panel/duca-details-panel";

export const WarehouseManaguaRoutes: RouteObject[] = [
   {
      index: true,
      element: <WarehouseManaguaPage />, // Aseguramos que se invoque de forma correcta
   },
   {
      path: "warehouse-section1",
      element: <DucaDetailsPanel />, // Aseguramos que se invoque de forma correcta
   }
];