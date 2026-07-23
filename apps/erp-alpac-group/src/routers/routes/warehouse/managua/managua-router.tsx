import { WarehouseProvider } from "@app/modules/warehouse/ui/warehouse-managua/context/wareouse-context";
import { WarehouseManaguaPage } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/reception-index/warehouse-managua.page";
import type { RouteObject } from "react-router-dom";
import Bodega from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/Bodega";

export const WarehouseManaguaRouter: RouteObject[] = [
  {
    path: "access-control",
    element: (
      <WarehouseProvider>
        <WarehouseManaguaPage />
      </WarehouseProvider>
    ),
  },
  {
    path: "bodegas",
    element: <Bodega />,
  },
];
