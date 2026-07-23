import { StyleSheet } from "@react-pdf/renderer";

export const s = StyleSheet.create({
  page: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 36,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#000",
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  headerLeft: {
    width: "26%",
    alignItems: "flex-start",
  },
  headerCenter: {
    width: "48%",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 6,
  },
  headerRight: {
    width: "26%",
    alignItems: "flex-end",
    paddingTop: 4,
  },
  logo: {
    width: 64,
    height: 64,
    objectFit: "contain",
  },
  companyName: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  formCode: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
  },
  requisitionNumber: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginTop: 6,
  },
  documentTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 14,
  },
  table: {
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 10,
    width: "100%",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    minHeight: 20,
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  cell: {
    borderRightWidth: 1,
    borderRightColor: "#000",
    paddingVertical: 5,
    paddingHorizontal: 5,
    fontSize: 9,
    justifyContent: "center",
  },
  cellLast: {
    borderRightWidth: 0,
  },
  headerText: {
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    fontSize: 10,
  },
  center: {
    textAlign: "center",
  },
  colQty: { width: "15%" },
  colDesc: { width: "42.5%" },
  colJust: { width: "42.5%" },
  metaSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 28,
    position: "relative",
  },
  metaLeft: {
    width: "52%",
  },
  metaRight: {
    width: "42%",
    paddingTop: 0,
  },
  metaLine: {
    fontSize: 10,
  },
  authLabel: {
    fontSize: 10,
  },
  authLine: {
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    width: "100%",
  },
  receiptBox: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#000",
    paddingVertical: 14,
    paddingHorizontal: 10,
    minHeight: 78,
    alignItems: "center",
    marginBottom: 24,
    position: "relative",
  },
  receiptLeft: {
    width: "65%",
    flexDirection: "row",
    alignItems: "flex-end",
    paddingRight: 12,
  },
  receiptLabel: {
    fontSize: 10,
    marginRight: 6,
  },
  receiptSignatureLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginBottom: 1,
  },
  receiptRight: {
    width: "35%",
    paddingLeft: 6,
  },
  receiptDateLine: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  receiptDateValue: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginLeft: 4,
    fontSize: 10,
    paddingBottom: 1,
    textAlign: "center",
  },
  statusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 6,
  },
  statusItem: {
    fontSize: 9,
    flex: 1,
  },
});
