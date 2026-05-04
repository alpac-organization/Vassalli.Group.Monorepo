import type { PayrollType } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-process.request";
import type {
  GetPayrollPeriodsHistoryResponse,
  PayrollPeriodItem,
} from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-periods";

export function mapPayrollTypeFromApi(type: string): PayrollType {
  const t = type.trim().toLowerCase().replace(/[\s_-]+/g, "");
  if (t === "none") return "None";
  if (t === "ordinary") return "Ordinary";
  if (t === "provided") return "Provided";
  if (t === "professionalservices") return "ProfessionalServices";
  return "None";
}

function mapRowToPayrollPeriodItem(row: unknown): PayrollPeriodItem | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  const payrollId = String(r.payrollId ?? r.payroll_id ?? "");
  const startDate = String(r.startDate ?? r.start_date ?? "");
  const endDate = String(r.endDate ?? r.end_date ?? "");
  const typeRaw = String(r.type ?? "None");
  if (!payrollId || !startDate || !endDate) return null;

  const branchId = r.branchId ?? r.branch_id;
  const branchName = r.branchName ?? r.branch_name;

  return {
    payrollId,
    startDate,
    endDate,
    type: mapPayrollTypeFromApi(typeRaw),
    ...(typeof branchId === "string" && branchId ? { branchId } : {}),
    ...(typeof branchName === "string" && branchName ? { branchName } : {}),
  };
}

function mapItemsList(list: unknown[]): PayrollPeriodItem[] {
  return list
    .map((row) => mapRowToPayrollPeriodItem(row))
    .filter((item): item is PayrollPeriodItem => item !== null);
}

export type PayrollPeriodsHistoryRequestMeta = {
  page_number?: number;
  page_size?: number;
};

export function normalizeGetPayrollPeriodsHistoryResponse(
  raw: unknown,
  requestMeta: PayrollPeriodsHistoryRequestMeta,
): GetPayrollPeriodsHistoryResponse {
  const page_number = requestMeta.page_number ?? 1;
  const page_size = requestMeta.page_size ?? 10;

  if (Array.isArray(raw)) {
    const items = mapItemsList(raw);
    return {
      items,
      total_items: items.length,
      page_size,
      page_number,
    };
  }

  if (raw && typeof raw === "object") {
    const o = raw as Record<string, unknown>;
    const rawList = o.items ?? o.data;
    const list = Array.isArray(rawList) ? rawList : [];
    const items = mapItemsList(list);

    const totalRaw = o.total_items ?? o.totalItems;
    const total_items =
      typeof totalRaw === "number" && Number.isFinite(totalRaw)
        ? totalRaw
        : items.length;

    const pageSizeRaw = o.page_size ?? o.pageSize;
    const resolvedPageSize =
      typeof pageSizeRaw === "number" && Number.isFinite(pageSizeRaw)
        ? pageSizeRaw
        : page_size;

    const pageNumberRaw = o.page_number ?? o.pageNumber;
    const resolvedPageNumber =
      typeof pageNumberRaw === "number" && Number.isFinite(pageNumberRaw)
        ? pageNumberRaw
        : page_number;

    return {
      items,
      total_items,
      page_size: resolvedPageSize,
      page_number: resolvedPageNumber,
    };
  }

  return {
    items: [],
    total_items: 0,
    page_size,
    page_number,
  };
}
