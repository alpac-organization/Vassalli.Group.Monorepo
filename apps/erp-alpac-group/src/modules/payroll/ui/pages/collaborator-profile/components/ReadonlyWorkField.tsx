import { InputText } from "@alpac/design-system";
import type { ReadonlyWorkFieldProps } from "@app/modules/payroll/ui/pages/collaborator-profile/types/fields.utils.type";
import {
  isValueMissing,
  missingDataInInputClassName,
} from "@app/modules/payroll/ui/pages/collaborator-profile/utils/field-missing-message";
import { toHtmlDateInputValue } from "@app/modules/payroll/ui/pages/collaborator-profile/utils/date-input";

export const ReadonlyWorkField = ({
  name,
  label,
  missingLabel,
  register,
  watch,
  readOnlyInputClasses,
  type = "text",
}: ReadonlyWorkFieldProps) => {
  const value = watch(name);
  const missing = isValueMissing(value);
  const reg = register(name);

  const displayValue = missing
    ? missingLabel
    : type === "date"
      ? toHtmlDateInputValue(value as string | Date)
      : String(value ?? "");

  return (
    <InputText
      label={label}
      labelClassName="text-[13px] sm:text-[14px] font-medium ml-0.5 text-white!"
      type={type}
      disabled
      editable={false}
      {...reg}
      value={displayValue}
      className={`${readOnlyInputClasses} min-w-0 w-full max-w-full ${missing ? missingDataInInputClassName : ""}`}
    />
  );
};
