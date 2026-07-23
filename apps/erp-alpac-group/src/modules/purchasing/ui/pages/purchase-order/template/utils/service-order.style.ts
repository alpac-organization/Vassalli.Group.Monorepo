import { StyleSheet } from "@react-pdf/renderer";
export const s = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 36,
    paddingHorizontal: 32,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#000",
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
  headerContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    width: "100%",
    position: "relative",
    minHeight: 70,
  },
  logoContainer: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  logo: {
    width: 60,
    height: 60,
    objectFit: "contain",
  },
  companyName: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },
  companyContact: {
    fontSize: 8,
    textAlign: "center",
    marginTop: 2,
  },
  companyCity: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginTop: 1,
  },
  documentTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginTop: 8,
    textDecoration: "underline",
  },
  infoSection: {
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  infoLeft: {
    flex: 1,
    fontSize: 9,
  },
  infoRight: {
    width: "38%",
    fontSize: 9,
    textAlign: "left",
  },
  metaBox: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#000",
    minHeight: 36,
    marginBottom: 10,
  },
  metaCol: {
    flex: 1,
    padding: 4,
    justifyContent: "center",
  },
  metaColBorder: {
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  metaLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
  metaValue: {
    fontSize: 8,
    marginTop: 2,
  },
  instruction: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
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
  tableHeader: {
    backgroundColor: "#fff",
  },
  cell: {
    borderRightWidth: 1,
    borderRightColor: "#000",
    paddingVertical: 3,
    paddingHorizontal: 3,
    fontSize: 8,
    justifyContent: "center",
  },
  cellLast: {
    borderRightWidth: 0,
  },
  headerText: {
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    fontSize: 8,
  },
  center: {
    textAlign: "center",
  },
  right: {
    textAlign: "right",
  },
  colQty: { width: "10%" },
  colUnit: { width: "10%" },
  colCode: { width: "10%" },
  colDesc: { width: "34%" },
  colPrice: { width: "18%" },
  colTotal: { width: "18%" },
  descCell: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  descText: {
    fontSize: 8,
    flex: 1,
  },
  flagText: {
    fontSize: 8,
    marginLeft: 4,
  },
  summaryRow: {
    flexDirection: "row",
    minHeight: 90,
  },
  notesCell: {
    width: "64%",
    borderRightWidth: 1,
    borderRightColor: "#000",
    padding: 6,
  },
  notesText: {
    fontSize: 8,
    lineHeight: 1.35,
  },
  totalsCell: {
    width: "36%",
    paddingVertical: 4,
    paddingHorizontal: 6,
    justifyContent: "flex-start",
  },
  totalLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  totalLineFinal: {
    marginTop: 2,
    paddingTop: 3,
    borderTopWidth: 1,
    borderTopColor: "#000",
  },
  totalLabel: {
    fontSize: 8,
  },
  totalValue: {
    fontSize: 8,
    textAlign: "right",
  },
  paymentNote: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    marginTop: 12,
    marginBottom: 14,
  },
  refRow: {
    flexDirection: "row",
    marginBottom: 28,
  },
  refRightContainer: {
    flex: 0.7,
    alignItems: "flex-start",
  },
  refLeft: {
    fontSize: 9,
  },
  refRight: {
    fontSize: 9,
  },
  signatures: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  signatureBlock: {
    width: "40%",
    alignItems: "center",
  },
  signatureLine: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginBottom: 4,
  },
  signatureLabel: {
    fontSize: 9,
    textAlign: "center",
  },
});
