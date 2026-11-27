import type { ChildSupportDetailDto } from "@app/modules/payroll/domain/ApiContract/Responses/deduction-responses/get-deduction-details.response";

export type ChildSupportConceptKey =
  | "deduct_from_salary"
  | "deduct_from_overtime"
  | "deduct_from_christmas_bonus"
  | "deduct_from_liquidation";

export const CHILD_SUPPORT_CONCEPT_FIELDS: ReadonlyArray<{
  key: ChildSupportConceptKey;
  label: string;
}> = [
  { key: "deduct_from_salary", label: "Salario" },
  { key: "deduct_from_overtime", label: "Horas Extras" },
  { key: "deduct_from_christmas_bonus", label: "Aguinaldo" },
  { key: "deduct_from_liquidation", label: "Liquidación" },
];

export const DATE_PICKER_MODAL_SLOT_PROPS = {
  popper: {
    disablePortal: false,
    sx: { zIndex: 2000 },
  },
} as const;

export function parseDecimalInput(value: unknown): number | undefined {
  const raw = typeof value === "string" ? value : String(value ?? "");
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  const parsed = Number.parseFloat(trimmed.replace(/,/g, ""));
  return Number.isNaN(parsed) ? undefined : parsed;
}

export function validateChildSupportPercentage(
  value: number | null | undefined,
  required: boolean,
): true | string {
  if (!required) return true;
  if (value === undefined || value === null || Number.isNaN(value)) {
    return "El porcentaje es obligatorio";
  }
  if (value <= 0 || value > 60) {
    return "El porcentaje debe ser mayor a 0 y no exceder 60%";
  }
  return true;
}

export function validateChildSupportFixedAmount(
  value: number | null | undefined,
  required: boolean,
): true | string {
  if (!required) return true;
  if (value === undefined || value === null || Number.isNaN(value) || value <= 0) {
    return "El monto fijo debe ser mayor a 0";
  }
  return true;
}

export function hasAnyChildSupportConcept(
  flags: Partial<Record<ChildSupportConceptKey, boolean>> | undefined,
): boolean {
  if (!flags) return false;
  return CHILD_SUPPORT_CONCEPT_FIELDS.some((concept) => Boolean(flags[concept.key]));
}

export function getActiveChildSupportConceptLabels(
  detail: ChildSupportDetailDto,
): string[] {
  return CHILD_SUPPORT_CONCEPT_FIELDS.filter((concept) => detail[concept.key]).map(
    (concept) => concept.label,
  );
}

export function isDeductionInProgress(status?: string | number): boolean {
  return status === "Progress" || Number(status) === 1;
}
