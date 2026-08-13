import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

export type AccordionItemProps = {
  value: string;
  title: ReactNode;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  icon?: LucideIcon;
  isOpen?: boolean;
};
