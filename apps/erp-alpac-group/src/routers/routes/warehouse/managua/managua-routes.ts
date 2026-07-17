import type { SidebarLink } from "@app/shared/layouts/dashboard-layout/components/Sidebar/types/sidebar.types";
import { ArchiveRestoreIcon, FilePenIcon, TruckIcon } from "lucide-react";

export const getManaguaWarehouseRoutes = () => {

   const warehouseManaguaSection: SidebarLink = {
      id: "warehouse-mga",
      label: "Control de Acceso",
      path: "warehouse-mga/access-control",
      icon: TruckIcon,
   };

   const DucaPanel: SidebarLink = {
      id: "merchandise-registration",
      label: "Ingreso Mercancía",
      path: "warehouse-mga/merchandise-registration",
      icon: ArchiveRestoreIcon,
   };

   const warehouseSection4: SidebarLink = {
      id: "warehouse7",
      label: "Asignaciones de Bodegas",
      path: "warehouse/section4",
      icon: FilePenIcon,
   };

   const warehouseSection12: SidebarLink = {
      id: "warehouse15",
      label: "Cuadrillas",
      path: "warehouse/section12",
      icon: FilePenIcon,
   };

   return {
      warehouseManaguaSection,
      DucaPanel,
      warehouseSection4,
      warehouseSection12
   }
}

