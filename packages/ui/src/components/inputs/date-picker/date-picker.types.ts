import type { DatePickerProps as MuiDatePickerProps } from "@mui/x-date-pickers/DatePicker";
import type { } from "@mui/x-date-pickers/AdapterDayjs";
import type { DatePickerFieldWidth } from "./date-picker-slot-props";

export type DatePickerProps = MuiDatePickerProps & {
   fieldWidth?: DatePickerFieldWidth;
   error?: string;
};

export type DatePickerValue = DatePickerProps["value"];
