import type { FieldValues, Control, Path } from "react-hook-form";
import type { Option } from "@alpac/design-system";

export type StatusFilterDropdownProps<T extends FieldValues> = {
  control: Control<T>;
  name?: Path<T>;
  options: Option[];
  inputClassName: string;
  labelClassName: string;
  label?: string;
  placeholder?: string;
};
