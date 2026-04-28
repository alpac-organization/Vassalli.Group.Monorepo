import type { PayrollType } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-process.request";
import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import { StyleSheet } from "@react-pdf/renderer";

export type PayrollPdfProps = {
  data: PayrollItemResponse[];
  branchName: string;
  startDate?: string;
  endDate?: string;
  visibleKeys: string[];
  logoSrc?: string;
  typePayroll: PayrollType;
};

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
  tableColCompact: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 0,
    minWidth: 40,
    maxWidth: 112,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    margin: 4,
    fontSize: 7,
    fontWeight: "bold",
  },
  tableCell: {
    margin: 4,
    fontSize: 6,
  },
});
