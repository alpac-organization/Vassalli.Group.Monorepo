import { StyleSheet } from "@react-pdf/renderer";
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
  page: { padding: 20, fontSize: 9 },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    width: "100%",
  },
  headerTextContainer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    minWidth: 0,
    paddingRight: 12,
    //
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
  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "stretch",
  },
  tableHeader: {
    backgroundColor: "#f3f4f6",
  },
  tableCol: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    minWidth: 0,
    overflow: "hidden",
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
    overflow: "hidden",
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
    overflow: "hidden",
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
});
