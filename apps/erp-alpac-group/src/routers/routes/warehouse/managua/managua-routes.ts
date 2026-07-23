import type { SidebarLink } from "@app/shared/layouts/dashboard-layout/components/Sidebar/types/sidebar.types";
import { ArchiveRestoreIcon, FilePenIcon, TruckIcon } from "lucide-react";

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
    path: "merchandise-registration",
    icon: ArchiveRestoreIcon,
  };

  const BodegaSection: SidebarLink = {
    id: "Bodegas",
    label: "Asignaciones de Bodegas",
    path: "bodegas",
    icon: FilePenIcon,
  };

  const warehouseSection12: SidebarLink = {
    id: "warehouse15",
    label: "Cuadrillas",
    path: "section12",
    icon: FilePenIcon,
  };

  return {
    warehouseManaguaSection,
    DucaPanel,
    BodegaSection,
    warehouseSection12,
  };
};
