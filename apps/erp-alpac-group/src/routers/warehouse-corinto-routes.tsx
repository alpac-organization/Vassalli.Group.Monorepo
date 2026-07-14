import { AccessControlPage } from "@app/modules/warehouse/ui/warehouse-corinto/pages/access-control/access-control.page";
import { WarehouseCorintoPage } from "@app/modules/warehouse/ui/warehouse-corinto/pages/index/warehouse-corinto.page";
import { WarehouseOperation } from "@app/modules/warehouse/ui/warehouse-corinto/pages/warehouse-operation/warehouse-operation";
import { ScalePage } from "@app/modules/warehouse/ui/warehouse-corinto/pages/scale/scale";
import { InboundOperation } from "@app/modules/warehouse/ui/warehouse-corinto/pages/inbound-operation/inbound-operation";

import type { RouteObject } from "react-router-dom";
import { Customer } from "@app/modules/warehouse/ui/warehouse-corinto/pages/customer/customer";

export const WarehouseCorintoRoutes: RouteObject[] = [
   {
      index: true,
      element: <WarehouseCorintoPage />,
   },
   {
      path: "customer",
      element: <Customer />,
   },
   {
      path: "inbound-operation",
      element: <InboundOperation />,
   },
   {
      path: "access",
      element: <AccessControlPage />,
   },
   {
      path: "scale",
      element: <ScalePage />,
   },
   {
      path: "warehouse",
      element: <WarehouseOperation />,
   }
];
