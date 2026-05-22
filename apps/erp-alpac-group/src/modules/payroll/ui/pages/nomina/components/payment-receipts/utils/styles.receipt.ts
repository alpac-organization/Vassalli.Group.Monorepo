import { StyleSheet } from "@react-pdf/renderer";

export const LETTER_PORTRAIT_SIZE: [number, number] = [612, 792];

export const receiptStyles = StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#000",
  },

  // ── Header ──────────────────────────────────────────────────────────────
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

  // ── Info box (Area / Nombre / Ubicacion / Sueldo) ────────────────────────
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

  // ── Main income/deduction table ──────────────────────────────────────────
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
  incomeCol: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#000",
    padding: 4,
  },
  deductCol: {
    flex: 1,
    padding: 4,
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

  // ── Travel routes sub-table (transportistas) ─────────────────────────────
  routeTable: {
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 6,
  },
  routeHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    backgroundColor: "#fff",
  },
  routeHeaderCell: {
    flex: 1,
    padding: 3,
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    borderRightWidth: 1,
    borderRightColor: "#000",
    textAlign: "center",
  },
  routeHeaderCellLast: {
    flex: 1,
    padding: 3,
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    textAlign: "center",
  },
  routeRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  routeRowLast: {
    flexDirection: "row",
  },
  routeCell: {
    flex: 1,
    padding: 3,
    fontSize: 8,
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  routeCellRight: {
    flex: 1,
    padding: 3,
    fontSize: 8,
    textAlign: "right",
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  routeCellLast: {
    flex: 1,
    padding: 3,
    fontSize: 8,
    textAlign: "right",
  },

  // ── Totals row ───────────────────────────────────────────────────────────
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

  // ── Net row ──────────────────────────────────────────────────────────────
  netRow: {
    flexDirection: "row",
    paddingHorizontal: 4,
    paddingTop: 4,
    paddingBottom: 2,
  },
  netLabel: {
    fontFamily: "Helvetica-Bold",
    width: "50%",
  },
  netValue: {
    fontFamily: "Helvetica-Bold",
    width: "50%",
  },

  // ── Signature / footer ───────────────────────────────────────────────────
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
