import type { PermissionResponse } from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/permission-history-response";
export type PermissionTableProps = {
  data: PermissionResponse[];
  pagination?: React.ReactNode;
  onViewDetails?: (item: PermissionResponse) => void;
  onGenerateDocument?: (item: PermissionResponse) => void;
  onCancelRequest?: (item: PermissionResponse) => void;
};
