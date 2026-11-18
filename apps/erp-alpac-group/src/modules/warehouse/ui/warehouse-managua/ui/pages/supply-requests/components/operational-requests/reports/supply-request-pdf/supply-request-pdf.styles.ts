import { StyleSheet } from "@react-pdf/renderer";

export const supplyRequestPdfStyles = StyleSheet.create({
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
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#0f172a",
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
  fieldFull: {
    width: "100%",
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
  justificationBox: {
    marginTop: 4,
    padding: 8,
    backgroundColor: "#f1f5f9",
    borderRadius: 4,
  },
  footer: {
    marginTop: 14,
    fontSize: 8,
    textAlign: "center",
    color: "#64748b",
  },
  signaturesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 80,
    gap: 24,
  },
  signatureBlock: {
    width: "45%",
    alignItems: "center",
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
  signatureLine: {
    width: "100%",
    borderBottom: "1px solid #94a3b8",
    height: 1,
    marginBottom: 4,
  },
  table: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e2e8f0",
    padding: 4,
  },
  tableRow: {
    flexDirection: "row",
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tableCell: {
    fontSize: 9,
    color: "#0f172a",
  },
  colProduct: {
    width: "70%",
  },
  colQty: {
    width: "30%",
    textAlign: "right",
  },
});