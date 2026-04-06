import { SalaryTypeEnum } from "@app/modules/payroll/domain/enums/salary-type.enum";

/** Mapea valor del API al label de `SalaryTypeEnum`. */
export function salaryTypeRawToLabel(
  raw: string | number | undefined | null,
): string {
  if (raw === undefined || raw === null) return "";
  const s = String(raw).trim();
  if (s === "") return "";

  const key = s.toUpperCase() as keyof typeof SalaryTypeEnum;
  if (SalaryTypeEnum[key]) return SalaryTypeEnum[key].label;

  const n = Number(s);
  if (!Number.isNaN(n)) {
    const entry = Object.values(SalaryTypeEnum).find((e) => e.value === n);
    if (entry) return entry.label;
  }

  return s;
}
