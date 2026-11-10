import type { SidebarLink } from "@app/shared/layouts/dashboard-layout/components/Sidebar/types/sidebar.types";
import {
	ClipboardListIcon,
	FileStackIcon,
	FuelIcon,
	InboxIcon,
	PackageCheck,
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
		label: "Documentación",
		path: "ongoing-operations",
		icon: FileStackIcon,
	};

	const warehouseAssignmentSection: SidebarLink = {
		id: "assignment",
		label: "Asignamiento",
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

	const supplyRequestsSection: SidebarLink = {
		id: "supply-requests",
		label: "Solicitudes a Inventario",
		path: "supply-requests",
		icon: InboxIcon,
	};

	const reabastecimientoSection: SidebarLink = {
		id: "reabastecimiento",
		label: "Reabastecimiento",
		path: "reabastecimiento",
		icon: FuelIcon,
	};
	
	return {
		warehouseManaguaSection,
		ongoingOperationsSection,
		warehouseAssignmentSection,
		warehouseDescargueSection,
		BodegaSection,
		ticketSection,
		supplyRequestsSection,
		reabastecimientoSection
	};
};
