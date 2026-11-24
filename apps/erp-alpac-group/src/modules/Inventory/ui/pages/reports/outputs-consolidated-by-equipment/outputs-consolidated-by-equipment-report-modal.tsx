import { warehouseHttpHandler } from "@app/core/adapters";
import { InventoryReportsServices } from "@app/modules/Inventory/infrastructure/services/inventory-reports-services";
import type { OutputConsolidatedByEquipmentReport } from "@app/modules/Inventory/domain/api-contract/responses/output-consolidated-by-equipment-report.response";

import { EquipmentReportModal } from "@app/modules/Inventory/ui/pages/reports/shared/equipment/equipment-report-modal";

import { generateOutputsConsolidatedByEquipmentReportPdf } from "@app/modules/Inventory/ui/pages/reports/outputs-consolidated-by-equipment/pdf/outputs-consolidated-by-equipment-report.generate";

const inventoryReportsServices = new InventoryReportsServices(warehouseHttpHandler);

export const OutputsConsolidatedByEquipmentReportModal = function ({
   isOpen,
   onClose,
}: {
   isOpen: boolean;
   onClose: () => void;
}) {
   return (
      <EquipmentReportModal<OutputConsolidatedByEquipmentReport>
         isOpen={isOpen}
         onClose={onClose}
         title="Salidas consolidadas por equipo"
         description="Aplica los filtros y genera el reporte en PDF."
         loadingTitle="Generando reporte de salidas consolidadas por equipo..."
         errorMessage="Error al generar el reporte de salidas consolidadas por equipo."
         requireCategory={false}
         fetchReport={(payload) => inventoryReportsServices.GetOutputsConsolidatedByEquipmentReport(payload)}
         generatePdf={generateOutputsConsolidatedByEquipmentReportPdf}
      />
   );
};
