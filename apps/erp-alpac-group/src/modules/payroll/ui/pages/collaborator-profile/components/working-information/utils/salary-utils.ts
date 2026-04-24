import { SalaryTypeEnum } from "@app/modules/payroll/domain/enums/salary-enums/salary-type.enum";

type SalaryTypeSource = string | number | null;

/**
 * se Encuentra el objeto { value, label } del tipo de salario sin importar la entrada.
 */
function getSalaryTypeObj(raw: SalaryTypeSource) {
  if (raw == null || raw === "") return null;

  const s = String(raw).trim().toUpperCase();

  for (const [key, obj] of Object.entries(SalaryTypeEnum)) {
    if (key === s || obj.label.toUpperCase() === s) {
      return obj;
    }
  }

  return null;
}

/** * PARA LA UI: Transforma la data cruda ("Variable", "FIXED", 1) a un texto legible y estándar.
 */
export function salaryTypeRawToLabel(raw: SalaryTypeSource): string {
  const match = getSalaryTypeObj(raw);
  return match ? match.label : String(raw ?? "");
}

// export function salaryTypeLabelToApiValue(label: string): number | undefined {
//   const match = getSalaryTypeObj(label);
//   return match ? match.value : undefined;
// }
