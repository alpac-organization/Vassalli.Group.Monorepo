import { warehouseHttpHandler } from "@app/core/adapters";
import { InventoryReportsServices } from "@app/modules/Inventory/infrastructure/services/inventory-reports-services";
import type { OutputDetailByEquipmentReport } from "@app/modules/Inventory/domain/api-contract/responses/output-detail-by-equipment-report.response";

import { EquipmentReportModal } from "@app/modules/Inventory/ui/pages/reports/shared/equipment/equipment-report-modal";

import { generateOutputsDetailByEquipmentReportPdf } from "@app/modules/Inventory/ui/pages/reports/outputs-detail-by-equipment/pdf/outputs-detail-by-equipment-report.generate";

const inventoryReportsServices = new InventoryReportsServices(warehouseHttpHandler);

export const OutputsDetailByEquipmentReportModal = function ({
   isOpen,
   onClose,
}: {
   isOpen: boolean;
   onClose: () => void;
}) {
   return (
      <EquipmentReportModal<OutputDetailByEquipmentReport>
         isOpen={isOpen}
         onClose={onClose}
         title="Salidas a detalle por equipo"
         description="Aplica los filtros y genera el reporte en PDF."
         loadingTitle="Generando reporte de salidas a detalle por equipo..."
         errorMessage="Error al generar el reporte de salidas a detalle por equipo."
         requireCategory={false}
         fetchReport={(payload) => inventoryReportsServices.GetOutputsDetailByEquipmentReport(payload)}
         generatePdf={generateOutputsDetailByEquipmentReportPdf}
      />
   );
};
