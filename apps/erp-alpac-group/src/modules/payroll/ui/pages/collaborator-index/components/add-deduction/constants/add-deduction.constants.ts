import { type Option } from "@alpac/design-system";
import type { DeductionType } from "@app/modules/payroll/ui/pages/collaborator-index/components/add-deduction/types/add-deduction.types";
type DeductionTypeEntry = {
  value: DeductionType;
  label: string;
};
const DEDUCTIONS_ENTRIES: Array<DeductionTypeEntry> = [
  { value: "Uniformes", label: "Uniformes" },
  { value: "Otras deducciones", label: "Otras deducciones" },
];
export const DEDUCTION_TYPE_OPTIONS: Option[] = DEDUCTIONS_ENTRIES;
