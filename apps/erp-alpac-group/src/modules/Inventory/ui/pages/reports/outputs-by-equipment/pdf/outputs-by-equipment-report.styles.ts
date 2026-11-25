import { StyleSheet } from "@react-pdf/renderer";

import { equipmentReportBaseStyles } from "@app/modules/Inventory/ui/pages/reports/shared/equipment/pdf/equipment-report-pdf.styles";

export const outputsByEquipmentReportStyles = StyleSheet.create({
   ...equipmentReportBaseStyles,
   categoryTitle: {
      fontSize: 11,
      fontWeight: "bold",
      color: "#1d4ed8",
      marginTop: 8,
      marginBottom: 4,
   },
   equipmentBlock: {
      marginBottom: 8,
   },
   equipmentTitle: {
      fontSize: 10,
      fontWeight: "bold",
      color: "#374151",
      marginTop: 6,
      marginBottom: 2,
   },
   productBlock: {
      marginBottom: 6,
   },
   productTitle: {
      fontSize: 9,
      fontWeight: "bold",
      color: "#111827",
      marginBottom: 2,
   },
   equipmentTotalsRow: {
      backgroundColor: "#e5e7eb",
   },
   colCode: { width: "12%" },
   colRequest: { width: "12%" },
   colDate: { width: "10%" },
   colQty: { width: "8%", textAlign: "right" },
   colCost: { width: "10%", textAlign: "right" },
   colTotal: { width: "12%", textAlign: "right" },
   colCenter: { width: "13%" },
   colService: { width: "11%" },
   colCustomer: { width: "12%" },
   colLabel: { width: "34%" },
});
