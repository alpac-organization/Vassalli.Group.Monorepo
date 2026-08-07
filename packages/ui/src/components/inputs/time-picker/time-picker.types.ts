import type { TimePickerProps as MuiTimePickerProps } from "@mui/x-date-pickers/TimePicker";

export type TimePickerFieldWidth = "small" | "medium" | "large";

export type TimePickerProps = Omit<MuiTimePickerProps, "slotProps"> & {
  id?: string;
  fieldWidth?: TimePickerFieldWidth;
  error?: string;
  labelAbove?: boolean;
  isRequired?: boolean;
  labelClassName?: string;
  errorVariant?: "text" | "tooltip";
  hideErrorOnMobile?: boolean;
};

export type TimePickerValue = TimePickerProps["value"];
