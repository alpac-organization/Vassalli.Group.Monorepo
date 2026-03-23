import { ReactNode } from "react";

export type ModalVariant = "default" | "error" | "warning" | "success" | "info";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: ModalVariant;
  children: ReactNode;
}

export type ModalVariantConfig = {
  icon?: {
    Icon: ReactNode;
    label: string;
  };
  bgClass: string;
  textClass: string;
};
