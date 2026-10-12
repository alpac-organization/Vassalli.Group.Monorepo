import type { SidebarLink } from "@app/shared/layouts/dashboard-layout/components/Sidebar/types/sidebar.types";
import {
	ClipboardListIcon,
	PackageCheck,
	TicketIcon,
	TruckIcon,
	WarehouseIcon,
	WrenchIcon,
} from "lucide-react";

export const getManaguaWarehouseRoutes = () => {
	const warehouseManaguaSection: SidebarLink = {
		id: "warehouse-mga",
		label: "Control de Acceso",
		path: "access-control",
		icon: TruckIcon,
	};

	const ongoingOperationsSection: SidebarLink = {
		id: "Ongoing-operations",
		label: "Operaciones en curso",
		path: "ongoing-operations",
		icon: WrenchIcon,
	};

  const warehouseAssignmentSection: SidebarLink = {
    id: "assignment",
    label: "Asignación",
    path: "assignment",
    icon: ClipboardListIcon,
  };

  const warehouseDescargueSection: SidebarLink = {
    id: "descargue",
    label: "Descargue",
    path: "descargue",
    icon: PackageCheck,
  };

	const BodegaSection: SidebarLink = {
		id: "warehouse-3d",
		label: "Bodegas (3D)",
		path: "bodegas",
		icon: WarehouseIcon,
	};

	const ticketSection: SidebarLink = {
		id: "ticket-warehouse",
		label: "Ticket",
		path: "ticket",
		icon: TicketIcon,
	};

	return {
		warehouseManaguaSection,
		ongoingOperationsSection,
		warehouseAssignmentSection,
		warehouseDescargueSection,
		BodegaSection,
		ticketSection
	};
};
