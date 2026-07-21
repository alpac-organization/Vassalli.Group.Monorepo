import type { SidebarLink } from "@app/shared/layouts/dashboard-layout/components/Sidebar/types/sidebar.types";
import { FileCheckIcon, FilePenIcon, ShieldCheckIcon, TruckIcon, WarehouseIcon, WeightTildeIcon } from "lucide-react";

export const getCorintoWarehouseRoutes = () => {

   const administrativeSection: SidebarLink = {
      id: "administrative-section",
      label: "Sección Administrativa",
      path: "administrative-section",
      icon: FileCheckIcon
   }

   const warehouseCorintoSection: SidebarLink = {
      id: "control-panel",
      label: "Panel Logístico",
      path: "control-panel",
      icon: TruckIcon,
   };

   const accessControlSection: SidebarLink = {
      id: "access-control",
      label: "Control de acceso",
      path: "access",
      icon: ShieldCheckIcon,
   };

   const scaleSection: SidebarLink = {
      id: "scale",
      label: "Basculaje",
      path: "scale",
      icon: WeightTildeIcon,
   };

   const inboundSection: SidebarLink = {
      id: "warehouse-section",
      label: "Bodega",
      path: "warehouse",
      icon: WarehouseIcon
   }

   const warehouseReportSection: SidebarLink = {
      id: "warehouse3",
      label: "Reportes",
      path: "reports",
      icon: FilePenIcon
   };

   return {
      administrativeSection,
      warehouseCorintoSection,
      accessControlSection,
      scaleSection,
      inboundSection,
      warehouseReportSection
   }
}
