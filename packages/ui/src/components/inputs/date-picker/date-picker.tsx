import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import type { DatePickerProps } from "./date-picker.types";
import { getDatePickerSlotProps, mergeAlpacDatePickerSlotProps } from "./date-picker-slot-props";

export function DatePicker({ fieldWidth = "small", slotProps, ...rest }: DatePickerProps) {
  const mergedSlotProps = mergeAlpacDatePickerSlotProps(getDatePickerSlotProps(fieldWidth), slotProps);
  return <MuiDatePicker {...rest} slotProps={mergedSlotProps} />;
}
