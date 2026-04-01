import { Controller } from "react-hook-form";
import { InputText } from "@alpac/design-system";
import type { ReadonlyWorkFieldProps } from "@app/modules/payroll/ui/pages/collaborator-profile/types/utils.type";
import {
  isValueMissing,
  missingDataInInputClassName,
} from "@app/modules/payroll/ui/pages/collaborator-profile/utils/field-missing-message";

export const ReadonlyWorkField = ({
  name,
  label,
  missingLabel,
  control,
  readOnlyInputClasses,
  type = "text",
}: ReadonlyWorkFieldProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const missing = isValueMissing(field.value);
        return (
          <InputText
            label={label}
            labelClassName="text-[13px] sm:text-[14px] font-medium ml-0.5 text-white!"
            type={type}
            disabled
            editable={false}
            value={missing ? missingLabel : String(field.value ?? "")}
            onChange={field.onChange}
            onBlur={field.onBlur}
            name={field.name}
            ref={field.ref}
            className={`${readOnlyInputClasses} min-w-0 w-full max-w-full ${missing ? missingDataInInputClassName : ""}`}
          />
        );
      }}
    />
  );
};
