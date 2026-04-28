import type { AdditionalDeductions } from "@app/modules/payroll/ui/pages/nomina/components/payroll-table/types/payroll-table.types";

export const parseAdditionalDeductions = (
  raw?: string,
): AdditionalDeductions | null => {
  if (!raw || raw.trim() === "") return null;

  try {
    const first = JSON.parse(raw);
    if (typeof first === "string") {
      return JSON.parse(first) as AdditionalDeductions;
    }
    return first as AdditionalDeductions;
  } catch {
    return null;
  }
};
