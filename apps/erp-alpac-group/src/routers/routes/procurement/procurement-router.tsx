import { Supplier } from "@app/modules/procurement/ui/pages/supplier/supplier";
import type { RouteObject } from "react-router-dom";

export const ProcurementRouter: RouteObject[] = [
   {
      path: "suppliers",
      element: <Supplier />,
   },   
];
