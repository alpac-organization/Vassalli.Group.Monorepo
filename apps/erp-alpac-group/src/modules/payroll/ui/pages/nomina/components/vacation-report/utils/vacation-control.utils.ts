import type { PermissionServices } from "@app/modules/payroll/infrastructure/services/permission-services/PermissionServices";
import type { GetPayrollReportsVacationAccrualResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-reports";
import type { PermissionResponse } from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/permission-history-response";
import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import type { PermissionType } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/create-permission-request";
import type { VacationControlCollaboratorPage } from "@app/modules/payroll/ui/pages/nomina/components/vacation-report/types/vacation-control.types";
import { PERMISSION_TYPE_LABEL } from "@app/modules/payroll/ui/pages/permissions/constants/permission-filters.constants";
import { getPermissionStatusUiLabel } from "@app/modules/payroll/ui/pages/permissions/constants/vacation-status.constants";
import { formatTimeOrDash } from "@app/modules/payroll/ui/pages/control-vacations/components/control-vacation-details/utils/validate.details-content";
import { formatDate } from "@app/shared/utils/string.utils";

const DEFAULT_PAGE_SIZE = 10;
const PERMISSION_TABLE_DASH = "—";

export function hasPermissionTimeRange(
  permission: PermissionResponse,
): boolean {
  const hasStartTime =
    typeof permission.start_time === "string" &&
    permission.start_time.trim().length > 0;
  const hasEndTime =
    typeof permission.end_time === "string" &&
    permission.end_time.trim().length > 0;
  return hasStartTime && hasEndTime;
}

const REPORT_PERMISSION_TYPES = new Set<PermissionType>([
  "Vacation",
  "MedicalAppointment",
]);

export function filterReportPermissions(
  permissions: PermissionResponse[],
): PermissionResponse[] {
  return permissions.filter((permission) =>
    REPORT_PERMISSION_TYPES.has(permission.type),
  );
}

export async function fetchAllPermissionsByPayroll(
  permissionServices: PermissionServices,
  params: {
    companie_id: string;
    module_code: string;
    payroll_id: string;
  },
): Promise<PermissionResponse[]> {
  const firstPage = await permissionServices.getPermissions({
    ...params,
    page_number: 1,
    page_size: DEFAULT_PAGE_SIZE,
  });

  const total = firstPage.total ?? firstPage.data.length;
  if (total <= firstPage.data.length) {
    return firstPage.data;
  }

  const allPermissions = [...firstPage.data];
  const totalPages = Math.ceil(total / DEFAULT_PAGE_SIZE);

  for (let page = 2; page <= totalPages; page += 1) {
    const response = await permissionServices.getPermissions({
      ...params,
      page_number: page,
      page_size: DEFAULT_PAGE_SIZE,
    });
    allPermissions.push(...response.data);
  }

  return allPermissions;
}

function matchesCollaborator(
  permission: PermissionResponse,
  collaboratorCode: string,
): boolean {
  const permissionCode = permission.collaborator_code?.trim();
  return !!permissionCode && permissionCode === collaboratorCode;
}

export function buildVacationControlPages(
  payrollItems: PayrollItemResponse[],
  accrualData: GetPayrollReportsVacationAccrualResponse[],
  permissions: PermissionResponse[],
): VacationControlCollaboratorPage[] {
  const accrualByCode = new Map<
    string,
    GetPayrollReportsVacationAccrualResponse
  >();
  for (const item of accrualData) {
    const code = item.collaborator_code?.trim();
    if (code) accrualByCode.set(code, item);
  }

  const reportPermissions = filterReportPermissions(permissions);

  return payrollItems
    .filter((item) => item.collaborator)
    .map((item) => {
      const collaborator = item.collaborator!;
      const code = collaborator.collaborator_code?.trim() ?? "";
      const accrual = accrualByCode.get(code);

      const collaboratorPermissions = reportPermissions.filter((permission) =>
        matchesCollaborator(permission, code),
      );

      return {
        collaborator_code: code || "—",
        collaborator_fullname: collaborator.full_name?.trim() || "—",
        beginning_balance: accrual?.beginning_balance ?? null,
        final_balance: accrual?.final_balance ?? null,
        permissions: collaboratorPermissions,
      };
    });
}

export function formatBalanceValue(value: number | null): string {
  if (value == null) return "—";
  return String(value);
}

export function formatPermissionPeriod(
  startDate: string,
  endDate: string,
): string {
  const start = formatDate(startDate) || "—";
  const end = formatDate(endDate) || "—";
  if (start === "—" && end === "—") return "—";
  if (start === end) return start;
  return `${start} — ${end}`;
}

export function formatPermissionDays(amountDays?: number): string {
  if (amountDays == null) return PERMISSION_TABLE_DASH;
  return `${amountDays} ${amountDays === 1 ? "día" : "días"}`;
}

export function formatPermissionStartTime(
  permission: PermissionResponse,
): string {
  if (!hasPermissionTimeRange(permission)) return PERMISSION_TABLE_DASH;
  return formatTimeOrDash(permission.start_time);
}

export function formatPermissionEndTime(
  permission: PermissionResponse,
): string {
  if (!hasPermissionTimeRange(permission)) return PERMISSION_TABLE_DASH;
  return formatTimeOrDash(permission.end_time);
}

export function formatPermissionDaysForTable(
  permission: PermissionResponse,
): string {
  if (hasPermissionTimeRange(permission)) return PERMISSION_TABLE_DASH;
  return formatPermissionDays(permission.amount_days);
}

export function formatPermissionType(type: PermissionType): string {
  return PERMISSION_TYPE_LABEL[type] ?? type;
}

export function formatPermissionStatus(
  status: PermissionResponse["status"],
): string {
  return getPermissionStatusUiLabel(status);
}
