import type { SidebarLink } from "@app/shared/layouts/dashboard-layout/components/Sidebar/types/sidebar.types";
import { WarehouseIcon } from "lucide-react";

export const getWarehouseAdminRoutes = () => {

   const manageSection: SidebarLink = {
      id: "manage-section",
      label: "Gestion de Bodega",  
      path: "management",
      icon: WarehouseIcon,
   };

      return {
      manageSection
   }
}