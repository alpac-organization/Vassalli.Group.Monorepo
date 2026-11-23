import { StyleSheet } from "@react-pdf/renderer";

export const stockDailyReportStyles = StyleSheet.create({
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
   companyName: {
      fontSize: 12,
      fontWeight: "bold",
      color: "#1f2937",
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
   sectionTitle: {
      fontSize: 11,
      fontWeight: "bold",
      color: "#1f2937",
      marginTop: 8,
      marginBottom: 4,
   },
   branchTitle: {
      fontSize: 12,
      fontWeight: "bold",
      marginTop: 10,
      marginBottom: 4,
      color: "#1d4ed8",
   },
   areaTitle: {
      fontSize: 10,
      fontWeight: "bold",
      marginTop: 6,
      marginBottom: 2,
      color: "#374151",
   },
   costCenterTitle: {
      fontSize: 9,
      fontWeight: "bold",
      marginTop: 4,
      marginBottom: 2,
      color: "#4b5563",
   },
   usageTypeTitle: {
      fontSize: 9,
      fontWeight: "bold",
      marginTop: 3,
      marginBottom: 1,
      color: "#6b7280",
   },
   table: {
      width: "100%",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#d1d5db",
      marginBottom: 6,
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
   cell: {
      padding: 3,
      fontSize: 8,
   },
   headerCell: {
      color: "#ffffff",
      fontWeight: "bold",
   },
   colCode: { width: "15%" },
   colName: { width: "20%" },
   colDesc: { width: "20%" },
   colStock: { width: "9%", textAlign: "right" },
   colUnit: { width: "7%" },
   colMin: { width: "7%", textAlign: "right" },
   colMax: { width: "7%", textAlign: "right" },
   colStatus: { width: "12%" },
    statusBadge: {
       paddingVertical: 2,
       paddingHorizontal: 4,
       borderRadius: 8,
       alignSelf: "center",
    },
    statusBadgeText: {
       fontSize: 7,
       fontWeight: "bold",
       textAlign: "center",
    },
    statusBadgeDanger: {
       backgroundColor: "#fee2e2",
    },
    statusBadgeDangerText: {
       color: "#b91c1c",
    },
    statusBadgeWarning: {
       backgroundColor: "#fef3c7",
    },
    statusBadgeWarningText: {
       color: "#92400e",
    },
    statusBadgeInfo: {
       backgroundColor: "#dbeafe",
    },
    statusBadgeInfoText: {
       color: "#1d4ed8",
    },
    statusBadgeSuccess: {
       backgroundColor: "#dcfce7",
    },
    statusBadgeSuccessText: {
       color: "#166534",
    },
    statusBadgeNeutral: {
       backgroundColor: "#e5e7eb",
    },
    statusBadgeNeutralText: {
       color: "#374151",
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