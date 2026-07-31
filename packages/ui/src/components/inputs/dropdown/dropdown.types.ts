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
  /**
   * Marks the field as optional in the UI (shows “opcional” on the label).
   * Edit actions via `renderOptionAction` / `onEditOption` remain opt-in.
   */
  optional?: boolean;
  valueClassName?: string;
  /** Dark panel surface (#272b34); matches dark modals. */
  appearance?: DropdownAppearance;
  /** Renders an action (e.g. pencil) on each option without selecting it. */
  renderOptionAction?: (option: Option) => ReactNode;
  /**
   * When set, shows a pencil on each option to edit that item.
   * Only used if `renderOptionAction` is not provided.
   */
  onEditOption?: (option: Option) => void;
}
