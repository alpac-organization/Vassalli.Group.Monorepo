import type { PermissionResponse } from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/permission-history-response";

export type VacationControlCollaboratorPage = {
  collaborator_code: string;
  collaborator_fullname: string;
  beginning_balance: number | null;
  final_balance: number | null;
  permissions: PermissionResponse[];
};

export type VacationControlPdfProps = {
  pages: VacationControlCollaboratorPage[];
  startDate?: string;
  endDate?: string;
};
