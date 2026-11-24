import type { OutputDetailByEquipmentReport } from "@app/modules/Inventory/domain/api-contract/responses/output-detail-by-equipment-report.response";

export type OutputsDetailByEquipmentReportPdfProps = {
   report: OutputDetailByEquipmentReport;
   logoUrl?: string | null;
};
