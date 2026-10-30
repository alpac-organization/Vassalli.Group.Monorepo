import type { GetPermissionPoliciesResponse } from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/get-permission-policies";

export type PermissionPoliciesTableProps = {
  data: GetPermissionPoliciesResponse[];
  onUpdate: (row: GetPermissionPoliciesResponse) => void;
  onRequestStatusChange: (row: GetPermissionPoliciesResponse) => void;
};
