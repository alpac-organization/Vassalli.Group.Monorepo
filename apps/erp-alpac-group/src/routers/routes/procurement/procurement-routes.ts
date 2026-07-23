import type { SidebarLink } from "@app/shared/layouts/dashboard-layout/components/Sidebar/types/sidebar.types";
import { FileCheck, PackageSearchIcon } from "lucide-react";

export const getProcurementRoutes = () => {
  
  const supplierSection: SidebarLink = {
    id: "supplier",
    label: "Proveedores",
    path: "suppliers",
    icon: PackageSearchIcon,
  };

  const quotesSection: SidebarLink = {
    id: "quotes",
    label: "Cotizaciones",
    path: "quotes",
    icon: FileCheck,
  };

  return {
    supplierSection,
    quotesSection,
  };
};
