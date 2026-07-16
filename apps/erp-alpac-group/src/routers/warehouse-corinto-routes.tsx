import { AccessControlPage } from "@app/modules/warehouse/ui/warehouse-corinto/pages/access-control/access-control.page";
import { WarehouseControlPanel } from "@app/modules/warehouse/ui/warehouse-corinto/pages/panel-control/panel-control";
import { WarehouseOperation } from "@app/modules/warehouse/ui/warehouse-corinto/pages/warehouse-operation/warehouse-operation";
import { ScalePage } from "@app/modules/warehouse/ui/warehouse-corinto/pages/scale/scale";
import { AdministrativeSection } from "@app/modules/warehouse/ui/warehouse-corinto/pages/administrative-section/administrative-section";

import type { RouteObject } from "react-router-dom";

export const WarehouseCorintoRoutes: RouteObject[] = [
   {
      path: "administrative-section",
      element: <AdministrativeSection />,
   },
   {
      path: "control-panel",
      element: <WarehouseControlPanel />,
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
