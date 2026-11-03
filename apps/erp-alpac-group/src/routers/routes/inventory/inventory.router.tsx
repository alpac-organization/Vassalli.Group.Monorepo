import { InventoryControl } from "@app/modules/Inventory/ui/pages/inventory-control/inventory-control";
import { SupplyRequests } from "@app/modules/Inventory/ui/pages/supply-requests/supply-requests";

import type { RouteObject } from "react-router-dom";

export const InventoryRouter: RouteObject[] = [
    {
        path: "inventory-control",
        element: <InventoryControl />,
    },
    {
        path: "supply-requests",
        element: <SupplyRequests />,
    },
];
