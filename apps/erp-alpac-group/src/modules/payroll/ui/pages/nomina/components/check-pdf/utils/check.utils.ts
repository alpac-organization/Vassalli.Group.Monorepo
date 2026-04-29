export const LETTER_PORTRAIT_SIZE: [number, number] = [612, 792];
import { StyleSheet } from "@react-pdf/renderer";
export const styles = StyleSheet.create({
  page: { padding: 25, fontSize: 9, fontFamily: "Helvetica", color: "#000" },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
    position: "relative",
  },
  logoContainer: {
    position: "absolute",
    left: 20,
    top: -10,
  },
  logo: {
    width: 60,
    height: 60,
    objectFit: "contain",
  },
  headerTextContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  companyName: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Helvetica-Bold",
  },
  documentTitle: { fontSize: 14 },

  mainBox: {
    borderWidth: 2,
    borderColor: "#000",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    alignItems: "stretch",
  },
  lastRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  labelCell: {
    width: "15%",
    padding: 4,
  },
  valueCell: {
    width: "45%",
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginRight: 10,
  },
  retentionLabelCell: {
    width: "15%",
    padding: 4,
  },
  retentionValueCell: {
    width: "25%",
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },

  topSectionRow: {
    flexDirection: "row",
    padding: 2,
    alignItems: "flex-end",
  },

  conceptBox: {
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 10,
  },
  conceptTitle: {
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    backgroundColor: "#f0f0f0",
  },
  conceptContent: {
    padding: 4,
    minHeight: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  accountContent: {
    flexDirection: "row",
    padding: 4,
  },

  checkListBox: {
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 10,
  },
  checkListHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  checkListHeaderCell1: {
    width: "10%",
    padding: 3,
    borderRightWidth: 1,
    borderRightColor: "#000",
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "Helvetica-Bold",
  },
  checkListHeaderCell2: {
    width: "70%",
    padding: 3,
    borderRightWidth: 1,
    borderRightColor: "#000",
    fontWeight: "bold",
    fontFamily: "Helvetica-Bold",
  },
  checkListHeaderCell3: {
    width: "20%",
    padding: 3,
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "Helvetica-Bold",
  },
  checkListSubHeader: {
    padding: 3,
    fontWeight: "bold",
    fontFamily: "Helvetica-Bold",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  checkListItemRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    alignItems: "center",
  },
  checkListItemBox: {
    width: "10%",
    padding: 3,
    borderRightWidth: 1,
    borderRightColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  square: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: "#000",
  },
  checkListItemText: {
    width: "70%",
    padding: 3,
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  checkListItemVerification: {
    width: "20%",
    padding: 3,
  },

  signaturesContainer: {
    marginTop: 10,
  },
  signaturesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  signatureBlock: {
    width: "30%",
    alignItems: "center",
  },
  signatureLine: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#000",
    marginBottom: 4,
  },
  signatureTitle: {
    fontWeight: "bold",
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  signatureName: {
    marginBottom: 2,
  },
  signatureRole: {
    fontSize: 8,
  },

  receiptBox: {
    borderWidth: 1,
    borderColor: "#000",
    flexDirection: "row",
    marginTop: 10,
  },
  receiptCell: {
    flex: 1,
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  receiptCellLast: {
    flex: 1,
    padding: 4,
  },
  receiptLabel: {
    fontWeight: "bold",
    fontFamily: "Helvetica-Bold",
    marginBottom: 10,
  },
});
