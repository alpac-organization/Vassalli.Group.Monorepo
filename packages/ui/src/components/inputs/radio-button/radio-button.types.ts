import type { InputHTMLAttributes } from "react";

export interface RadioButtonProps extends InputHTMLAttributes<HTMLInputElement> {
   label?: string;
   description?: string;
   labelPosition?: "left" | "right";
   labelClassName?: string;
   className?: string;
}
