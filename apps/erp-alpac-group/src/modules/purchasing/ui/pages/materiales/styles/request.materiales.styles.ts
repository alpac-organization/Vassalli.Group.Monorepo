import { StyleSheet } from "@react-pdf/renderer";

export const s = StyleSheet.create({
  page: {
    paddingTop: 20,
    paddingBottom: 18,
    paddingHorizontal: 24,
    fontSize: 8,
    fontFamily: "Helvetica",
    color: "#000",
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  headerLeft: {
    width: "22%",
    alignItems: "flex-start",
  },
  headerCenter: {
    width: "56%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 4,
  },
  headerRight: {
    width: "22%",
    alignItems: "flex-end",
    paddingTop: 4,
  },
  logo: {
    width: 70,
    height: 48,
    objectFit: "contain",
  },
  companyName: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },
  documentTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginTop: 2,
  },
  formCode: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textDecoration: "underline",
  },
  metaBox: {
    borderWidth: 1,
    borderColor: "#000",
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 10,
    flexDirection: "row",
  },
  metaCol: {
    width: "50%",
  },
  metaLine: {
    flexDirection: "row",
    marginBottom: 3,
    fontSize: 9,
  },
  metaLabel: {
    fontFamily: "Helvetica-Bold",
    marginRight: 4,
  },
  metaValue: {
    fontFamily: "Helvetica",
  },
  table: {
    borderWidth: 1,
    borderColor: "#000",
    width: "100%",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    minHeight: 18,
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  cell: {
    borderRightWidth: 1,
    borderRightColor: "#000",
    paddingVertical: 3,
    paddingHorizontal: 3,
    fontSize: 7,
    justifyContent: "center",
  },
  cellLast: {
    borderRightWidth: 0,
  },
  headerText: {
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    fontSize: 7,
  },
  center: {
    textAlign: "center",
  },
  colCode: { width: "7%" },
  colName: { width: "28%" },
  colUnit: { width: "8%" },
  colQty: { width: "10%" },
  colDelivered: { width: "12%" },
  colStock: { width: "12%" },
  colObs: { width: "23%" },
  footerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    marginBottom: 16,
  },
  footerLeft: {
    width: "48%",
  },
  footerRight: {
    width: "40%",
  },
  footerLine: {
    marginBottom: 8,
  },
  footerLabel: {
    fontSize: 9,
    marginBottom: 2,
  },
  underline: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    minHeight: 12,
    marginTop: 2,
  },
  statusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
    paddingTop: 6,
  },
  statusItem: {
    fontSize: 8,
    flex: 1,
  },
});
