import { Settings, ArrowUpDown } from "lucide-react";
import type { SidebarLink } from "@app/shared/layouts/dashboard-layout/components/Sidebar/types/sidebar.types";

export const getInventoryRoutes = () => {

    const inventoryControl: SidebarLink = {
        id:   "inventory",
        label: "Control de inventario",
        path:  "inventory",
        icon: Settings
    };

    const inventoryEntriesAndOutputs: SidebarLink = {
        id:    "entry-output",
        label: "Entradas y salidas",
        path:  "entry-output",
        icon:  ArrowUpDown
    };

    return {
        inventoryControl,
        inventoryEntriesAndOutputs
    }
}