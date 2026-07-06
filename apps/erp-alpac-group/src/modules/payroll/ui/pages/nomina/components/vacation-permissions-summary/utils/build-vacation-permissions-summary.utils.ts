import type { PermissionServices } from "@app/modules/payroll/infrastructure/services/permission-services/PermissionServices";
import type { PermissionResponse } from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/permission-history-response";
import type {
  VacationPermissionsSummaryHeader,
  VacationPermissionsSummaryRow,
} from "@app/modules/payroll/ui/pages/nomina/components/vacation-permissions-summary/types/vacation-permissions-summary.types";
import { formatDate } from "@app/shared/utils/string.utils";

const DEFAULT_PAGE_SIZE = 10;
const PAYROLL_FIRST_PERIOD_END_DAY = 15;
const PAYROLL_SECOND_PERIOD_START_DAY = 16;
const MOVEMENT_TYPE = "Salida";

function parseUtcDateParts(dateString: string): {
  year: number;
  month: number;
  day: number;
} | null {
  const parts = dateString.trim().split("-");
  if (parts.length !== 3) return null;

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    return null;
  }

  return { year, month, day };
}

export function calcVacationDays(startDate: string, endDate: string): number {
  const startParts = parseUtcDateParts(startDate);
  const endParts = parseUtcDateParts(endDate);

  if (!startParts || !endParts) return 0;

  const start = Date.UTC(startParts.year, startParts.month - 1, startParts.day);
  const end = Date.UTC(endParts.year, endParts.month - 1, endParts.day);
  const msPerDay = 24 * 60 * 60 * 1000;
  const diff = Math.round((end - start) / msPerDay);

  return diff + 1;
}

function capitalizeFirst(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function buildQuincenaObservationLabel(
  startDate?: string,
  endDate?: string,
): string {
  const referenceDate = endDate?.trim() || startDate?.trim() || "";
  const parts = parseUtcDateParts(referenceDate);

  if (!parts) return "Quincena";

  const monthLabel = capitalizeFirst(
    new Date(
      Date.UTC(parts.year, parts.month - 1, parts.day),
    ).toLocaleDateString("es-NI", { month: "long", timeZone: "UTC" }),
  );

  const endDay = endDate ? new Date(endDate).getUTCDate() : null;
  const startDay = startDate ? new Date(startDate).getUTCDate() : null;

  if (endDay === PAYROLL_FIRST_PERIOD_END_DAY) {
    return `1ra Quincena de ${monthLabel} ${parts.year}`;
  }

  if (startDay === PAYROLL_SECOND_PERIOD_START_DAY) {
    return `2da Quincena de ${monthLabel} ${parts.year}`;
  }

  return `Quincena de ${monthLabel} ${parts.year}`;
}

export function buildVacationPermissionsSummaryHeader(
  startDate?: string,
  endDate?: string,
): VacationPermissionsSummaryHeader {
  return {
    date: startDate?.trim() ? formatDate(startDate.trim()) : "—",
    concept: "VACACIONES",
    observation: buildQuincenaObservationLabel(startDate, endDate),
  };
}

function isApprovedVacationPermission(permission: PermissionResponse): boolean {
  return permission.status === "Approved" && permission.type === "Vacation";
}

export async function fetchApprovedVacationPermissionsByPayroll(
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
    status: "Approved",
    type: "Vacation",
  });

  const total = firstPage.total ?? firstPage.data.length;
  const allPermissions = [...firstPage.data];

  if (total > firstPage.data.length) {
    const totalPages = Math.ceil(total / DEFAULT_PAGE_SIZE);

    for (let page = 2; page <= totalPages; page += 1) {
      const response = await permissionServices.getPermissions({
        ...params,
        page_number: page,
        page_size: DEFAULT_PAGE_SIZE,
        status: "Approved",
        type: "Vacation",
      });
      allPermissions.push(...response.data);
    }
  }

  return allPermissions.filter(isApprovedVacationPermission);
}

export function buildVacationPermissionsSummaryRows(
  permissions: PermissionResponse[],
): VacationPermissionsSummaryRow[] {
  return permissions.map((permission, index) => ({
    item: index + 1,
    collaboratorCode: permission.collaborator_code?.trim() || "—",
    employeeName: permission.requested_by?.trim() || "—",
    startDate: formatDate(permission.start_date) || "—",
    endDate: formatDate(permission.end_date) || "—",
    days: calcVacationDays(permission.start_date, permission.end_date),
    type: MOVEMENT_TYPE,
  }));
}

export function formatVacationDaysValue(days: number): string {
  return days.toFixed(2);
}
