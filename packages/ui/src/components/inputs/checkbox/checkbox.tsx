import { forwardRef, useId } from "react";
import type { CheckboxProps } from "./checkbox.types";

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
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
               type="checkbox"
               id={inputId}
               className="sr-only"
               {...props}
            />

            {/* Cuadro visual — usa group-has-[:checked] para leer el input desde cualquier nivel */}
            <div className={`
               w-[18px] h-[18px] shrink-0 rounded-[4px] border transition-all duration-150
               border-slate-300 dark:border-slate-500
               bg-white dark:bg-transparent
               flex items-center justify-center
               group-has-checked:border-blue-500 dark:group-has-checked:border-blue-400
               group-has-checked:bg-blue-500 dark:group-has-checked:bg-blue-400
               group-has-focus-visible:ring-2 group-has-focus-visible:ring-blue-500/40
               group-has-disabled:opacity-50 group-has-disabled:cursor-not-allowed
            `}>
               {/* Check icon interior — oculto hasta que el checkbox esté checked */}
               <svg
                  className={`
                     w-3 h-3 text-white pointer-events-none transition-all duration-150
                     scale-0 opacity-0 group-has-checked:scale-100 group-has-checked:opacity-100
                  `}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
               >
                  <polyline points="20 6 9 17 4 12" />
               </svg>
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

Checkbox.displayName = "Checkbox";
