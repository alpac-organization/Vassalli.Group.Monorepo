import { useState } from "react";
import { Modal } from "@alpac/design-system";
import dayjs from "dayjs";

import { warehouseHttpHandler } from "@app/core/adapters";
import { RoleEnum } from "@app/core/enums/role.enum";
import { Loader } from "@app/shared/components/loaders/loader";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { InventoryReportsServices } from "@app/modules/Inventory/infrastructure/services/inventory-reports-services";
import type { InventoryMovementReportType } from "@app/modules/Inventory/application/interfaces/services/IInventoryReportsServices";
import {
   MovementTurnoverReportFilters,
   type MovementTurnoverReportFiltersValues,
} from "@app/modules/Inventory/ui/pages/reports/shared/movement-turnover/movement-turnover-report-filters";

const inventoryReportsServices = new InventoryReportsServices(warehouseHttpHandler);

const formatFilterDate = (
   value: MovementTurnoverReportFiltersValues["from"],
): string | undefined => {
   if (!value) return undefined;
   const raw = typeof value === "object" && "$d" in value ? value.$d : value;
   return dayjs(raw as dayjs.ConfigType).format("YYYY-MM-DD");
};

const getInitialFilters = (
   branchId?: string,
   isAdministrator?: boolean,
): MovementTurnoverReportFiltersValues => ({
   from: null,
   to: null,
   branch_id: isAdministrator ? branchId : undefined,
   cost_center_id: undefined,
   product_code: "",
});

export const InventoryMovementReportModal = function ({
   isOpen,
   onClose,
}: {
   isOpen: boolean;
   onClose: () => void;
}) {
   const { companyId, moduleCode, branchId, role } = useUserStore();
   const isAdministrator = role === RoleEnum.ADMINISTRATOR;
   const canFilterByCostCenter = isAdministrator || role === RoleEnum.MANAGER;
   const { AlertComponent, handleRequestError, handleRequestSuccess } = useAlertState();

   const [filters, setFilters] = useState<MovementTurnoverReportFiltersValues>(() =>
      getInitialFilters(branchId, isAdministrator),
   );
   const [isGenerating, setIsGenerating] = useState(false);

   const handleGenerate = async (values: MovementTurnoverReportFiltersValues) => {
      setFilters(values);
      setIsGenerating(true);

      try {
         const payload: InventoryMovementReportType = {
            company_id: companyId,
            module_code: moduleCode,
            from: formatFilterDate(values.from),
            to: formatFilterDate(values.to),
            branch_id: isAdministrator ? values.branch_id || undefined : undefined,
            cost_center_id: canFilterByCostCenter
               ? values.cost_center_id || undefined
               : undefined,
            product_code: values.product_code || undefined,
         };

         const blob = await inventoryReportsServices.GetInventoryMovementReportPdf(payload);
         const pdfBlob = new Blob([blob], { type: "application/pdf" });
         const url = URL.createObjectURL(pdfBlob);
         window.open(url, "_blank");
         setTimeout(() => URL.revokeObjectURL(url), 60_000);

         handleRequestSuccess("Reporte de movimientos de inventario generado correctamente.");
         onClose();
      } catch {
         handleRequestError("Error al generar el reporte de movimientos de inventario.");
      } finally {
         setIsGenerating(false);
      }
   };

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         title="Movimientos de inventario"
         description="Aplica los filtros y genera el reporte PDF de compras y salidas."
         size="3xl"
         variant="form"
      >
         {isGenerating && (
            <Loader title="Generando reporte de movimientos de inventario..." />
         )}

         <MovementTurnoverReportFilters
            filters={filters}
            onApply={handleGenerate}
            onClear={() => setFilters(getInitialFilters(branchId, isAdministrator))}
         />

         {AlertComponent}
      </Modal>
   );
};
