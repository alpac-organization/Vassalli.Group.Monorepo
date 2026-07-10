import { AccessControlPage } from "@app/modules/warehouse/ui/warehouse-corinto/pages/access-control/access-control.page";
import { WarehouseCorintoPage } from "@app/modules/warehouse/ui/warehouse-corinto/pages/index/warehouse-corinto.page";
import { Receiving } from "@app/modules/warehouse/ui/warehouse-corinto/pages/receiving/receiving";
import { ScalePage } from "@app/modules/warehouse/ui/warehouse-corinto/pages/scale/scale";
import type { RouteObject } from "react-router-dom";


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
