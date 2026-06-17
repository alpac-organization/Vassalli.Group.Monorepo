import type { PermissionResponse } from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/permission-history-response";
export interface GetApplicationsResponse extends PermissionResponse {}

export interface GetApplicationListResponse {
  data: GetApplicationsResponse[];
  page_number: number;
  page_size: number;
  total: number;
}
