import { useState } from "react";
import { Modal } from "@alpac/design-system";
import { Loader } from "@app/shared/components/loaders/loader";
import dayjs from "dayjs";

import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { useAlertState } from "@app/shared/hooks/useAlertState";

import { warehouseHttpHandler } from "@app/core/adapters";
import { InventoryReportsServices } from "@app/modules/Inventory/infrastructure/services/inventory-reports-services";

import { OutputsByEquipmentReportFilters } from "./outputs-by-equipment-report-filters";
import type { OutputsByEquipmentReportFiltersValues } from "./outputs-by-equipment-report-filters";

import { generateOutputsByEquipmentReportPdf } from "./pdf/outputs-by-equipment-report.generate";

const toApiDate = (value: OutputsByEquipmentReportFiltersValues["from"]): string | undefined => {
   if (!value) return undefined;
   return dayjs(value.$d ?? value).format("YYYY-MM-DD");
};

export const OutputsByEquipmentReportModal = function ({
   isOpen,
   onClose,
}: {
   isOpen: boolean;
   onClose: () => void;
}) {
   const { companyId, moduleCode, branchId } = useUserStore();
   const { urlImage } = useCompanyStore();
   const { AlertComponent, handleRequestError, handleRequestSuccess } = useAlertState();

   const [filters, setFilters] = useState<OutputsByEquipmentReportFiltersValues>({
      from: null,
      to: null,
      branch_id: branchId,
      category_ids: [],
      equipment_ids: [],
      product_ids: [],
   });
   const [isGenerating, setIsGenerating] = useState(false);

   const handleGenerate = async (values: OutputsByEquipmentReportFiltersValues) => {
      setFilters(values);
      setIsGenerating(true);

      try {
         const service = new InventoryReportsServices(warehouseHttpHandler);
         const report = await service.GetOutputsLineEquipmentReport({
            company_id: companyId,
            module_code: moduleCode,
            from: toApiDate(values.from),
            to: toApiDate(values.to),
            branch_id: values.branch_id || undefined,
            category_ids: values.category_ids,
            equipment_ids: values.equipment_ids,
            product_ids: values.product_ids,
         });

         const blob = await generateOutputsByEquipmentReportPdf({
            report,
            logoUrl: urlImage,
         });

         const url = URL.createObjectURL(blob);
         window.open(url, "_blank");

         handleRequestSuccess("Reporte generado correctamente.");
         onClose();
      } catch {
         handleRequestError("Error al generar el reporte de salidas por equipo.");
      } finally {
         setIsGenerating(false);
      }
   };

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         title="Salidas por equipo (Linea-Equipo)"
         description="Aplica los filtros y genera el reporte en PDF."
         size="3xl"
         variant="form"
      >
         {isGenerating && <Loader title="Generando reporte de salidas por equipo..." />}

         <OutputsByEquipmentReportFilters
            filters={filters}
            onApply={handleGenerate}
            onClear={() =>
               setFilters({
                  from: null,
                  to: null,
                  branch_id: branchId,
                  category_ids: [],
                  equipment_ids: [],
                  product_ids: [],
               })
            }
            applyLabel="Generar"
            forceEnableApply
         />

         {AlertComponent}
      </Modal>
   );
};