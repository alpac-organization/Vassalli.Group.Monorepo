import { useState } from "react";
import { Modal } from "@alpac/design-system";
import { Loader } from "@app/shared/components/loaders/loader";
import dayjs from "dayjs";

import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { useAlertState } from "@app/shared/hooks/useAlertState";

import type { EquipmentReportType } from "@app/modules/Inventory/application/interfaces/services/IInventoryReportsServices";

import { EquipmentReportFilters } from "@app/modules/Inventory/ui/pages/reports/shared/equipment/equipment-report-filters";
import type { EquipmentReportFiltersValues } from "@app/modules/Inventory/ui/pages/reports/shared/equipment/equipment-report.types";
import { openEquipmentReportPdf } from "@app/modules/Inventory/ui/pages/reports/shared/equipment/open-equipment-report-pdf";

const toApiDate = (value: EquipmentReportFiltersValues["from"]): string | undefined => {
   if (!value) return undefined;
   return dayjs(value.$d ?? value).format("YYYY-MM-DD");
};

export type EquipmentReportModalProps<TReport> = {
   isOpen: boolean;
   onClose: () => void;
   title: string;
   description: string;
   loadingTitle: string;
   errorMessage: string;
   requireCategory?: boolean;
   fetchReport: (payload: EquipmentReportType) => Promise<TReport>;
   generatePdf: (params: { report: TReport; logoUrl?: string | null }) => Promise<Blob>;
};

export function EquipmentReportModal<TReport>({
   isOpen,
   onClose,
   title,
   description,
   loadingTitle,
   errorMessage,
   requireCategory,
   fetchReport,
   generatePdf,
}: EquipmentReportModalProps<TReport>) {
   const { companyId, moduleCode, branchId } = useUserStore();
   const { urlImage } = useCompanyStore();
   const { AlertComponent, handleRequestError, handleRequestSuccess } = useAlertState();

   const [filters, setFilters] = useState<EquipmentReportFiltersValues>({
      from: null,
      to: null,
      branch_id: branchId,
      category_ids: [],
      equipment_ids: [],
      product_ids: [],
   });
   const [isGenerating, setIsGenerating] = useState(false);

   const handleGenerate = async (values: EquipmentReportFiltersValues) => {
      setFilters(values);
      setIsGenerating(true);

      try {
         const report = await fetchReport({
            company_id: companyId,
            module_code: moduleCode,
            from: toApiDate(values.from),
            to: toApiDate(values.to),
            branch_id: values.branch_id || undefined,
            category_ids: values.category_ids,
            equipment_ids: values.equipment_ids,
            product_ids: values.product_ids,
         });

         const blob = await generatePdf({
            report,
            logoUrl: urlImage,
         });

         openEquipmentReportPdf(blob);

         handleRequestSuccess("Reporte generado correctamente.");
         onClose();
      } catch {
         handleRequestError(errorMessage);
      } finally {
         setIsGenerating(false);
      }
   };

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         title={title}
         description={description}
         size="3xl"
         variant="form"
      >
         {isGenerating && <Loader title={loadingTitle} />}

         <EquipmentReportFilters
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
            requireCategory={requireCategory}
         />

         {AlertComponent}
      </Modal>
   );
}
