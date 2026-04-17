import { forwardRef, useId } from "react";
import type { RadioButtonProps } from "./radio-button.types";

export const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
   ({ className, label, labelPosition = "right", labelClassName, id: idProp, ...props }, ref) => {

      const generatedId = useId();
      const inputId = idProp ?? generatedId;

      const isLabelLeft = labelPosition === "left";

      return (
         <label
            htmlFor={inputId}
            className={`group inline-flex items-center gap-2 cursor-pointer select-none
               ${isLabelLeft ? "flex-row-reverse" : "flex-row"}
               ${className ?? ""}
            `}
         >
            {/* Input nativo oculto — accesible para teclado y form */}
            <input
               ref={ref}
               type="radio"
               id={inputId}
               className="sr-only"
               {...props}
            />

            {/* Círculo visual — usa group-has-[:checked] para leer el input desde cualquier nivel */}
            <div className={`
               w-[18px] h-[18px] shrink-0 rounded-full border transition-all duration-150
               border-slate-300 dark:border-slate-500
               bg-white dark:bg-transparent
               flex items-center justify-center
               group-has-checked:border-blue-500 dark:group-has-checked:border-blue-400
               group-has-focus-visible:ring-2 group-has-checked:border-2 group-has-focus-visible:ring-blue-500/40
               group-has-disabled:opacity-50 group-has-disabled:cursor-not-allowed
            `}>
               {/* Dot interior — oculto hasta que el radio esté checked */}
               <div className={`
                  w-[8px] h-[8px] rounded-full transition-all duration-150
                  bg-blue-500 dark:bg-blue-400
                  scale-0 group-has-checked:scale-100
               `} />
            </div>

            {/* Label */}
            {label && (
               <span className={`
                  text-[14px] font-medium leading-none
                  text-slate-700 dark:text-slate-300
                  group-has-disabled:opacity-50
                  ${labelClassName ?? ""}
               `}>
                  {label}
               </span>
            )}
         </label>
      );
   }
);

RadioButton.displayName = "RadioButton";

