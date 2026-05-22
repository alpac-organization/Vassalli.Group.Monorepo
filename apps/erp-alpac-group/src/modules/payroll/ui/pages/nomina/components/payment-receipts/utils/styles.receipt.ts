import { StyleSheet } from "@react-pdf/renderer";

export const LETTER_PORTRAIT_SIZE: [number, number] = [612, 792];

export const receiptStyles = StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#000",
  },

  companyName: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },
  title: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginTop: 2,
  },
  period: {
    fontSize: 9,
    textAlign: "center",
    marginTop: 3,
    marginBottom: 10,
  },

  infoBox: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 6,
    marginBottom: 12,
    flexDirection: "row",
  },
  infoLeft: {
    flex: 1,
  },
  infoRight: {
    flex: 1,
    paddingLeft: 12,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  infoLabel: {
    width: "45%",
    fontFamily: "Helvetica-Bold",
  },
  infoValue: {
    flex: 1,
  },

  table: {
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 12,
    minHeight: 160,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  headerCell: {
    flex: 1,
    padding: 4,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  headerCellLast: {
    flex: 1,
    padding: 4,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },
  tableBody: {
    flexDirection: "row",
    flex: 1,
  },
  transportTable: {
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 12,
  },
  transportTableBody: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  incomeCol: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#000",
    padding: 4,
  },
  transportIncomeCol: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#000",
    padding: 4,
    minWidth: 0,
  },
  deductCol: {
    flex: 1,
    padding: 4,
  },
  transportDeductCol: {
    flex: 1,
    padding: 4,
    alignSelf: "flex-start",
  },
  lineItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  lineLabel: {
    flex: 1,
  },
  lineValue: {
    width: "40%",
    textAlign: "right",
  },
  lineLabelPct: {
    width: "35%",
  },
  linePct: {
    width: "18%",
    textAlign: "right",
  },
  lineValuePct: {
    width: "35%",
    textAlign: "right",
  },
  extraInfoText: {
    marginTop: 6,
    fontSize: 9,
  },

  routeTable: {
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 8,
    width: "100%",
  },
  routeHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    backgroundColor: "#f5f5f5",
    minHeight: 28,
    alignItems: "center",
  },
  routeColOrigin: {
    width: "40%",
    paddingVertical: 4,
    paddingHorizontal: 3,
    borderRightWidth: 1,
    borderRightColor: "#000",
    justifyContent: "center",
  },
  routeColValue: {
    width: "20%",
    paddingVertical: 4,
    paddingHorizontal: 2,
    borderRightWidth: 1,
    borderRightColor: "#000",
    justifyContent: "center",
  },
  routeColValueLast: {
    width: "20%",
    paddingVertical: 4,
    paddingHorizontal: 2,
    justifyContent: "center",
  },
  routeHeaderText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7,
    textAlign: "center",
  },
  routeHeaderTextOrigin: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7,
    textAlign: "left",
  },
  routeRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    minHeight: 16,
    alignItems: "center",
  },
  routeRowLast: {
    flexDirection: "row",
    minHeight: 16,
    alignItems: "center",
  },
  routeOriginText: {
    fontSize: 7,
    lineHeight: 1.25,
  },
  routeAmountText: {
    fontSize: 7,
    textAlign: "right",
  },

  totalsRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#000",
  },
  totalsIncomeCell: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#000",
    padding: 4,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalsDeductCell: {
    flex: 1,
    padding: 4,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalsLabel: {
    fontFamily: "Helvetica-Bold",
  },
  totalsValue: {
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
  },

  netRow: {
    flexDirection: "row",
    paddingHorizontal: 4,
    paddingTop: 4,
    paddingBottom: 2,
    justifyContent: "space-between",
  },
  netLabel: {
    fontFamily: "Helvetica-Bold",
    flex: 1,
  },
  netValue: {
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
  },
  transportNetRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#000",
    paddingHorizontal: 4,
    paddingVertical: 5,
    justifyContent: "space-between",
  },

  signatureArea: {
    marginTop: 24,
    alignItems: "flex-end",
  },
  signatureLine: {
    width: "45%",
    borderTopWidth: 1,
    borderTopColor: "#000",
    marginBottom: 3,
  },
  signatureLabel: {
    width: "45%",
    textAlign: "center",
    fontSize: 9,
  },
});
