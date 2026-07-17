import type { SidebarLink } from "@app/shared/layouts/dashboard-layout/components/Sidebar/types/sidebar.types";
import { PackageSearchIcon } from "lucide-react";

export const getProcurementRoutes = () => {

   const supplierSection: SidebarLink = {
      id: "supplier",
      label: "Proveedores",
      path: "dashboard/procurement/suppliers",
      icon: PackageSearchIcon
   };

   return {
      supplierSection
   }
}