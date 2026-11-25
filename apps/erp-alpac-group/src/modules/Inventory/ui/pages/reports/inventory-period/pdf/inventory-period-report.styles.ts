import { StyleSheet } from "@react-pdf/renderer";

import { equipmentReportBaseStyles } from "@app/modules/Inventory/ui/pages/reports/shared/equipment/pdf/equipment-report-pdf.styles";

export const inventoryPeriodReportStyles = StyleSheet.create({
   ...equipmentReportBaseStyles,
   page: {
      ...equipmentReportBaseStyles.page,
      padding: 12,
   },
   cell: {
      ...equipmentReportBaseStyles.cell,
      fontSize: 7,
      padding: 2,
   },
   headerCell: {
      ...equipmentReportBaseStyles.headerCell,
      fontSize: 7,
      padding: 2,
   },
   totalsCell: {
      ...equipmentReportBaseStyles.totalsCell,
      fontSize: 7,
      padding: 2,
   },
   totalsLabel: {
      ...equipmentReportBaseStyles.totalsLabel,
      fontSize: 7,
      padding: 2,
   },
   colStockCode: { width: "9%" },
   colProduct: { width: "16%" },
   colInitialQuantity: { width: "7%", textAlign: "right" },
   colInitialCost: { width: "7%", textAlign: "right" },
   colInitialTotal: { width: "7%", textAlign: "right" },
   colEntryQuantity: { width: "7%", textAlign: "right" },
   colEntryTotal: { width: "8%", textAlign: "right" },
   colExitQuantity: { width: "7%", textAlign: "right" },
   colExitTotal: { width: "8%", textAlign: "right" },
   colFinalQuantity: { width: "7%", textAlign: "right" },
   colFinalCost: { width: "7%", textAlign: "right" },
   colFinalTotal: { width: "10%", textAlign: "right" },
   colTotalsLabel: { width: "39%" },
});
