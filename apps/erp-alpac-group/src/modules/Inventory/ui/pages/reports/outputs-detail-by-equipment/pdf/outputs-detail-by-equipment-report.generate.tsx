import type { OutputDetailByEquipmentReport } from "@app/modules/Inventory/domain/api-contract/responses/output-detail-by-equipment-report.response";

import { createEquipmentReportPdfGenerator } from "@app/modules/Inventory/ui/pages/reports/shared/equipment/pdf/generate-equipment-report-pdf";

export const generateOutputsDetailByEquipmentReportPdf = createEquipmentReportPdfGenerator<OutputDetailByEquipmentReport>(
   () => import("@app/modules/Inventory/ui/pages/reports/outputs-detail-by-equipment/pdf/outputs-detail-by-equipment-report")
      .then((module) => module.OutputsDetailByEquipmentReportPdf),
);
