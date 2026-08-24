import { Dropdown } from "@alpac/design-system";
import { Controller, type FieldValues } from "react-hook-form";
import type { StatusFilterDropdownProps } from "@app/shared/components/filters/status-filter-dropdown/filter-dropdown.types";

export function StatusFilterDropdown<T extends FieldValues>({
  control,
  name = "filterStatus" as StatusFilterDropdownProps<T>["name"],
  options,
  inputClassName,
  labelClassName,
  label = "Estado",
  placeholder = "Seleccionar estado",
}: StatusFilterDropdownProps<T>) {
  return (
    <div className="flex flex-col min-w-0">
      <Controller
        name={name!}
        control={control}
        render={({ field }) => (
          <Dropdown
            appearance="dark"
            label={label}
            placeholder={placeholder}
            options={options}
            value={field.value || undefined}
            onChange={(value) => field.onChange(String(value ?? ""))}
            labelClassName={labelClassName}
            valueClassName={labelClassName}
            className={`${inputClassName} h-[42px]! sm:h-[46px]!`}
          />
        )}
      />
    </div>
  );
}
