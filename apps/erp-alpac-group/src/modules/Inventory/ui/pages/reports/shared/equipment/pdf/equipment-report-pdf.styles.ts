import { StyleSheet } from "@react-pdf/renderer";

export const equipmentReportBaseStyles = StyleSheet.create({
   page: {
      padding: 24,
      fontSize: 9,
      fontFamily: "Helvetica",
   },
   header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
   },
   headerLeft: {
      width: 70,
   },
   logo: {
      width: 70,
      height: 40,
      objectFit: "contain",
   },
   headerCenter: {
      flex: 1,
      alignItems: "center",
   },
   spacer: {
      width: 70,
   },
   title: {
      fontSize: 14,
      fontWeight: "bold",
      marginTop: 2,
      color: "#111827",
   },
   subtitle: {
      fontSize: 9,
      color: "#6b7280",
      marginTop: 2,
   },
   divider: {
      borderBottomWidth: 1,
      borderBottomColor: "#d1d5db",
      marginVertical: 8,
   },
   table: {
      width: "100%",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#d1d5db",
      marginBottom: 4,
   },
   tableHeader: {
      flexDirection: "row",
      backgroundColor: "#1d4ed8",
      borderBottomWidth: 1,
      borderBottomColor: "#1e40af",
   },
   tableRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#e5e7eb",
   },
   tableRowAlt: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#e5e7eb",
      backgroundColor: "#f9fafb",
   },
   totalsRow: {
      flexDirection: "row",
      borderTopWidth: 1,
      borderTopColor: "#9ca3af",
      backgroundColor: "#f3f4f6",
   },
   cell: {
      padding: 3,
      fontSize: 8,
   },
   headerCell: {
      color: "#ffffff",
      fontWeight: "bold",
   },
   totalsCell: {
      padding: 3,
      fontSize: 8,
      fontWeight: "bold",
      color: "#111827",
   },
   totalsLabel: {
      padding: 3,
      fontSize: 8,
      fontWeight: "bold",
      color: "#111827",
      textAlign: "right",
   },
   empty: {
      fontSize: 9,
      color: "#6b7280",
      marginTop: 4,
   },
   footer: {
      marginTop: 12,
      fontSize: 8,
      color: "#9ca3af",
      textAlign: "center",
   },
});

export function getEquipmentReportCompactStyles(fontSize: number) {
   return StyleSheet.create({
      page: {
         ...equipmentReportBaseStyles.page,
         padding: 12,
      },
      cell: {
         ...equipmentReportBaseStyles.cell,
         fontSize,
         padding: 2,
      },
      headerCell: {
         ...equipmentReportBaseStyles.headerCell,
         fontSize,
         padding: 2,
      },
      totalsCell: {
         ...equipmentReportBaseStyles.totalsCell,
         fontSize,
         padding: 2,
      },
      totalsLabel: {
         ...equipmentReportBaseStyles.totalsLabel,
         fontSize,
         padding: 2,
      },
   });
}
