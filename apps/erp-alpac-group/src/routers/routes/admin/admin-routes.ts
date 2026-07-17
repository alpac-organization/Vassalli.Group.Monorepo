import type { SidebarLink } from "@app/shared/layouts/dashboard-layout/components/Sidebar/types/sidebar.types";
import { BadgeCent, Briefcase, Grid, Users } from "lucide-react";

export const getAdminRoutes = () => {

   const administrationUsersSection: SidebarLink = {
      id: "administration",
      label: "Usuarios",
      path: "administration/users",
      icon: Users,
   };

   const administrationCostCentersSection: SidebarLink = {
      id: "cost-centers",
      label: "Centros de Costos",
      path: "administration/cost-centers",
      icon: BadgeCent,
   };

   const administrationAreasSection: SidebarLink = {
      id: "areas",
      label: "Áreas",
      path: "administration/areas",
      icon: Grid,
   };

   const administrationJobPositionsSection: SidebarLink = {
      id: "job-positions",
      label: "Puestos de Trabajo",
      path: "administration/job-positions",
      icon: Briefcase,
   };

   return {
      administrationUsersSection,
      administrationCostCentersSection,
      administrationAreasSection,
      administrationJobPositionsSection,
   }
}