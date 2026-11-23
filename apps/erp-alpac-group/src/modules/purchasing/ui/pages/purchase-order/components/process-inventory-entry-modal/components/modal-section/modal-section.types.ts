import type { ReactNode } from "react";

export interface ModalSectionProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  contentClassName?: string;
}
