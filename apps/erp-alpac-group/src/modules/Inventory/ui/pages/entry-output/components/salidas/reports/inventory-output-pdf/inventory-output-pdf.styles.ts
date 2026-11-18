import { StyleSheet } from "@react-pdf/renderer";

export const inventoryOutputPdfStyles = StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1e293b",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
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
    color: "#0f172a",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 2,
  },
  divider: {
    borderBottom: "1px solid #cbd5e1",
    marginVertical: 4,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 6,
    color: "#0f172a",
  },
  justificationRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  justificationColumn: {
    width: "48%",
    padding: 8,
    backgroundColor: "#f1f5f9",
    borderRadius: 4,
  },
  justificationLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#475569",
    marginBottom: 4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  field: {
    width: "48%",
    marginBottom: 6,
  },
  fieldThird: {
    width: "31%",
    marginBottom: 6,
  },
  label: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#475569",
    marginBottom: 2,
  },
  value: {
    fontSize: 10,
    color: "#0f172a",
  },
  table: {
    marginTop: 4,
    border: "1px solid #cbd5e1",
    borderRadius: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderBottom: "1px solid #cbd5e1",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #e2e8f0",
  },
  tableCell: {
    padding: 6,
    fontSize: 9,
  },
  colProduct: {
    width: "37%",
  },
  colProductWide: {
    width: "60%",
  },
  colQty: {
    width: "35%",
    textAlign: "right",
  },
  colStock: {
    width: "20%",
    textAlign: "right",
  },
  justificationBox: {
    marginTop: 4,
    padding: 8,
    backgroundColor: "#f1f5f9",
    borderRadius: 4,
  },
  signaturesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 70,
    gap: 24,
  },
  signatureBlock: {
    width: "30%",
    alignItems: "center",
  },
  signatureLine: {
    width: "100%",
    borderBottom: "1px solid #94a3b8",
    height: 1,
    marginBottom: 4,
  },
  signatureName: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 2,
    textAlign: "center",
  },
  signatureLabel: {
    fontSize: 9,
    color: "#475569",
    marginBottom: 8,
  },
  footer: {
    marginTop: 14,
    fontSize: 8,
    textAlign: "center",
    color: "#64748b",
  },
});