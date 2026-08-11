import { InputText } from "@alpac/design-system";
import {
  isValueMissing,
  missingDataInInputClassName,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/utils/field-missing";
import { baseInputClasses } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/variants/global-variants";

export function ReadOnlyField({
  label,
  value,
  missingMessage,
}: {
  label: string;
  value: string;
  missingMessage: string;
}) {
  const missing = isValueMissing(value);

  return (
    <InputText
      label={label}
      labelClassName="text-[13px]! sm:text-[14px]! font-medium! text-white! ml-0.5!"
      disabled
      editable={false}
      value={missing ? missingMessage : value}
      className={`${baseInputClasses} ${
        missing
          ? missingDataInInputClassName
          : "text-slate-800 dark:text-white!"
      }`}
    />
  );
}
