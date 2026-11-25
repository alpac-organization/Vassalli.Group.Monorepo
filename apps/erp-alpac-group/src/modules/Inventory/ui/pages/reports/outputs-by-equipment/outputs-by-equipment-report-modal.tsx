import { warehouseHttpHandler } from "@app/core/adapters";
import { InventoryReportsServices } from "@app/modules/Inventory/infrastructure/services/inventory-reports-services";
import type { OutputLineEquipmentReport } from "@app/modules/Inventory/domain/api-contract/responses/output-line-equipment-report.response";

import { EquipmentReportModal } from "@app/modules/Inventory/ui/pages/reports/shared/equipment/equipment-report-modal";

import { generateOutputsByEquipmentReportPdf } from "@app/modules/Inventory/ui/pages/reports/outputs-by-equipment/pdf/outputs-by-equipment-report.generate";

const inventoryReportsServices = new InventoryReportsServices(warehouseHttpHandler);

export const OutputsByEquipmentReportModal = function ({
   isOpen,
   onClose,
}: {
   isOpen: boolean;
   onClose: () => void;
}) {
   return (
      <EquipmentReportModal<OutputLineEquipmentReport>
         isOpen={isOpen}
         onClose={onClose}
         title="Salidas por equipo (Linea-Equipo)"
         description="Aplica los filtros y genera el reporte en PDF."
         loadingTitle="Generando reporte de salidas por equipo..."
         errorMessage="Error al generar el reporte de salidas por equipo."
         requireCategory
         fetchReport={(payload) => inventoryReportsServices.GetOutputsLineEquipmentReport(payload)}
         generatePdf={generateOutputsByEquipmentReportPdf}
      />
   );
};
