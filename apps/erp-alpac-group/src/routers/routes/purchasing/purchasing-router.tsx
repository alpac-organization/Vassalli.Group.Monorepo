import { Quotes } from "@app/modules/purchasing/ui/pages/quotes/quotes";
import { PurchaseOrder } from "@app/modules/purchasing/ui/pages/purchase-order/purchase-order";
import { Requisition } from "@app/modules/purchasing/ui/pages/requsition/requisition";
import { QuoteAnalisys } from "@app/modules/purchasing/ui/pages/quote-analisys/quote-analisys";
import { SupplierProduct } from "@app/modules/purchasing/ui/pages/supplier-product/supplier-product";

import type { RouteObject } from "react-router-dom";

export const PurchasingRouter: RouteObject[] = [
   {
      path: "suppliers",
      element: <SupplierProduct />,
   },
   {
      path: "purchasing-applications",
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
   {
      path: "analisys",
      element: <QuoteAnalisys />,
   },
];
