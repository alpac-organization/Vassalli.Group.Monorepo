import * as XLSX from "xlsx";
import type { CreateIncomeOvertimeRequest } from "@app/modules/payroll/domain/ApiContract/Requests/incomes-requests/create-income.request";
import {
  cellToTrimmedString,
  excelFirstDataRowIndex,
  EXCEL_NO_VALID_ROWS_MESSAGE,
  parseColumnAEmployeeId,
} from "@app/modules/payroll/ui/pages/nomina/components/deductions/utils/excel-employee-id.utils";

export type OvertimeViolation = {
  sheetRow: number;
  identification_number: string;
  rawDisplay: string;
  reason: string;
};

export type ParseOvertimeIncomeExcelResult =
  | { ok: true; rows: CreateIncomeOvertimeRequest[] }
  | { ok: false; error: string; violations: OvertimeViolation[] };

const DECIMAL_CHECK_EPS = 1e-3;

export function isTotalHoursBusinessValid(n: number): boolean {
  if (!Number.isFinite(n)) return false;
  if (n < 0) return false;
  const scaled = n * 100;
  const rounded = Math.round(scaled);
  return Math.abs(scaled - rounded) < DECIMAL_CHECK_EPS;
}

function reasonForInvalidHours(n: number): string {
  if (!Number.isFinite(n)) return "valor no numérico válido";
  if (n < 0) return "valor negativo";
  return "más de 2 decimales";
}

function isDashOrEmpty(s: string): boolean {
  if (s === "") return true;
  const t = s.trim();
  if (t === "") return true;
  return (
    t === "-" ||
    t === "—" ||
    t === "–" ||
    t === "N/A" ||
    t.toLowerCase() === "n/a"
  );
}

function parseThirdColumnToRawNumber(cell: unknown): number | "empty" {
  if (cell == null || cell === "") return "empty";
  if (typeof cell === "number") {
    if (!Number.isFinite(cell)) return "empty";
    return cell;
  }
  const s = String(cell).trim();
  if (isDashOrEmpty(s)) return "empty";
  const n = Number(s.replace(",", "."));
  if (!Number.isFinite(n)) return "empty";
  return n;
}

export function parseOvertimeIncomeExcel(
  buffer: ArrayBuffer,
): ParseOvertimeIncomeExcelResult {
  let workbook: XLSX.WorkBook;
  try {
    workbook = XLSX.read(buffer, { type: "array" });
  } catch {
    return {
      ok: false,
      error: "No se pudo leer el archivo Excel.",
      violations: [],
    };
  }

  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    return {
      ok: false,
      error: "El archivo no contiene hojas.",
      violations: [],
    };
  }

  const sheet = workbook.Sheets[sheetName];
  const matrix = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    defval: "",
    raw: true,
  }) as unknown[][];

  const startRow = excelFirstDataRowIndex(matrix);
  const rows: CreateIncomeOvertimeRequest[] = [];
  const violations: OvertimeViolation[] = [];

  for (let i = startRow; i < matrix.length; i++) {
    const sheetRow = i + 1;
    const line = matrix[i] ?? [];
    const id = parseColumnAEmployeeId(line[0]);
    if (id === null) continue;

    const third = line[2];
    const rawParsed = parseThirdColumnToRawNumber(third);
    const rawDisplay = cellToTrimmedString(third) || "(vacío)";

    const total_Hours = rawParsed === "empty" ? 0 : rawParsed;

    if (!isTotalHoursBusinessValid(total_Hours)) {
      violations.push({
        sheetRow,
        identification_number: id,
        rawDisplay,
        reason: reasonForInvalidHours(total_Hours),
      });
      continue;
    }

    rows.push({
      identification_number: id,
      amount_hours: total_Hours,
    });
  }

  if (violations.length > 0) {
    return {
      ok: false,
      error: formatOvertimeViolationsMessage(),
      violations,
    };
  }

  if (rows.length === 0) {
    return {
      ok: false,
      error: EXCEL_NO_VALID_ROWS_MESSAGE,
      violations: [],
    };
  }

  return { ok: true, rows };
}

export function formatOvertimeViolationsMessage(): string {
  const messageError =
    "El archivo contiene montos que no cumplen las reglas , verifique que cumpla lo siguiente: (0 o mayor, sin negativos)";
  return messageError;
}

export function validateOvertimeIncomePayload(
  rows: CreateIncomeOvertimeRequest[] | undefined,
): ParseOvertimeIncomeExcelResult {
  if (!rows?.length) {
    return {
      ok: false,
      error: "No hay datos de horas extra para enviar.",
      violations: [],
    };
  }

  const violations: OvertimeViolation[] = [];
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const n = r.amount_hours;
    if (!isTotalHoursBusinessValid(n)) {
      violations.push({
        sheetRow: i + 1,
        identification_number: r.identification_number,
        rawDisplay: String(n),
        reason: reasonForInvalidHours(n),
      });
    }
  }

  if (violations.length > 0) {
    return {
      ok: false,
      error: formatOvertimeViolationsMessage(),
      violations,
    };
  }

  return { ok: true, rows };
}
