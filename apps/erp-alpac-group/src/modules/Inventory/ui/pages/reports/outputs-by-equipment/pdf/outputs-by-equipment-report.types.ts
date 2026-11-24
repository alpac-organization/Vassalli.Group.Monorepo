import type { OutputLineEquipmentReport } from "@app/modules/Inventory/domain/api-contract/responses/output-line-equipment-report.response";

export type OutputsByEquipmentReportPdfProps = {
   report: OutputLineEquipmentReport;
   logoUrl?: string | null;
};