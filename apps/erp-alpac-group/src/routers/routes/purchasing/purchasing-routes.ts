import type { SidebarLink } from "@app/shared/layouts/dashboard-layout/components/Sidebar/types/sidebar.types";
import { BanknoteIcon, ChartLineIcon, NotebookIcon, PackageSearchIcon, ShoppingBasketIcon } from "lucide-react";

export const getPurchasingRoutes = () => {

   const supplierSection: SidebarLink = {
      id: "supplier",
      label: "Proveedores y Productos",
      path: "suppliers",
      icon: PackageSearchIcon
   };

   const purchaseOrderSection: SidebarLink = {
      id: "purchase-order",
      label: "Órdenes de Compra",
      path: "purchase-orders",
      icon: ShoppingBasketIcon
   };

   const purchasingApplicationSection: SidebarLink = {
      id: "purchasing-application",
      label: "Solicitud de Compra",
      path: "purchasing-applications",
      icon: NotebookIcon
   }

   const quotesSection: SidebarLink = {
      id: "quote",
      label: "Cotizaciones",
      path: "quotes",
      icon: BanknoteIcon
   }

   const quoteAnalisysSection: SidebarLink = {
      id: "analisys",
      label: "Análisis comparativo",
      path: "analisys",
      icon: ChartLineIcon
   }

   return {
      supplierSection,
      purchasingApplicationSection,
      quotesSection,
      quoteAnalisysSection,
      purchaseOrderSection
   }
}