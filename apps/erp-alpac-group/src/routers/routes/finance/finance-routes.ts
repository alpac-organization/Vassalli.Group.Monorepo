import type { SidebarLink } from "@app/shared/layouts/dashboard-layout/components/Sidebar/types/sidebar.types";
import { ChartLineIcon } from "lucide-react";

export const getFinanceRoutes = () => {

   const quoteAnalisysSection: SidebarLink = {
      id: "analisys",
      label: "Análisis comparativo",
      path: "analisys",
      icon: ChartLineIcon
   }

   return {
      quoteAnalisysSection
   }
}