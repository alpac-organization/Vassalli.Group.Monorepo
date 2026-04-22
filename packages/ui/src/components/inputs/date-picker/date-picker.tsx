import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import type { DatePickerProps } from "./date-picker.types";
import { getDatePickerSlotProps, mergeAlpacDatePickerSlotProps } from "./date-picker-slot-props";

export function DatePicker({ fieldWidth = "small", slotProps, error, ...rest }: DatePickerProps) {
   const mergedSlotProps = mergeAlpacDatePickerSlotProps(getDatePickerSlotProps(fieldWidth), {
      ...slotProps,
      textField: {
         ...slotProps?.textField,
         error: !!error,
      },
   });

   return (
      <div className="flex flex-col gap-1.5 w-full">
         <MuiDatePicker {...rest} slotProps={mergedSlotProps} />
         {error && (
            <span className="text-xs text-red-500 dark:text-red-400 font-medium ml-1 mt-0.5">
               {error}
            </span>
         )}
      </div>
   );
}
