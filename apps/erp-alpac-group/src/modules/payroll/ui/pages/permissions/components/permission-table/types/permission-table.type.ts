import type { PermissionHistoryRow } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/permission-history-request";
export type PermissionTableProps = {
  data: PermissionHistoryRow[];
  onViewDetails?: (row: PermissionHistoryRow) => void;
  onGenerateDocument?: (row: PermissionHistoryRow) => void;
  onCancelRequest?: (row: PermissionHistoryRow) => void;
};
