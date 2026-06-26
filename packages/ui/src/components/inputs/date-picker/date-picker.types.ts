import type { DatePickerProps as MuiDatePickerProps } from "@mui/x-date-pickers/DatePicker";
import type { } from "@mui/x-date-pickers/AdapterDayjs";
import type { DatePickerFieldWidth } from "./date-picker-slot-props";

export type DatePickerProps = MuiDatePickerProps & {
   fieldWidth?: DatePickerFieldWidth;
   error?: string;
   labelAbove?: boolean;
   isRequired?: boolean;
   labelClassName?: string;
   errorVariant?: "text" | "tooltip"; 
};

export type DatePickerValue = DatePickerProps["value"];
