import { useId, useRef } from "react";
import { TimePicker as MuiTimePicker } from "@mui/x-date-pickers/TimePicker";
import type { TimePickerProps } from "./time-picker.types";
import { getTimePickerSlotProps } from "./time-picker-slot-props";
import { ErrorTooltip } from "../shared/error-tooltip";

export function TimePicker({
  id,
  fieldWidth = "small",
  error,
  label,
  labelAbove = false,
  isRequired = false,
  labelClassName,
  errorVariant = "text",
  ...rest
}: TimePickerProps) {
  const generatedId = useId();
  const fieldRef = useRef<HTMLDivElement>(null);
  const inputId = id ?? generatedId;
  const slotProps = getTimePickerSlotProps({
    fieldWidth,
    id: inputId,
    error: Boolean(error),
    required: isRequired,
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

      <MuiTimePicker
        ampm={false}
        views={["hours", "minutes"]}
        format="HH:mm"
        {...rest}
        label={labelAbove ? undefined : label}
        slotProps={slotProps}
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
