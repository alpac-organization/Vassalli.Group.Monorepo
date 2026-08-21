import { AnalyzedQuotes } from "@app/modules/management/ui/pages/analyzed-quotes/analyzed-quotes";
import type { RouteObject } from "react-router-dom";

export const ManagementRouter: RouteObject[] = [
   {
      path: "analyzed-quotes",
      element: <AnalyzedQuotes />,
   },
];
