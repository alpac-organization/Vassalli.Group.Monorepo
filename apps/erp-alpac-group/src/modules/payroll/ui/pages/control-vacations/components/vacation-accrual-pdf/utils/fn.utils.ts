import type { VacationAccruals } from "@app/modules/payroll/domain/ApiContract/Responses/control-vacation-responses/get-control-vacations-response";

export const asNumber = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};
export const formatTotal = (value: number): string =>
  asNumber(value).toFixed(2);

export const getAreaName = (item: VacationAccruals): string => {
  const candidate = (item as VacationAccruals & { work_area_name?: string })
    .work_area_name;
  if (candidate && candidate.trim()) return candidate.trim();

  const fromCollaborator = (
    item.collaborator_information as { work_area_name?: string }
  )?.work_area_name;
  if (fromCollaborator && fromCollaborator.trim())
    return fromCollaborator.trim();

  return "SIN AREA";
};

export const getAccumulated = (item: VacationAccruals): number => {
  const explicit = asNumber(
    (item as VacationAccruals & { accrued_vacations?: number })
      .accrued_vacations,
  );
  if (explicit > 0) return explicit;
  return asNumber(item.vacation_balance) + asNumber(item.enjoyed_vacations);
};

export const groupByArea = (
  items: VacationAccruals[],
): Map<string, VacationAccruals[]> => {
  const grouped = new Map<string, VacationAccruals[]>();
  for (const item of items) {
    const area = getAreaName(item);
    const list = grouped.get(area) ?? [];
    list.push(item);
    grouped.set(area, list);
  }
  return grouped;
};
