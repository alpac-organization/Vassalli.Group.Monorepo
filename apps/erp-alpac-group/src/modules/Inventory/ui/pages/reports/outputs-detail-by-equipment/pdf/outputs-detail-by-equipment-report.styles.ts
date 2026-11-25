import { StyleSheet } from "@react-pdf/renderer";

import { equipmentReportBaseStyles, getEquipmentReportCompactStyles } from "@app/modules/Inventory/ui/pages/reports/shared/equipment/pdf/equipment-report-pdf.styles";

export const outputsDetailByEquipmentReportStyles = StyleSheet.create({
   ...equipmentReportBaseStyles,
   ...getEquipmentReportCompactStyles(6),
   colCode: { width: "9%" },
   colRequest: { width: "9%" },
   colEquipment: { width: "7%" },
   colCategory: { width: "7%" },
   colStockCode: { width: "9%" },
   colDate: { width: "7%" },
   colSupply: { width: "9%" },
   colQty: { width: "4%", textAlign: "right" },
   colCost: { width: "6%", textAlign: "right" },
   colTotal: { width: "6%", textAlign: "right" },
   colCenter: { width: "9%" },
   colService: { width: "7%" },
   colCustomer: { width: "11%" },
   colTotalsLabel: { width: "57%" },
});
