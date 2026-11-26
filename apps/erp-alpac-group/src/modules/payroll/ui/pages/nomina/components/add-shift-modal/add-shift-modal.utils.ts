import type {
  AddShiftDateColumn,
  ShiftValue,
} from "./add-shift-modal.types";

const WEEKDAYS_SHORT = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];
const MONTHS_SHORT = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

const parseDateOnly = (value?: string): Date | null => {
  if (!value) return null;

  const dateOnly = value.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) return null;

  const date = new Date(`${dateOnly}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const pad = (value: number) => `${value}`.padStart(2, "0");

export const getShiftStorageKey = (collaboratorId: string, dateKey: string) =>
  `${collaboratorId}::${dateKey}`;

export const getExtraHours = (value: ShiftValue): number | null => {
  if (typeof value !== "string" || !value.startsWith("E")) return null;
  const hours = Number(value.slice(1));
  return Number.isInteger(hours) && hours > 0 ? hours : null;
};

export const isExtraShiftValue = (value: ShiftValue): boolean =>
  getExtraHours(value) !== null;

export const getShiftValueLabel = (value: ShiftValue): string => {
  if (value === "TE") return "TE (tiempo extra)";
  if (value === "Vac") return "Vacaciones";
  const extraHours = getExtraHours(value);
  if (extraHours !== null) return `Extra de ${extraHours} horas`;
  return "Turno de 24 horas";
};

export const getTeHours = (teCount: number): number => teCount * 11;

export const isValidPreviousShiftHours = (value: string): boolean => {
  const trimmed = value.trim();
  return trimmed === "" || /^-?\d+(\.\d{1,2})?$/.test(trimmed);
};

export const parsePreviousShiftHours = (value?: string): number => {
  if (!value) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const formatDateLabel = (value?: string): string => {
  const date = parseDateOnly(value);
  if (!date) return "—";

  return `${pad(date.getDate())} ${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`;
};

export const getContractTypeLabel = (payrollType?: string | null): string => {
  switch (payrollType) {
    case "Ordinary":
      return "Ordinaria";
    case "Provided":
    case "Prestacionado":
      return "Prestacionado";
    case "ProfessionalServices":
      return "Servicios profesionales";
    default:
      return "—";
  }
};

export const buildDateColumns = (
  startDate?: string,
  endDate?: string,
): AddShiftDateColumn[] => {
  const start = parseDateOnly(startDate);
  const end = parseDateOnly(endDate);

  if (!start || !end || end.getTime() < start.getTime()) return [];

  const columns: AddShiftDateColumn[] = [];
  const cursor = new Date(start);

  while (cursor.getTime() <= end.getTime() && columns.length < 31) {
    const weekday = WEEKDAYS_SHORT[cursor.getDay()];
    const day = pad(cursor.getDate());
    const year = cursor.getFullYear();
    const monthNumber = pad(cursor.getMonth() + 1);

    columns.push({
      key: `${year}-${monthNumber}-${day}`,
      weekday,
      day,
      fullLabel: `${weekday} ${day}`,
      month: MONTHS_SHORT[cursor.getMonth()],
    });

    cursor.setDate(cursor.getDate() + 1);
  }

  return columns;
};
