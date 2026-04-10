import { LucideIcon } from "lucide-react";

export interface ButtonRoundedProps {
   label?: string;
   iconSize?: number;
   hasIcon?: boolean;
   icon?: LucideIcon;
   onClick?: () => void;
   className?: string;
}