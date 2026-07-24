import { Quotes } from "@app/modules/purchasing/ui/pages/quotes/quotes";
import { PurchaseOrder } from "@app/modules/purchasing/ui/pages/purchase-order/purchase-order";
import { Requisition } from "@app/modules/purchasing/ui/pages/requsition/requisition";
import { Supplier } from "@app/modules/purchasing/ui/pages/supplier/supplier";
import type { RouteObject } from "react-router-dom";

export const PurchasingRouter: RouteObject[] = [
   {
      path: "suppliers",
      element: <Supplier />,
   },
   {
      path: "requisitions",
      element: <Requisition />,
   },
   {
      path: "quotes",
      element: <Quotes />,
   },
   {
      path: "purchase-orders",
      element: <PurchaseOrder />,
   },
];
