import type { RouteObject } from "react-router-dom";
import { WarehouseCorintoPage } from "@app/modules/warehouse/ui/pages/warehouse-corinto/index/warehouse-corinto.page";
import { AccessControlPage } from "@app/modules/warehouse/ui/pages/warehouse-corinto/access-control/access-control.page";
import { ScalePage } from "@app/modules/warehouse/ui/pages/warehouse-corinto/scale/scale";
import { Receiving } from "@app/modules/warehouse/ui/pages/warehouse-corinto/receiving/receiving";

export const WarehouseCorintoRoutes: RouteObject[] = [
   {
      index: true,
      element: <WarehouseCorintoPage />,
   },
   {
      path: "access",
      element: <AccessControlPage />,
   },
   {
      path: "scale",
      element: <ScalePage />,
   }
   ,
   {
      path: "receiving",
      element: <Receiving />,
   }
];
