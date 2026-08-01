import type { ReactNode } from "react";

export interface Option {
  label: string;
  value: string | number;
}

export type DropdownAppearance = "default" | "dark";

export interface DropdownProps {
  label?: string;
  options: Option[];
  placeholder?: string;
  error?: string;
  name?: string;
  onChange?: (value: any) => void;
  value?: any;
  className?: string;
  labelClassName?: string;
  isRequired?: boolean;
  optional?: boolean;
  valueClassName?: string;
  appearance?: DropdownAppearance;
  renderOptionAction?: (option: Option) => ReactNode;
  onEditOption?: (option: Option) => void;
}
