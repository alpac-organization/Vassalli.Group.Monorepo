import type { LucideIcon } from "lucide-react";
import type { ReactElement } from "react";

export interface ButtonRoundedProps {
   label?: string;
   iconSize?: number;
   hasIcon?: boolean;
   icon?: LucideIcon | ReactElement;
   onClick?: () => void;
   className?: string;
}