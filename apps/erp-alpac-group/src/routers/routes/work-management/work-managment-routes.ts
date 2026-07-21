import type { SidebarLink } from "@app/shared/layouts/dashboard-layout/components/Sidebar/types/sidebar.types";
import { User, UserKey } from "lucide-react";

export const getWorkManagementRoutes = () => {
   
   const collaboratorProfileSection: SidebarLink = {
      id: "collaborator-profile",
      label: "Perfil",
      path: "collaborator-profile",
      icon: User,
   };

   const permissionManagementSection: SidebarLink = {
      id: "gestion-permisos",
      label: "Permisos",
      path: "gestion-permisos",
      icon: UserKey,
   };

   return {
      collaboratorProfileSection,
      permissionManagementSection
   }
}
