import { StyleSheet } from "@react-pdf/renderer";

export const LEGAL_LANDSCAPE_SIZE: [number, number] = [1008, 612];

export const styles = StyleSheet.create({
  page: {
    padding: 16,
    paddingBottom: 28,
    fontSize: 5,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    width: "100%",
  },
  headerTextContainer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    minWidth: 0,
    paddingRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 120,
    height: 48,
    objectFit: "contain",
  },
  title: { fontSize: 12, fontWeight: "bold", marginBottom: 4 },
  subtitle: { fontSize: 8, color: "#555" },
  tableRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "stretch",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderLeftWidth: 1,
  },
  tableHeader: {
    backgroundColor: "#f3f4f6",
    borderTopWidth: 1,
  },
  tableCol: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    minWidth: 0,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColArea: {
    flexGrow: 1.8,
    flexShrink: 1,
    flexBasis: 0,
    minWidth: 0,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    margin: 0,
    padding: 2,
    width: "100%",
    fontSize: 4.5,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableCell: {
    margin: 0,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 2,
    paddingRight: 2,
    width: "100%",
    fontSize: 4.5,
    lineHeight: 1.1,
    textAlign: "right",
  },
  tableCellArea: {
    margin: 0,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 2,
    paddingRight: 2,
    width: "100%",
    fontSize: 4.5,
    lineHeight: 1.1,
    textAlign: "left",
    fontWeight: "bold",
  },
  globalTotalsRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "stretch",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderLeftWidth: 1,
    backgroundColor: "#b8d4f0",
    marginTop: 4,
  },
  globalTotalsCell: {
    margin: 0,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 2,
    paddingRight: 2,
    width: "100%",
    fontSize: 4.5,
    fontWeight: "bold",
    color: "#1e3a5f",
    lineHeight: 1.1,
    textAlign: "right",
  },
  globalTotalsCellArea: {
    margin: 0,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 2,
    paddingRight: 2,
    width: "100%",
    fontSize: 4.5,
    fontWeight: "bold",
    color: "#1e3a5f",
    lineHeight: 1.1,
    textAlign: "left",
  },
  signaturesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 32,
    paddingHorizontal: 40,
  },
  signatureBlock: {
    flexDirection: "column",
    alignItems: "center",
    width: "40%",
  },
  signatureStampArea: {
    width: "100%",
    height: 34,
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 2,
  },
  signatureImage: {
    width: "92%",
    height: 32,
    objectFit: "contain",
  },
  signatureLine: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    marginBottom: 6,
  },
  signatureName: {
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 3,
  },
  signatureRole: {
    fontSize: 8,
    color: "#555",
    textAlign: "center",
  },
});

export function getPdfColumnStyle(key: string) {
  return key === "areaName" ? styles.tableColArea : styles.tableCol;
}

export function getPdfHeaderLabel(label: string, subLabel?: string): string {
  if (subLabel) return `${label}\n${subLabel}`;
  return label;
}
