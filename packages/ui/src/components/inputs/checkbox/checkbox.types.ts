import type { InputHTMLAttributes } from "react";

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
   label?: string;
   labelPosition?: "left" | "right";
   labelClassName?: string;
   className?: string;
}
