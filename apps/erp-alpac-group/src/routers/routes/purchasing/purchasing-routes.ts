import type { SidebarLink } from "@app/shared/layouts/dashboard-layout/components/Sidebar/types/sidebar.types";
import { NotebookIcon, PackageSearchIcon, ShoppingBasketIcon } from "lucide-react";

export const getPurchasingRoutes = () => {

   const supplierSection: SidebarLink = {
      id: "supplier",
      label: "Proveedores",
      path: "suppliers",
      icon: PackageSearchIcon
   };

   const purchaseOrderSection: SidebarLink = {
      id: "purchase-order",
      label: "Órdenes de Compra",
      path: "purchase-orders",
      icon: ShoppingBasketIcon
   };

   const requisitionSection: SidebarLink = {
      id: "requisition",
      label: "Solicitud de Compras",
      path: "requisitions",
      icon: NotebookIcon
   }

   const quotesSection: SidebarLink = {
      id: "quote",
      label: "Cotizaciones",
      path: "quotes",
      icon: NotebookIcon
   }

   return {
      supplierSection,
      requisitionSection,
      quotesSection,
      purchaseOrderSection
   }
}