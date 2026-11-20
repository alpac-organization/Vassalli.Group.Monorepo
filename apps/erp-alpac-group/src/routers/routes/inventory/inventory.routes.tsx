import { Settings, ArrowUpDown, FileChartColumn } from "lucide-react";
import type { SidebarLink } from "@app/shared/layouts/dashboard-layout/components/Sidebar/types/sidebar.types";

export const getInventoryRoutes = () => {

    const inventoryControl: SidebarLink = {
        id:   "inventory-control",
        label: "Control de inventario",
        path:  "inventory-control",
        icon: Settings
    };

    const inventoryEntriesAndOutputs: SidebarLink = {
        id:    "entry-output",
        label: "Entradas y salidas",
        path:  "entry-output",
        icon:  ArrowUpDown
    };

    const reportsSection: SidebarLink = {
        id:   "inventory-reports",
        label: "Gestión de Reportes",
        path:  "reports-management",
        icon:  FileChartColumn
    };

    return {
        inventoryControl,
        inventoryEntriesAndOutputs,
        reportsSection
    }
}