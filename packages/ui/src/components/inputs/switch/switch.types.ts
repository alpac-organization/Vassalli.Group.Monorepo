import type { CSSProperties, InputHTMLAttributes } from "react";

export interface SwitchProps extends InputHTMLAttributes<HTMLInputElement> {
   label?: string;
   labelPosition?: "left" | "right";
   labelClassName?: string;

   // Wrapper (label)
   className?: string;
   style?: CSSProperties;

   // Track / slider
   trackClassName?: string;
   trackStyle?: CSSProperties;

   // Knob
   knobClassName?: string;
   knobStyle?: CSSProperties;

   // Input oculto
   inputClassName?: string;

   // Si true, no aplica estilos base (track/knob), solo los del consumidor
   unstyled?: boolean;
}
