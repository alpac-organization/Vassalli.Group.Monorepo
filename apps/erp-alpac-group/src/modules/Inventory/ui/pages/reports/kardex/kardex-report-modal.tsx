import { useState } from "react";
import { Modal } from "@alpac/design-system";
import dayjs from "dayjs";

import { warehouseHttpHandler } from "@app/core/adapters";
import { RoleEnum } from "@app/core/enums/role.enum";
import { Loader } from "@app/shared/components/loaders/loader";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { InventoryReportsServices } from "@app/modules/Inventory/infrastructure/services/inventory-reports-services";
import type { KardexReportType } from "@app/modules/Inventory/application/interfaces/services/IInventoryReportsServices";
import {
   KardexReportFilters,
   type KardexReportFiltersValues,
} from "./kardex-report-filters";

const inventoryReportsServices = new InventoryReportsServices(
   warehouseHttpHandler,
);

const EXCEL_MIME_TYPE =
   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

const formatFilterDate = (
   value: KardexReportFiltersValues["from"],
): string | undefined => {
   if (!value) return undefined;
   const raw = typeof value === "object" && "$d" in value ? value.$d : value;
   return dayjs(raw as dayjs.ConfigType).format("YYYY-MM-DD");
};

const getInitialFilters = (
   branchId?: string,
   isAdministrator?: boolean,
): KardexReportFiltersValues => ({
   from: null,
   to: null,
   branch_id: isAdministrator ? branchId : undefined,
   cost_center_id: undefined,
   category_id: undefined,
   product_stock_ids: [],
});

const extractBlobErrorMessage = async (error: unknown): Promise<string> => {
   const fallback = "Error al generar el reporte Kardex en Excel.";
   if (!error || typeof error !== "object") return fallback;

   const maybeResponse = (
      error as { response?: { data?: unknown } }
   ).response;
   const data = maybeResponse?.data;

   if (data instanceof Blob) {
      try {
         const text = await data.text();
         const parsed = JSON.parse(text) as {
            description?: string;
            message?: string;
         };
         return parsed.description || parsed.message || fallback;
      } catch {
         return fallback;
      }
   }

   return fallback;
};

export const KardexReportModal = function ({
   isOpen,
   onClose,
}: {
   isOpen: boolean;
   onClose: () => void;
}) {
   const { companyId, moduleCode, branchId, role } = useUserStore();
   const isAdministrator = role === RoleEnum.ADMINISTRATOR;
   const canFilterByCostCenter =
      isAdministrator || role === RoleEnum.MANAGER;
   const { AlertComponent, handleRequestError, handleRequestSuccess } =
      useAlertState();

   const [filters, setFilters] = useState<KardexReportFiltersValues>(() =>
      getInitialFilters(branchId, isAdministrator),
   );
   const [isGenerating, setIsGenerating] = useState(false);

   const handleGenerate = async (values: KardexReportFiltersValues) => {
      setFilters(values);
      setIsGenerating(true);

      try {
         const fromFormatted = formatFilterDate(values.from);
         const toFormatted = formatFilterDate(values.to);

         const payload: KardexReportType = {
            company_id: companyId,
            module_code: moduleCode,
            from: fromFormatted,
            to: toFormatted,
            branch_id: isAdministrator
               ? values.branch_id || undefined
               : undefined,
            cost_center_id: canFilterByCostCenter
               ? values.cost_center_id || undefined
               : undefined,
            product_stock_ids: values.product_stock_ids,
         };

         const blob =
            await inventoryReportsServices.GetKardexReportExcel(payload);
         const excelBlob = new Blob([blob], { type: EXCEL_MIME_TYPE });
         const url = URL.createObjectURL(excelBlob);

         const link = document.createElement("a");
         link.href = url;
         link.download = `Kardex-${(fromFormatted ?? "").replace(/-/g, "")}-${(toFormatted ?? "").replace(/-/g, "")}.xlsx`;
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
         setTimeout(() => URL.revokeObjectURL(url), 60_000);

         handleRequestSuccess(
            "Reporte Kardex en Excel descargado correctamente.",
         );
         onClose();
      } catch (error) {
         const message = await extractBlobErrorMessage(error);
         handleRequestError(message);
      } finally {
         setIsGenerating(false);
      }
   };

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         title="Reporte Kardex (Excel)"
         description="Selecciona el periodo y los productos de inventario para descargar el Kardex valorizado en formato Excel (.xlsx)."
         size="3xl"
         variant="form"
      >
         {isGenerating && (
            <Loader title="Generando archivo Excel de Kardex..." />
         )}

         <KardexReportFilters
            filters={filters}
            onApply={handleGenerate}
            onClear={() =>
               setFilters(getInitialFilters(branchId, isAdministrator))
            }
         />

         {AlertComponent}
      </Modal>
   );
};
