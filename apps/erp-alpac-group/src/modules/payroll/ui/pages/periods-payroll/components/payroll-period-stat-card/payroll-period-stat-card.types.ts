import type { LucideIcon } from "lucide-react";

export interface PayrollPeriodStatCardProps {
  icon: LucideIcon;
  iconContainerClassName?: string;
  iconClassName?: string;
  label: string;
  value: string | number;
  subLabel: string;
  className?: string;
}
