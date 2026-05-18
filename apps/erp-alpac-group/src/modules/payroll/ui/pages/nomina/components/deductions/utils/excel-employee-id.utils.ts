const EMPLOYEE_ID_PATTERN = /^[0-9A-Za-z-]{3,}$/;

const EXCEL_HEADER_LABEL =
  /^(id\s*empleado|idempleado|identificaci[oó]n|cedula|c[eé]dula|nombre|valor|horas|id)$/i;

export function cellToTrimmedString(cell: unknown): string {
  if (cell == null) return "";
  if (typeof cell === "number" && Number.isFinite(cell)) {
    return String(cell);
  }
  return String(cell).trim();
}

export function parseColumnAEmployeeId(cell: unknown): string | null {
  const raw = cellToTrimmedString(cell);
  if (!raw) return null;
  if (
    EXCEL_HEADER_LABEL.test(raw) ||
    EXCEL_HEADER_LABEL.test(raw.replace(/\s/g, ""))
  ) {
    return null;
  }
  const normalized = raw.replace(/\s/g, "");
  if (!EMPLOYEE_ID_PATTERN.test(normalized)) return null;
  return normalized;
}

export function excelFirstDataRowIndex(matrix: unknown[][]): number {
  if (matrix.length === 0) return 0;
  const firstCell = matrix[0]?.[0];
  if (parseColumnAEmployeeId(firstCell) !== null) return 0;
  return 1;
}

export const EXCEL_NO_VALID_ROWS_MESSAGE =
  "No se encontraron filas con identificación válida en la columna A. Revise el formato del archivo.";
