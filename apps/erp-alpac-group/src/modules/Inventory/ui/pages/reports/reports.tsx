import { useState } from "react";
import { Breadcrumb, SectionHeader, useTheme, Card, Badges, Button } from "@alpac/design-system";
import { StockDailyReportModal } from "@app/modules/Inventory/ui/pages/reports/stock-daily/stock-daily-report-modal";
import { OutputsByEquipmentReportModal } from "@app/modules/Inventory/ui/pages/reports/outputs-by-equipment/outputs-by-equipment-report-modal";
import { OutputsDetailByEquipmentReportModal } from "@app/modules/Inventory/ui/pages/reports/outputs-detail-by-equipment/outputs-detail-by-equipment-report-modal";
import { OutputsConsolidatedByEquipmentReportModal } from "@app/modules/Inventory/ui/pages/reports/outputs-consolidated-by-equipment/outputs-consolidated-by-equipment-report-modal";
import { InventoryPeriodReportModal } from "@app/modules/Inventory/ui/pages/reports/inventory-period/inventory-period-report-modal";
import { InventoryMovementReportModal } from "@app/modules/Inventory/ui/pages/reports/inventory-movements/inventory-movement-report-modal";
import { InventoryTurnoverReportModal } from "@app/modules/Inventory/ui/pages/reports/inventory-turnover/inventory-turnover-report-modal";
import { useNavigate } from "react-router-dom";

import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";

type ReportCardItem = {
   slug: string;
   title: string;
   description: string;
   badge: string;
   badgeColor: string;
   onOpen?: () => void;
};

const existenceReports: ReportCardItem[] = [
   {
      slug: "stock-daily",
      title: "Stock diario",
      description: "Existencias actuales por sucursal, área y centro de costo.",
      badge: "Disponible",
      badgeColor: "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
   },
   {
      slug: "inventory-period",
      title: "Inventario por periodo",
      description: "Saldo inicial, entradas, salidas y saldo final por producto.",
      badge: "Nuevo",
      badgeColor: "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
   },
   {
      slug: "stock-valuation",
      title: "Valorización de inventario",
      description: "Valor total del inventario por categoría y centro de costo.",
      badge: "Nuevo",
      badgeColor: "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
   },
];

const movementReports: ReportCardItem[] = [
   {
      slug: "kardex",
      title: "Kardex de movimientos",
      description: "Historial de entradas y salidas por producto.",
      badge: "Disponible",
      badgeColor: "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
   },
   {
      slug: "movement-summary",
      title: "Resumen de movimientos",
      description: "Totales de entradas y salidas por período.",
      badge: "Nuevo",
      badgeColor: "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
   },
   {
      slug: "inventory-movements",
      title: "Movimientos de inventario",
      description: "Compras y salidas detalladas del período con costos mínimos y máximos.",
      badge: "Nuevo",
      badgeColor: "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
   },
   {
      slug: "inventory-turnover",
      title: "Rotación de inventario",
      description: "Consolidado de compras, despachos, costos históricos e índices de rotación.",
      badge: "Nuevo",
      badgeColor: "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
   },
];

const outputsByEquipmentReports: ReportCardItem[] = [
   {
      slug: "outputs-by-equipment",
      title: "Linea-Equipo",
      description: "Salidas de inventario por linea-equipo.",
      badge: "Disponible",
      badgeColor: "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
   },
   {
      slug: "outputs-detail-by-equipment",
      title: "Salidas a detalle por equipo",
      description: "Detalle de salidas de inventario por equipo.",
      badge: "Nuevo",
      badgeColor: "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
   },
   {
      slug: "outputs-consolidated-by-equipment",
      title: "Salidas consolidadas por equipo",
      description: "Salidas de inventario consolidadas por equipo y categoría.",
      badge: "Nuevo",
      badgeColor: "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
   },
];

