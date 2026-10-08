import type { SidebarLink } from "@app/shared/layouts/dashboard-layout/components/Sidebar/types/sidebar.types";
import {
	ArchiveRestoreIcon,
	Building2,
	ClipboardListIcon,
	TicketIcon,
	TruckIcon,
	WarehouseIcon,
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
		id: "warehouse-assignment",
		label: "Asignación",
		path: "warehouse-assignment",
		icon: ClipboardListIcon,
	};


	const warehouseListSection: SidebarLink = {
		id: "warehouse-list",
		label: "Lista de bodegas",
		path: "warehouse",
		icon: Building2,
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
		warehouseListSection,
		BodegaSection,
		ticketSection
	};
};
