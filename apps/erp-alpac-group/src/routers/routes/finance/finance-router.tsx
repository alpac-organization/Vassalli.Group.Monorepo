import { QuoteAnalisys } from "@app/modules/finance/ui/pages/quote-analisys/quote-analisys";
import { QuoteAnalysisDetail } from "@app/modules/finance/ui/pages/quote-analisys/quote-analysis-detail";
import type { RouteObject } from "react-router-dom";

export const FinanceRouter: RouteObject[] = [
   {
      path: "analisys",
      element: <QuoteAnalisys />,
   },
   {
      path: "analisys/:reviewId",
      element: <QuoteAnalysisDetail />,
   },
];
