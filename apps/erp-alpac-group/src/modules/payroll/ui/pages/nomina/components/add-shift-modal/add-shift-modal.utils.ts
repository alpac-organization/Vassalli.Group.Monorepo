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

export const getShiftValueLabel = (value: ShiftValue): string => {
  if (value === "TE") return "TE (tiempo extra)";
  if (value === "Vac") return "Vacaciones";
  return `${value} horas`;
};

export const getTeHours = (teCount: number): number => {
  if (teCount <= 0) return 0;
  if (teCount < 3) return 11;
  if (teCount === 3) return 34;
  return 34 + (teCount - 3) * 10;
};

export const formatShiftCount = (value: number): number =>
  Number(value.toFixed(2));

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
