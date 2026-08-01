import type { TextareaHTMLAttributes } from "react";

export interface TextareaProps
   extends TextareaHTMLAttributes<HTMLTextAreaElement> {
   label?: string;
   error?: string;
   labelClassName?: string;
   isRequired?: boolean;
   enableCharacterCount?: boolean;
   maxLength?: number;
}
