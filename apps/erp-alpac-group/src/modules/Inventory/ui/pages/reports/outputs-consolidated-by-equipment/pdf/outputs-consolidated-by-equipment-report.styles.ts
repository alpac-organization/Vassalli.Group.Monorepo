import { StyleSheet } from "@react-pdf/renderer";

import { equipmentReportBaseStyles, getEquipmentReportCompactStyles } from "@app/modules/Inventory/ui/pages/reports/shared/equipment/pdf/equipment-report-pdf.styles";

export const outputsConsolidatedByEquipmentReportStyles = StyleSheet.create({
   ...equipmentReportBaseStyles,
   ...getEquipmentReportCompactStyles(7),
   categoryTitle: {
      fontSize: 10,
      fontWeight: "bold",
      color: "#1d4ed8",
      marginTop: 8,
      marginBottom: 4,
   },
   categoryBlock: {
      marginBottom: 8,
   },
   colEquipment: { width: "12%" },
   colStockCode: { width: "13%" },
   colSupply: { width: "18%" },
   colQty: { width: "9%", textAlign: "right" },
   colTotal: { width: "12%", textAlign: "right" },
   colCenter: { width: "16%" },
   colCustomer: { width: "20%" },
   colTotalsLabel: { width: "52%" },
});
