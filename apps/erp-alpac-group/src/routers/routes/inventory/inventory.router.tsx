import { AnalyzedQuotes } from "@app/modules/management/ui/pages/analyzed-quotes/analyzed-quotes";
import type { RouteObject } from "react-router-dom";

export const InventoryRouter: RouteObject[] = [
    {
        path: "",
        element: <AnalyzedQuotes />,
    },
];
