import { useId } from "react";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import type { DatePickerProps } from "./date-picker.types";
import { getDatePickerSlotProps, mergeAlpacDatePickerSlotProps } from "./date-picker-slot-props";

export function DatePicker({
   fieldWidth = "small",
   slotProps,
   error,
   label,
   labelAbove = false,
   isRequired = false,
   labelClassName,
   errorVariant = "text",
   ...rest
}: DatePickerProps) {
   const generatedId = useId();

   // Manejo seguro del ID para evitar el error de TypeScript con slotProps.textField
   const textFieldProps = slotProps?.textField as any;
   const inputId = textFieldProps?.id ?? generatedId;

   const mergedSlotProps = mergeAlpacDatePickerSlotProps(getDatePickerSlotProps(fieldWidth), {
      ...slotProps,
      textField: {
         ...textFieldProps,
         id: inputId,
         error: !!error,
         required: isRequired,
      },
   });

   return (
      <div className="relative flex flex-col gap-1.5 w-full">
         {label && labelAbove && (
            <label
               htmlFor={inputId}
               className={`text-[14px] font-medium ml-0.5 ${labelClassName || "text-slate-600 dark:text-white"}`}
            >
               {label}
               {isRequired && (
                  <span className="text-red-500 dark:text-red-400 ml-1 font-bold">
                     *
                  </span>
               )}
            </label>
         )}

         <MuiDatePicker
            {...rest}
            label={labelAbove ? undefined : label}
            slotProps={mergedSlotProps}
         />

         {error && errorVariant === "tooltip" && (
            <span
               role="tooltip"
               className="pointer-events-none absolute top-full left-1 z-1000 mt-1 flex flex-col items-start transition-all duration-200 ease-out"
            >
               <span
                  className="h-0 w-0 ml-3 shrink-0 border-x-[6px] border-b-[6px] border-x-transparent border-b-red-500 dark:border-b-red-600"
                  aria-hidden={true}
               />
               <span className="whitespace-nowrap rounded-lg bg-red-500 dark:bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-lg">
                  {error}
               </span>
            </span>
         )}

         {error && errorVariant === "text" && (
            <span className="text-xs text-red-500 dark:text-red-400 font-medium ml-1 mt-0.5">
               {error}
            </span>
         )}
      </div>
   );
}
