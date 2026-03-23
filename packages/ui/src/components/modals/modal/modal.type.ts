import { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
export type ModalVariant = "default" | "error" | "warning" | "success" | "info";
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: ModalVariant;
  children: ReactNode;
}
export type ModalVariantConfig = {
  icon?: {
    Icon: LucideIcon;
    label: string;
  };
  bgClass: string;
  textClass: string;
};
