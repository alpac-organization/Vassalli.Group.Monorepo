import { forwardRef, useId } from "react";

import type { TextareaProps } from "./textarea.types";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
   (
      { label, labelClassName, error, className, id: idProp, isRequired, ...rest },
      ref,
   ) => {

      const generatedId = useId();
      const textareaId = idProp ?? generatedId;

      return (
         <div className="flex w-full max-w-full flex-col gap-1.5 box-border">
            {label ? (
               <label
                  htmlFor={textareaId}
                  className={`ml-0.5 text-[14px] font-medium ${labelClassName || "text-slate-600 dark:text-slate-300"}`}
               >
                  {label}
                  {isRequired && (
                     <span className="text-red-500 dark:text-red-400 ml-1 font-bold">
                        *
                     </span>
                  )}
               </label>
            ) : null}

            <textarea
               ref={ref}
               id={textareaId}
               {...rest}
               className={`
            w-full box-border rounded-[10px] border bg-white py-2.5 px-4 text-[14px] outline-none transition-all
            placeholder:text-slate-500 md:text-[15px]
            focus:border-blue-600 focus:ring-2 focus:ring-green-50/50
            disabled:cursor-not-allowed disabled:bg-slate-50
            dark:bg-[#272b34]
            ${error ? "border-red-400 ring-red-50" : "border-slate-200 hover:border-blue-300 dark:border-slate-600 dark:hover:border-neutral-600"}
            ${className ?? ""}
          `}
            />

            {error ? (
               <span className="ml-1 mt-0.5 text-xs font-medium text-red-500 dark:text-red-400">
                  {error}
               </span>
            ) : null}
         </div>
      );
   },
);

Textarea.displayName = "Textarea";
