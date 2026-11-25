import type { ComponentType } from "react";

import type { EquipmentReportPdfProps } from "@app/modules/Inventory/ui/pages/reports/shared/equipment/equipment-report.types";

export type GenerateEquipmentReportPdfParams<TReport> = EquipmentReportPdfProps<TReport>;

export function createEquipmentReportPdfGenerator<TReport>(
   loadReport: () => Promise<ComponentType<EquipmentReportPdfProps<TReport>>>,
) {
   return async function generateEquipmentReportPdf(
      params: GenerateEquipmentReportPdfParams<TReport>,
   ): Promise<Blob> {
      const [{ pdf }, Report] = await Promise.all([
         import("@react-pdf/renderer"),
         loadReport(),
      ]);

      return pdf(<Report report={params.report} logoUrl={params.logoUrl} />).toBlob();
   };
}
