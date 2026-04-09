import { ReactNode } from "react";
export type ModalVariant =
  | "default"
  | "error"
  | "warning"
  | "success"
  | "info"
  | "form";
export type ModalSize =
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl"
  | "8xl"
  | "9xl"
  | "full";
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: ModalVariant;
  size?: ModalSize;
  title?: string;
  description?: string | ReactNode;
  children?: ReactNode;
  /** Extra classes merged onto the dialog panel (e.g. max-width, border). */
  panelClassName?: string;
  /** Overrides the default close button styles (icon color, hover). */
  closeButtonClassName?: string;
}
export type ModalVariantConfig = {
  icon?: {
    Icon: ReactNode;
    label: string;
  };
  bgClass: string;
  textClass: string;
  borderClass?: string;
  iconTextClass: string;
};
