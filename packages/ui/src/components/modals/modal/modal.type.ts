import { ReactNode } from "react";
export type ModalVariant = "default" | "error" | "warning" | "success" | "info";
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: ModalVariant;
  title?: string;
  description?: string | ReactNode;
  children?: ReactNode;
  panelClassName?: string;
}
export type ModalVariantConfig = {
  icon?: {
    Icon: ReactNode;
    label: string;
  };
  bgClass: string;
  textClass: string;
  borderClass: string;
  iconTextClass: string;
};
