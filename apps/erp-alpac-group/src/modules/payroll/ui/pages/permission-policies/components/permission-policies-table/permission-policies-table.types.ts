import type { ReactNode } from "react";
import type { GetPermissionPoliciesResponse } from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/get-permission-policies";

export type PermissionPoliciesTableProps = {
  data: GetPermissionPoliciesResponse[];
  pagination?: ReactNode;
  onUpdate: (row: GetPermissionPoliciesResponse) => void;
  onRequestStatusChange: (row: GetPermissionPoliciesResponse) => void;
};
