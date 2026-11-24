import type { OutputConsolidatedByEquipmentReport } from "@app/modules/Inventory/domain/api-contract/responses/output-consolidated-by-equipment-report.response";

export type OutputsConsolidatedByEquipmentReportPdfProps = {
   report: OutputConsolidatedByEquipmentReport;
   logoUrl?: string | null;
};
