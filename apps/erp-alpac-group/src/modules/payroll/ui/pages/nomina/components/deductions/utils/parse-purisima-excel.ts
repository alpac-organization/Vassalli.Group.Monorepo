import * as XLSX from "xlsx";
import type { PurisimaPayload } from "@app/modules/payroll/domain/ApiContract/Requests/deduction-requests/create-deduction.request";
import {
  cellToTrimmedString,
  excelFirstDataRowIndex,
  EXCEL_NO_VALID_ROWS_MESSAGE,
  parseColumnAEmployeeId,
} from "@app/modules/payroll/ui/pages/nomina/components/deductions/utils/excel-employee-id.utils";

export type PurisimaViolation = {
  sheetRow: number;
  identification_number: string;
  rawDisplay: string;
  reason: string;
};

export type ParsePurisimaExcelResult =
  | { ok: true; rows: PurisimaPayload[] }
  | { ok: false; error: string; violations: PurisimaViolation[] };

const DECIMAL_CHECK_EPS = 1e-3;

export function isPurisimaAmountValid(n: number): boolean {
  if (!Number.isFinite(n)) return false;
  if (n < 0) return false;
  const scaled = n * 100;
  const rounded = Math.round(scaled);
  return Math.abs(scaled - rounded) < DECIMAL_CHECK_EPS;
}

function reasonForInvalidAmount(n: number): string {
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

function parseColumnToRawNumber(cell: unknown): number | "empty" {
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

export function formatPurisimaViolationsMessage(): string {
  const messageError =
    "El archivo contiene montos que no cumplen las reglas (0 o mayor, sin negativos)";
  return messageError;
}

export function parsePurisimaExcel(buffer: ArrayBuffer): ParsePurisimaExcelResult {

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
  const rows: PurisimaPayload[] = [];
  const violations: PurisimaViolation[] = [];

  for (let i = startRow; i < matrix.length; i++) {

    const sheetRow = i + 1;
    const line = matrix[i] ?? [];
    const id = parseColumnAEmployeeId(line[0]);

    if (id === null) continue;

    const third = line[2];
    const rawParsed = parseColumnToRawNumber(third);
    const rawDisplay = cellToTrimmedString(third) || "(vacío)";

    const cellThree = line[3];
    const parseCellThree = parseColumnToRawNumber(cellThree);

    const amount = rawParsed === "empty" ? 0 : rawParsed;

    if (!isPurisimaAmountValid(amount)) {
      violations.push({
        sheetRow,
        identification_number: id,
        rawDisplay,
        reason: reasonForInvalidAmount(amount),
      });
      continue;
    }

    rows.push({
      identification_number: id, amount,
      number_fortnights: Number(parseCellThree) ?? 0
    });
  }

  if (violations.length > 0) {
    return {
      ok: false,
      error: formatPurisimaViolationsMessage(),
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

export function mapPurisimaDeductionError(description?: string, isExcelImportMethod?: boolean): string {

  if (!description?.trim()) {
    return "No se pudieron registrar las contribuciones de purísima. Intente de nuevo.";
  }

  if (/colaborador/i.test(description) && isExcelImportMethod) {
    return "Uno o más ID del archivo no están registrados en esta nómina. Revise los números de identificación en el Excel.";
  }

  return description;
}

export function validatePurisimaPayload(
  rows: PurisimaPayload[] | undefined,
): ParsePurisimaExcelResult {
  if (!rows?.length) {
    return {
      ok: false,
      error:
        "Debe adjuntar un archivo de purísima con al menos un registro válido.",
      violations: [],
    };
  }

  const violations: PurisimaViolation[] = [];
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const n = r.amount;
    if (!isPurisimaAmountValid(n)) {
      violations.push({
        sheetRow: i + 1,
        identification_number: r.identification_number,
        rawDisplay: String(n),
        reason: reasonForInvalidAmount(n),
      });
    }
  }

  if (violations.length > 0) {
    return {
      ok: false,
      error: formatPurisimaViolationsMessage(),
      violations,
    };
  }

  return { ok: true, rows };
}
