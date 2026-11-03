import { Settings, ArrowUpDown } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox } from "@fortawesome/free-solid-svg-icons";
import type { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import type { SidebarLink } from "@app/shared/layouts/dashboard-layout/components/Sidebar/types/sidebar.types";

const SolicitudesSidebarIcon = ({ className, style }: Pick<FontAwesomeIconProps, "className" | "style">) => (
  <FontAwesomeIcon
    icon={faInbox}
    className={className}
    style={{ color: "rgb(255, 255, 255)", ...style }}
  />
);

export const getInventoryRoutes = () => {

    const inventoryControl: SidebarLink = {
        id:   "inventory",
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

    const supplyRequestsSection: SidebarLink = {
        id:    "supply-requests",
        label: "Solicitudes",
        path:  "supply-requests",
        icon:  SolicitudesSidebarIcon
    };

    return {
        inventoryControl,
        inventoryEntriesAndOutputs,
        supplyRequestsSection
    }
}