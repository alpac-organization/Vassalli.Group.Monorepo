import { useState } from "react";
import { Modal } from "@alpac/design-system";
import dayjs from "dayjs";

import { warehouseHttpHandler } from "@app/core/adapters";
import { Loader } from "@app/shared/components/loaders/loader";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { InventoryReportsServices } from "@app/modules/Inventory/infrastructure/services/inventory-reports-services";
import type { PeriodInventoryReportType } from "@app/modules/Inventory/application/interfaces/services/IInventoryReportsServices";
import type { PeriodInventoryReport } from "@app/modules/Inventory/domain/api-contract/responses/period-inventory-report.response";

import { InventoryPeriodReportFilters } from "@app/modules/Inventory/ui/pages/reports/inventory-period/inventory-period-report-filters";
import type { InventoryPeriodReportFiltersValues } from "@app/modules/Inventory/ui/pages/reports/inventory-period/inventory-period-report-filters";
import { generateInventoryPeriodReportPdf } from "@app/modules/Inventory/ui/pages/reports/inventory-period/pdf/inventory-period-report.generate";

const inventoryReportsServices = new InventoryReportsServices(warehouseHttpHandler);

const toApiDate = (value: InventoryPeriodReportFiltersValues["from"]): string | undefined => {
   if (!value) return undefined;
   return dayjs(value.$d ?? value).format("YYYY-MM-DD");
};

const getInitialFilters = (branchId?: string): InventoryPeriodReportFiltersValues => ({
   from: null,
   to: null,
   branch_id: branchId,
   cost_center_id: undefined,
});

export const InventoryPeriodReportModal = function ({
   isOpen,
   onClose,
}: {
   isOpen: boolean;
   onClose: () => void;
}) {
   const { companyId, moduleCode, branchId } = useUserStore();
   const { urlImage } = useCompanyStore();
   const { AlertComponent, handleRequestError, handleRequestSuccess } = useAlertState();

   const [filters, setFilters] = useState<InventoryPeriodReportFiltersValues>(() => getInitialFilters(branchId));
   const [isGenerating, setIsGenerating] = useState(false);

   const handleGenerate = async (values: InventoryPeriodReportFiltersValues) => {
      setFilters(values);
      setIsGenerating(true);

      try {
         const payload: PeriodInventoryReportType = {
            company_id: companyId,
            module_code: moduleCode,
            from: toApiDate(values.from),
            to: toApiDate(values.to),
            branch_id: values.branch_id || undefined,
            cost_center_id: values.cost_center_id || undefined,
         };

         const report: PeriodInventoryReport = await inventoryReportsServices.GetPeriodInventoryReport(payload);
         const blob = await generateInventoryPeriodReportPdf({
            report,
            logoUrl: urlImage,
         });

         const url = URL.createObjectURL(blob);
         window.open(url, "_blank");

         handleRequestSuccess("Reporte generado correctamente.");
         onClose();
      } catch {
         handleRequestError("Error al generar el reporte de inventario por periodo.");
      } finally {
         setIsGenerating(false);
      }
   };

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         title="Inventario por periodo"
         description="Aplica los filtros y genera el reporte en PDF."
         size="3xl"
         variant="form"
      >
         {isGenerating && <Loader title="Generando reporte de inventario por periodo..." />}

         <InventoryPeriodReportFilters
            filters={filters}
            onApply={handleGenerate}
            onClear={() => setFilters(getInitialFilters(branchId))}
         />

         {AlertComponent}
      </Modal>
   );
};
