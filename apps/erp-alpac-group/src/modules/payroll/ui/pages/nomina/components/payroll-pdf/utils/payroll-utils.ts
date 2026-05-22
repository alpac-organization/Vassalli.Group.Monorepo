import { StyleSheet } from "@react-pdf/renderer";
export {
  groupByWorkArea,
  calcAreaTotals,
} from "@app/modules/payroll/ui/pages/nomina/utils/payroll-report-grouping.utils";

export function withSoftLineBreaks(value: string): string {
  if (!value) return value;

  const normalized = value.replace(/\s+/g, " ").trim();
  if (!normalized) return value;

  const withSeparatorSpacing = normalized.replace(
    /([\/\\\-_,.;:$()])/g,
    " $1 ",
  );

  return withSeparatorSpacing
    .split(" ")
    .filter(Boolean)
    .map((token) => {
      if (token.length <= 6) return token;
      const chunks = token.match(/.{1,6}/g);
      return chunks ? chunks.join("\n") : token;
    })
    .join(" ");
}

const WIDE_COLUMN_KEYS = new Set(["full_name", "branch_name"]);

export function colStyle(key: string) {
  if (key === "inss_number") return styles.tableColInss;
  if (WIDE_COLUMN_KEYS.has(key)) return styles.tableColWide;
  return styles.tableCol;
}

export const LEGAL_LANDSCAPE_SIZE: [number, number] = [1008, 612];

export const styles = StyleSheet.create({
  page: {
    padding: 20,
    paddingBottom: 28,
    fontSize: 9,
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
  title: { fontSize: 14, fontWeight: "bold", marginBottom: 5 },
  subtitle: { fontSize: 10, color: "#555" },

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

  areaHeaderRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#b8d4f0",
    paddingVertical: 4,
    paddingHorizontal: 6,
    marginTop: 4,
  },
  areaHeaderText: {
    color: "#1e3a5f",
    fontSize: 7,
    fontWeight: "bold",
    textTransform: "uppercase",
  },

  areaTotalsRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "stretch",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderLeftWidth: 1,
    backgroundColor: "#e8f0fe",
  },
  areaTotalsLabelCell: {
    margin: 0,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 3,
    paddingRight: 3,
    width: "100%",
    fontSize: 6,
    fontWeight: "bold",
    color: "#1e3a5f",
    lineHeight: 1.2,
  },
  areaTotalsCell: {
    margin: 0,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 3,
    paddingRight: 3,
    width: "100%",
    fontSize: 6,
    fontWeight: "bold",
    color: "#1e3a5f",
    lineHeight: 1.2,
  },

  globalTotalsRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "stretch",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderLeftWidth: 1,
    backgroundColor: "#b8d4f0",
    marginTop: 6,
  },
  globalTotalsCell: {
    margin: 0,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 3,
    paddingRight: 3,
    width: "100%",
    fontSize: 6,
    fontWeight: "bold",
    color: "#1e3a5f",
    lineHeight: 1.2,
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
  tableColWide: {
    flexGrow: 2,
    flexShrink: 1,
    flexBasis: 0,
    minWidth: 0,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColInss: {
    flexGrow: 1.2,
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
    padding: 3,
    width: "100%",
    fontSize: 7,
    fontWeight: "bold",
  },
  tableCell: {
    margin: 0,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 3,
    paddingRight: 3,
    width: "100%",
    fontSize: 5.7,
    lineHeight: 1.2,
  },
  tableCellInss: {
    margin: 0,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 2,
    paddingRight: 2,
    width: "100%",
    textAlign: "center",
    fontSize: 6,
  },

  signaturesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 40,
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
