import { useId, useRef } from "react";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import type { DatePickerProps } from "./date-picker.types";
import { getDatePickerSlotProps, mergeAlpacDatePickerSlotProps } from "./date-picker-slot-props";
import { ErrorTooltip } from "../shared/error-tooltip";

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
   const fieldRef = useRef<HTMLDivElement>(null);

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
      <div className="relative flex flex-col gap-1.5 w-full" ref={fieldRef}>
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
            <ErrorTooltip message={error} anchorRef={fieldRef} />
         )}

         {error && errorVariant === "text" && (
            <span className="text-xs text-red-500 dark:text-red-400 font-medium ml-1 mt-0.5">
               {error}
            </span>
         )}
      </div>
   );
}
