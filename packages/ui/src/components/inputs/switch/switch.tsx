import { forwardRef, useId } from "react";
import type { SwitchProps } from "./switch.types";

const baseTrackClass =
   "relative inline-block w-[51px] h-[31px] shrink-0 rounded-[31px] cursor-pointer " +
   "bg-[#e9e9ea] dark:bg-slate-600 transition-colors duration-300 " +
   "group-has-focus-visible:outline group-has-focus-visible:outline-2 " +
   "group-has-focus-visible:outline-[#007aff] group-has-focus-visible:outline-offset-2 " +
   "group-has-disabled:opacity-50 group-has-disabled:cursor-not-allowed";

const baseKnobClass =
   "absolute top-[2px] left-[2px] w-[27px] h-[27px] bg-white rounded-full " +
   "shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-transform duration-300 " +
   "group-has-checked:translate-x-[20px]";

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
   (
      {
         className,
         style,
         label,
         labelPosition = "right",
         labelClassName,
         trackClassName,
         trackStyle,
         knobClassName,
         knobStyle,
         inputClassName,
         unstyled = false,
         id: idProp,
         ...props
      },
      ref,
   ) => {
      const generatedId = useId();
      const inputId = idProp ?? generatedId;
      const isLabelLeft = labelPosition === "left";

      const trackClass = trackClassName
         ? trackClassName
         : unstyled
         ? ""
         : baseTrackClass;

      const knobClass = knobClassName
         ? knobClassName
         : unstyled
         ? ""
         : baseKnobClass;

      return (
         <label
            htmlFor={inputId}
            style={style}
            className={`group inline-flex items-center gap-2 cursor-pointer select-none ${
               isLabelLeft ? "flex-row-reverse" : "flex-row"
            } ${className ?? ""}`}
         >
            <input
               ref={ref}
               type="checkbox"
               id={inputId}
               className={`sr-only ${inputClassName ?? ""}`}
               {...props}
            />

            <span
               style={trackStyle}
               className={`${trackClass}`}
            >
               <span
                  style={knobStyle}
                  className={`${knobClass}`}
               />
            </span>

            {label && (
               <span
                  className={`text-[14px] font-medium leading-none text-slate-700 dark:text-slate-300 group-has-disabled:opacity-50 ${
                     labelClassName ?? ""
                  }`}
               >
                  {label}
               </span>
            )}
         </label>
      );
   },
);

Switch.displayName = "Switch";
