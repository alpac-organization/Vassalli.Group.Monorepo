import { StyleSheet } from "@react-pdf/renderer";

export const COLUMN_FLEX = {
  item: 0.45,
  collaboratorCode: 1.15,
  employeeName: 1.75,
  startDate: 0.85,
  endDate: 0.85,
  days: 0.55,
  type: 0.6,
} as const;

export type SummaryColumnKey = keyof typeof COLUMN_FLEX;

const baseCell = {
  flexShrink: 1,
  flexBasis: 0,
  minWidth: 0,
  paddingVertical: 5,
  paddingHorizontal: 4,
  borderRightWidth: 1,
  borderRightColor: "#BFBFBF",
  borderRightStyle: "solid" as const,
  justifyContent: "flex-start" as const,
};

export const styles = StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 8,
    fontFamily: "Helvetica",
  },
  headerContainer: {
    position: "relative" as const,
    width: "100%",
    minHeight: 48,
    justifyContent: "center" as const,
    marginBottom: 10,
  },
  logo: {
    position: "absolute" as const,
    left: 0,
    top: 0,
    width: 48,
    height: 48,
    objectFit: "contain" as const,
  },
  companyName: {
    fontSize: 14,
    fontWeight: "bold" as const,
    textAlign: "center" as const,
    width: "100%",
  },
  title: {
    fontSize: 11,
    fontWeight: "bold" as const,
    textAlign: "center" as const,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 9,
    textAlign: "center" as const,
    marginBottom: 12,
    color: "#555555",
  },
  metaSection: {
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: "row" as const,
    marginBottom: 3,
  },
  metaLabel: {
    width: 72,
    fontWeight: "bold" as const,
    fontSize: 9,
  },
  metaValue: {
    flex: 1,
    fontSize: 9,
  },
  table: {
    borderWidth: 1,
    borderColor: "#BFBFBF",
    borderStyle: "solid" as const,
  },
  tableRow: {
    flexDirection: "row" as const,
    borderBottomWidth: 1,
    borderBottomColor: "#BFBFBF",
    borderBottomStyle: "solid" as const,
    alignItems: "stretch" as const,
  },
  headerRow: {
    backgroundColor: "#F3F4F6",
  },
  cellItem: {
    ...baseCell,
    flexGrow: COLUMN_FLEX.item,
    alignItems: "center" as const,
  },
  cellCode: {
    ...baseCell,
    flexGrow: COLUMN_FLEX.collaboratorCode,
  },
  cellName: {
    ...baseCell,
    flexGrow: COLUMN_FLEX.employeeName,
  },
  cellDate: {
    ...baseCell,
    flexGrow: COLUMN_FLEX.startDate,
    alignItems: "center" as const,
  },
  cellEndDate: {
    ...baseCell,
    flexGrow: COLUMN_FLEX.endDate,
    alignItems: "center" as const,
  },
  cellDays: {
    ...baseCell,
    flexGrow: COLUMN_FLEX.days,
    alignItems: "center" as const,
  },
  cellType: {
    ...baseCell,
    flexGrow: COLUMN_FLEX.type,
    alignItems: "center" as const,
    borderRightWidth: 0,
  },
  headerCellItem: {
    ...baseCell,
    flexGrow: COLUMN_FLEX.item,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  headerCellCode: {
    ...baseCell,
    flexGrow: COLUMN_FLEX.collaboratorCode,
    justifyContent: "center" as const,
  },
  headerCellName: {
    ...baseCell,
    flexGrow: COLUMN_FLEX.employeeName,
    justifyContent: "center" as const,
  },
  headerCellDate: {
    ...baseCell,
    flexGrow: COLUMN_FLEX.startDate,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  headerCellEndDate: {
    ...baseCell,
    flexGrow: COLUMN_FLEX.endDate,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  headerCellDays: {
    ...baseCell,
    flexGrow: COLUMN_FLEX.days,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  headerCellType: {
    ...baseCell,
    flexGrow: COLUMN_FLEX.type,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    borderRightWidth: 0,
  },
  cellText: {
    fontSize: 8,
    lineHeight: 1.25,
  },
  cellTextCenter: {
    fontSize: 8,
    lineHeight: 1.25,
    textAlign: "center" as const,
    width: "100%",
  },
  headerText: {
    fontSize: 8,
    fontWeight: "bold" as const,
    lineHeight: 1.2,
    textAlign: "center" as const,
  },
  emptyMessage: {
    textAlign: "center" as const,
    paddingVertical: 16,
    color: "#666666",
    fontSize: 9,
  },
});

export const LANDSCAPE_PAGE_SIZE: [number, number] = [842, 595];
