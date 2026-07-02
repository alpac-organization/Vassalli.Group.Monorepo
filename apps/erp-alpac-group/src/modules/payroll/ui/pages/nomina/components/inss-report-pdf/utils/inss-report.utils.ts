import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";

function toIsoDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getLastDayOfMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function resolveInssReportPeriodDates(
  startDate?: string,
  endDate?: string,
  isFortnightly = true,
): { start?: string; end?: string } {
  const start = startDate?.trim();
  const end = endDate?.trim();

  if (!start || !end) return { start, end };
  if (isFortnightly) return { start, end };

  const referenceDate = end || start;
  const parts = referenceDate.split("-");
  if (parts.length !== 3) return { start, end };

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  if (isNaN(year) || isNaN(month)) return { start, end };

  const lastDay = getLastDayOfMonth(year, month);
  return {
    start: toIsoDate(year, month, 1),
    end: toIsoDate(year, month, lastDay),
  };
}

export function buildInssReportPeriodLabel(
  startDate?: string,
  endDate?: string,
  isFortnightly = true,
): string | undefined {
  const { start, end } = resolveInssReportPeriodDates(
    startDate,
    endDate,
    isFortnightly,
  );

  if (!start || !end) return undefined;

  return `Fecha de: ${formatDateToSpanishWords(start)} al ${formatDateToSpanishWords(end)}`;
}