export const Reports = function () {
   const navigate = useNavigate();
   const { baseUrl } = useBaseUrl();
   const { moduleBasePath } = useUserStore();
   const { urlImage, neutralUrlImage } = useCompanyStore();
   const { theme } = useTheme();
   const { AlertComponent } = useAlertState();

   const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;

   const [isStockDailyModalOpen, setIsStockDailyModalOpen] = useState(false);
   const [isOutputsByEquipmentModalOpen, setIsOutputsByEquipmentModalOpen] = useState(false);
   const [isOutputsDetailByEquipmentModalOpen, setIsOutputsDetailByEquipmentModalOpen] = useState(false);
   const [isOutputsConsolidatedByEquipmentModalOpen, setIsOutputsConsolidatedByEquipmentModalOpen] = useState(false);
   const [isInventoryPeriodModalOpen, setIsInventoryPeriodModalOpen] = useState(false);
   const [isInventoryMovementModalOpen, setIsInventoryMovementModalOpen] = useState(false);
   const [isInventoryTurnoverModalOpen, setIsInventoryTurnoverModalOpen] = useState(false);

   const openReportBySlug: Record<string, () => void> = {
      "stock-daily": () => setIsStockDailyModalOpen(true),
      "inventory-period": () => setIsInventoryPeriodModalOpen(true),
      "inventory-movements": () => setIsInventoryMovementModalOpen(true),
      "inventory-turnover": () => setIsInventoryTurnoverModalOpen(true),
      "outputs-by-equipment": () => setIsOutputsByEquipmentModalOpen(true),
      "outputs-detail-by-equipment": () => setIsOutputsDetailByEquipmentModalOpen(true),
      "outputs-consolidated-by-equipment": () => setIsOutputsConsolidatedByEquipmentModalOpen(true),
   };

   const renderReportCards = (items: ReportCardItem[]) => (
   <div
      className={`grid grid-cols-1 gap-4 ${
         items.length === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"
      }`}
   >
      {items.map((item) => (
         <Card
            key={item.slug}
            className="flex flex-col px-[18px] py-7 !border-0 hover:!border-0"
         >
            <h3 className="text-[14.5px] font-semibold text-white">
               {item.title}
               <p className="text-[13px] text-neutral-400 leading-snug mt-1">
                  {item.description}
               </p>
            </h3>
           
            <div className="flex items-center justify-between mt-1">
               <Badges color="info" className={item.badgeColor} label={item.badge} />
               <Button
                  size="small"
                  label="Abrir"
                  onClick={() => {
                     const openReport = openReportBySlug[item.slug];
                     if (openReport) {
                        openReport();
                        return;
                     }
                     navigate(`${baseUrl}/${moduleBasePath}/reports-management/${item.slug}`);
                  }}
               />
            </div>
         </Card>
      ))}
   </div>
);

   return (
      <div className="flex flex-col gap-4">
         <div className="flex justify-start min-w-0 overflow-x-auto">
            <Breadcrumb
               items={[
                  {
                     label: "Dashboard",
                     url: `${baseUrl}/`,
                     onClick: (url) => navigate(url),
                  },
                  {
                     label: "Gestión de Reportes",
                     url: `${baseUrl}/${moduleBasePath}/reports-management`,
                     onClick: (url) => {
                        navigate(url);
                     },
                  },
               ]}
            />
         </div>

         <div className="flex flex-row justify-between items-start sm:items-center gap-3 min-w-0">
            <div className="flex flex-col justify-center gap-1 sm:gap-2 min-w-0 flex-1">
               <SectionHeader
                  title="Gestión de Reportes"
                  subtitle="Elige un reporte, aplica filtros y genera o edita antes de imprimir."
               />
            </div>

            {activeLogo && (
               <img
                  className="h-10 sm:h-16 md:h-20 w-auto max-w-[35%] sm:max-w-none object-contain shrink-0 self-start sm:self-center"
                  src={activeLogo}
                  alt="vassalli group"
               />
            )}
         </div>

         <div className="flex flex-col gap-6">
            <section className="flex flex-col gap-3">
               <h2 className="text-xl font-semibold text-neutral-100">Existencias</h2>
               {renderReportCards(existenceReports)}
            </section>

            <section className="flex flex-col gap-3">
               <h2 className="text-xl font-semibold text-neutral-100">Movimientos</h2>
               {renderReportCards(movementReports)}
            </section>

            <section className="flex flex-col gap-3">
               <h2 className="text-xl font-semibold text-neutral-100">Salidas por Equipo</h2>
               {renderReportCards(outputsByEquipmentReports)}
            </section>
         </div>

         <OutputsByEquipmentReportModal
            isOpen={isOutputsByEquipmentModalOpen}
            onClose={() => setIsOutputsByEquipmentModalOpen(false)}
         />

         <OutputsDetailByEquipmentReportModal
            isOpen={isOutputsDetailByEquipmentModalOpen}
            onClose={() => setIsOutputsDetailByEquipmentModalOpen(false)}
         />

         <OutputsConsolidatedByEquipmentReportModal
            isOpen={isOutputsConsolidatedByEquipmentModalOpen}
            onClose={() => setIsOutputsConsolidatedByEquipmentModalOpen(false)}
         />

         <StockDailyReportModal
            isOpen={isStockDailyModalOpen}
            onClose={() => setIsStockDailyModalOpen(false)}
         />

         <InventoryPeriodReportModal
            isOpen={isInventoryPeriodModalOpen}
            onClose={() => setIsInventoryPeriodModalOpen(false)}
         />

         <InventoryMovementReportModal
            isOpen={isInventoryMovementModalOpen}
            onClose={() => setIsInventoryMovementModalOpen(false)}
         />

         <InventoryTurnoverReportModal
            isOpen={isInventoryTurnoverModalOpen}
            onClose={() => setIsInventoryTurnoverModalOpen(false)}
         />

         {AlertComponent}
      </div>
   );
};