import type { OutputConsolidatedByEquipmentReport } from "@app/modules/Inventory/domain/api-contract/responses/output-consolidated-by-equipment-report.response";

import { createEquipmentReportPdfGenerator } from "@app/modules/Inventory/ui/pages/reports/shared/equipment/pdf/generate-equipment-report-pdf";

export const generateOutputsConsolidatedByEquipmentReportPdf = createEquipmentReportPdfGenerator<OutputConsolidatedByEquipmentReport>(
   () => import("@app/modules/Inventory/ui/pages/reports/outputs-consolidated-by-equipment/pdf/outputs-consolidated-by-equipment-report")
      .then((module) => module.OutputsConsolidatedByEquipmentReportPdf),
);
