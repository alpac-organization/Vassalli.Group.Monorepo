import type { ReactNode } from "react";
import { ButtonProps, ButtonSize } from "../../buttons";

export type ContextMenuItem = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  separator?: boolean;
};

export type ContextMenuProps = {
  items: ContextMenuItem[];
  triggerLabel?: string;
  triggerClassName?: string;
  triggerIcon?: ReactNode;
  triggerButtonSize?: ButtonSize;
  openUpOnMobile?: boolean;
};

export type MenuPosition = {
  top: number;
  left: number;
  openUp: boolean;
};
