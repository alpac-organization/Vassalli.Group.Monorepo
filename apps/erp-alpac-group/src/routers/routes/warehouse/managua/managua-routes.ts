import { ArchiveRestoreIcon, TruckIcon } from "lucide-react";
import type { SidebarLink } from "@app/shared/layouts/dashboard-layout/components/Sidebar/types/sidebar.types";

export const getManaguaWarehouseRoutes = () => {

  const warehouseManaguaSection: SidebarLink = {
    id: "warehouse-mga",
    label: "Control de Acceso",
    path: "access-control",
    icon: TruckIcon,
  };

  const DucaPanel: SidebarLink = {
    id: "merchandise-registration",
    label: "Ingreso Mercancía",
    path: "mercaderia",
    icon: ArchiveRestoreIcon,
  };

  const MerchandiseManagement: SidebarLink = {
    id: "merchandise-management",
    label: "Gestión de Mercancía",
    path: "merchandise-management",
    icon: ArchiveRestoreIcon,
  };

  return {
    warehouseManaguaSection,
    DucaPanel,
    MerchandiseManagement,
  };
};
