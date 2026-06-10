import type { PermissionHistoryRow } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/permission-request";
export type PermissionTableProps = {
  data: PermissionHistoryRow[];
  pagination?: React.ReactNode;
  onViewDetails?: (row: PermissionHistoryRow) => void;
  onGenerateDocument?: (row: PermissionHistoryRow) => void;
  onCancelRequest?: (row: PermissionHistoryRow) => void;
};
