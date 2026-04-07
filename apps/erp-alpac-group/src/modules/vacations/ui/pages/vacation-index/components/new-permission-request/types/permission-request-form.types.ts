import type { PermissionType } from "@app/modules/vacations/domain/ApiContract/Requests/create-permission-request";

export interface PermissionRequestFormValues {
  type: PermissionType;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  description: string;
}
