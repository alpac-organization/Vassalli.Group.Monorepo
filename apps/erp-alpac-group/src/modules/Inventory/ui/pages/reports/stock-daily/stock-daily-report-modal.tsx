import { useState } from "react";
import { Modal } from "@alpac/design-system";
import { Loader } from "@app/shared/components/loaders/loader";

import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { useAlertState } from "@app/shared/hooks/useAlertState";

import { warehouseHttpHandler } from "@app/core/adapters";
import { InventoryReportsServices } from "@app/modules/Inventory/infrastructure/services/inventory-reports-services";

import { StockDailyReportFilters } from "@app/modules/Inventory/ui/pages/reports/stock-daily/stock-daily-report-filters";
import type { StockDailyReportFiltersValues } from "@app/modules/Inventory/ui/pages/reports/stock-daily/stock-daily-report-filters";

import { generateStockDailyReportPdf } from "@app/modules/Inventory/ui/pages/reports/stock-daily/pdf/stock-daily-report.generate";

export const StockDailyReportModal = function ({
   isOpen,
   onClose,
}: {
   isOpen: boolean;
   onClose: () => void;
}) {
   const { companyId, moduleCode, branchId } = useUserStore();
   const { urlImage } = useCompanyStore();
   const { AlertComponent, handleRequestError, handleRequestSuccess } = useAlertState();

   const [filters, setFilters] = useState<StockDailyReportFiltersValues>({
      branch_ids: branchId ? [branchId] : [],
      area_ids: [],
      cost_center_ids: [],
      category_ids: [],
      usage_types: [],
      product_code: "",
      product_name: "",
   });
   const [isGenerating, setIsGenerating] = useState(false);

   const handleGenerate = async (values: StockDailyReportFiltersValues) => {
      setFilters(values);
      setIsGenerating(true);

      try {
         const service = new InventoryReportsServices(warehouseHttpHandler);
         const report = await service.GetStockDailyReport({
            company_id: companyId,
            module_code: moduleCode,
            branch_ids: values.branch_ids,
            area_ids: values.area_ids,
            cost_center_ids: values.cost_center_ids,
            category_ids: values.category_ids,
            usage_types: values.usage_types,
            product_code: values.product_code,
            product_name: values.product_name,
         });

         const blob = await generateStockDailyReportPdf({
            report,
            logoUrl: urlImage,
         });

         const url = URL.createObjectURL(blob);
         window.open(url, "_blank");

         handleRequestSuccess("Reporte generado correctamente.");
         onClose();
      } catch {
         handleRequestError("Error al generar el reporte de stock diario.");
      } finally {
         setIsGenerating(false);
      }
   };

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         title="Stock diario"
         description="Aplica los filtros y genera el reporte en PDF."
         size="3xl"
         variant="form"
      >
         {isGenerating && <Loader title="Generando reporte de stock diario..." />}

         <StockDailyReportFilters
            filters={filters}
            onApply={handleGenerate}
            onClear={() => setFilters({
               branch_ids: branchId ? [branchId] : [],
               area_ids: [],
               cost_center_ids: [],
               category_ids: [],
               usage_types: [],
               product_code: "",
               product_name: "",
            })}
            applyLabel="Generar"
            forceEnableApply
         />

         {AlertComponent}
      </Modal>
   );
};