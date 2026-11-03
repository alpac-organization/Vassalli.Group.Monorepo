import { InventoryControl } from "@app/modules/Inventory/ui/pages/inventory-control/inventory-control";

import type { RouteObject } from "react-router-dom";

export const InventoryRouter: RouteObject[] = [
    {
        path: "inventory-control",
        element: <InventoryControl />,
    },
];
