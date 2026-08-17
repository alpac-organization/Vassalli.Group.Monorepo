import type { SidebarLink } from "@app/shared/layouts/dashboard-layout/components/Sidebar/types/sidebar.types";
import { ArchiveRestoreIcon, Building2, TruckIcon, ClipboardListIcon, UsersIcon, WarehouseIcon } from "lucide-react";

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
  const warehouseSection4: SidebarLink = {
    id: "warehouse-allocation",
    label: "Asignación de Bodega",
    path: "warehouse-allocation",
    icon: ClipboardListIcon,
  };

  const warehouseSection12: SidebarLink = {
    id: "warehouse-crews",
    label: "Cuadrillas",
    path: "cuadrillas",
    icon: UsersIcon,
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

  return {
    warehouseManaguaSection,
    DucaPanel,
    warehouseSection4,
    warehouseListSection,
    BodegaSection,
    warehouseSection12,
  };
};
