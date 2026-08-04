import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type AccordionType = "single" | "multiple";

export type AccordionProps = {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  icon?: LucideIcon;
};
