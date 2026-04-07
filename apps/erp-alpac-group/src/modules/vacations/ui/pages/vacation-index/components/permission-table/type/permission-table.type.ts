import type { PermissionHistoryRow } from "@app/modules/vacations/domain/ApiContract/Requests/permission-history-request";
export type PermissionTableProps = {
  data: PermissionHistoryRow[];
  onViewDetails?: (row: PermissionHistoryRow) => void;
  onGenerateDocument?: (row: PermissionHistoryRow) => void;
  onCancelRequest?: (row: PermissionHistoryRow) => void;
};
