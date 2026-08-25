import type { SidebarLink } from "@app/shared/layouts/dashboard-layout/components/Sidebar/types/sidebar.types";
import {  NotebookIcon } from "lucide-react";

export const getManagementRoutes = () => {

   const analyzedQuoteSection: SidebarLink = {
      id: "analyzed-quotes",
      label: "Cotizaciones Analizadas",
      path: "analyzed-quotes",
      icon: NotebookIcon
   };

   return {
      analyzedQuoteSection
   }
}