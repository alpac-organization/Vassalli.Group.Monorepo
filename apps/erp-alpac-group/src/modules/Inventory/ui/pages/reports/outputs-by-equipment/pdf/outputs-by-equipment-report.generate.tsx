import type { OutputLineEquipmentReport } from "@app/modules/Inventory/domain/api-contract/responses/output-line-equipment-report.response";

import { createEquipmentReportPdfGenerator } from "@app/modules/Inventory/ui/pages/reports/shared/equipment/pdf/generate-equipment-report-pdf";

export const generateOutputsByEquipmentReportPdf = createEquipmentReportPdfGenerator<OutputLineEquipmentReport>(
   () => import("@app/modules/Inventory/ui/pages/reports/outputs-by-equipment/pdf/outputs-by-equipment-report")
      .then((module) => module.OutputsByEquipmentReportPdf),
);
