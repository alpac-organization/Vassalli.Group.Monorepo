import { Settings } from "lucide-react";
import type { SidebarLink } from "@app/shared/layouts/dashboard-layout/components/Sidebar/types/sidebar.types";

export const getInventoryRoutes = () => {

    const inventorySections: SidebarLink = {
        id: "inventory",
        label: "Control de inventario",
        path: "inventory",
        icon: Settings
    };

    return {
        inventorySections
    }
}