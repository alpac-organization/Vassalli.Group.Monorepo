import { InventoryControl } from "@app/modules/Inventory/ui/pages/inventory-control/inventory-control";
import { EntryOutput } from "@app/modules/Inventory/ui/pages/entry-output/entry-output";

import type { RouteObject } from "react-router-dom";

export const InventoryRouter: RouteObject[] = [
    {
        path: "inventory-control",
        element: <InventoryControl />,
    },
    {
        path: "entry-output",
        element: <EntryOutput />,
    }
];
