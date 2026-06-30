import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontFamily: "Helvetica",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingBottom: 10,
  },
  logo: {
    width: 60,
    height: 40,
    marginRight: 16,
    objectFit: "contain",
  },
  headerTextBlock: {
    flex: 1,
    flexDirection: "column",
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E293B",
  },
  branchName: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "medium",
  },
  periodText: {
    fontSize: 10,
    color: "#64748B",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    minHeight: 24,
    alignItems: "stretch",
  },
  headerRow: {
    backgroundColor: "#F8FAFC",
    borderBottomColor: "#CBD5E1",
  },
  bodyRow: {
    backgroundColor: "#FFFFFF",
  },
  totalsRow: {
    backgroundColor: "#F1F5F9",
    borderTopWidth: 2,
    borderTopColor: "#94A3B8",
    marginTop: 4,
  },
  cellText: {
    fontSize: 8,
    color: "#334155",
    paddingVertical: 4,
    paddingHorizontal: 6,
    height: "100%",
  },
  cellTextRight: {
    fontSize: 8,
    color: "#334155",
    textAlign: "right",
    paddingVertical: 4,
    paddingHorizontal: 6,
    height: "100%",
  },
  headerCell: {
    fontWeight: "bold",
    color: "#0F172A",
  },
  cellCode: { width: "10%" },
  cellName: { width: "20%" },
  cellAmount: { width: "11.66%" },
  totalsText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#0F172A",
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  signaturesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
    paddingTop: 10,
  },
  signatureBlock: {
    width: "30%",
    alignItems: "center",
  },
  signatureLine: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#94A3B8",
    marginBottom: 4,
  },
  signatureText: {
    fontSize: 8,
    color: "#475569",
  },
  signatureImage: {
    width: "100%",
    height: 40,
    objectFit: "contain",
  },
  signaturePlaceholder: {
    height: 40,
  },
});
