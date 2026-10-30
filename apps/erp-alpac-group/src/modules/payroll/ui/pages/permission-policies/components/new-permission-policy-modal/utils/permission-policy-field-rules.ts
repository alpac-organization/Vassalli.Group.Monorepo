type FieldValue = string | number | null | undefined;

const MESSAGES = {
  integer: "El valor debe ser un número entero.",
  positive: "El valor debe ser mayor a 0.",
  nonNegative: "El valor debe ser mayor o igual a 0.",
  maxGteMin: "La evidencia máxima debe ser mayor o igual a la mínima",
  familyRelationship: "Seleccione el parentesco familiar",
} as const;

function isEmpty(value: FieldValue): boolean {
  return value === "" || value == null;
}

function toInteger(value: FieldValue): number | null {
  if (isEmpty(value)) return null;

  const parsed = Number(value);
  if (!Number.isInteger(parsed)) return null;

  return parsed;
}

export function validateOptionalPositiveInteger(
  value: FieldValue,
): true | string {
  if (isEmpty(value)) return true;

  const parsed = toInteger(value);
  if (parsed === null) return MESSAGES.integer;
  if (parsed <= 0) return MESSAGES.positive;

  return true;
}

export function validateRequiredInteger(value: FieldValue): true | string {
  if (isEmpty(value) || toInteger(value) === null) {
    return MESSAGES.integer;
  }

  return true;
}

export function validateRequiredPositiveInteger(
  value: FieldValue,
): true | string {
  const parsed = toInteger(value);
  if (parsed === null) return MESSAGES.integer;
  if (parsed <= 0) return MESSAGES.positive;

  return true;
}

export function validateMaxEvidenceCount(
  value: FieldValue,
  minEvidenceCount: FieldValue,
): true | string {
  const max = toInteger(value);
  if (max === null) return MESSAGES.integer;
  if (max < 0) return MESSAGES.nonNegative;

  if (!isEmpty(minEvidenceCount)) {
    const min = toInteger(minEvidenceCount);
    if (min !== null && max < min) return MESSAGES.maxGteMin;
  }

  return true;
}

export function validateFamilyRelationship(
  value: string | null | undefined,
  isFamilyNucleus: boolean,
): true | string {
  if (!isFamilyNucleus) return true;
  if (isEmpty(value) || value === "None") return MESSAGES.familyRelationship;
  return true;
}
