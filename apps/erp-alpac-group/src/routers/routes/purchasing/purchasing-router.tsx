import { PurchaseOrder } from "@app/modules/purchasing/ui/pages/purchase-order/purchase-order";
import { PurchaseRequest } from "@app/modules/purchasing/ui/pages/purchase-requests/purchase-request";
import { QuoteAnalisys } from "@app/modules/purchasing/ui/pages/quote-analisys/quote-analisys";
import { SupplierProduct } from "@app/modules/purchasing/ui/pages/supplier-product/supplier-product";

import type { RouteObject } from "react-router-dom";
import { QuotePage } from "@app/modules/purchasing/ui/pages/quotes/quote-page";

export const PurchasingRouter: RouteObject[] = [
   {
      path: "suppliers",
      element: <SupplierProduct />,
      
   },
   {
      path: "purchase-requests",
      element: <PurchaseRequest />,
   },
   {
      path: "quotes",
      element: <QuotePage />,
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
