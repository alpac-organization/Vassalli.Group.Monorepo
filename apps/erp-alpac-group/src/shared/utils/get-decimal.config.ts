import {
  formatAmount,
  validateDecimalNumber,
  validatePositiveNumber,
} from "@app/shared/utils/number.utils";
import { parseDecimal } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/tramos/lot-modal/utils/lots.utils";

export const getDecimalFieldConfig = (
  requiredMessage: string,
  allowZero: boolean = false,
) => ({
  required: requiredMessage,
  validate: {
    validateDecimal: (value: unknown) =>
      !value || validateDecimalNumber(value as string),
    validatePositive: (value: unknown) =>
      !value || validatePositiveNumber(value as string, allowZero),
  },
  setValueAs: parseDecimal,
  onChange: (evt: React.ChangeEvent<HTMLInputElement>) => {
    evt.target.value = formatAmount(evt.target.value, 10, 2);
  },
});
