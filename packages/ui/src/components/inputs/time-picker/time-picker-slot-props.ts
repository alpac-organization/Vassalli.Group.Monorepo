import type { TimePickerProps as MuiTimePickerProps } from "@mui/x-date-pickers/TimePicker";
import type { TimePickerFieldWidth } from "./time-picker.types";

type MuiSlotProps = NonNullable<MuiTimePickerProps["slotProps"]>;

type TimePickerSlotPropsOptions = {
  fieldWidth: TimePickerFieldWidth;
  id: string;
  error: boolean;
  required: boolean;
};

const COLORS = {
  background: "#272b34",
  border: "#3e4451",
  fieldBorder: "oklch(44.6% 0.043 257.281)",
  text: "#ffffff",
  disabledText: "#94a3b8",
} as const;

const FIELD_WIDTH_CLASS: Record<TimePickerFieldWidth, string> = {
  small: "w-full max-w-[156px] sm:w-[156px]",
  medium: "w-full max-w-[220px] sm:w-[220px]",
  large: "w-full min-w-0 flex-1 max-w-none",
};

const fieldSx = {
  color: COLORS.text,
  fontSize: 14,
  "& .MuiOutlinedInput-root, & .MuiPickersOutlinedInput-root": {
    height: 48,
    color: COLORS.text,
  },
  "& .MuiOutlinedInput-notchedOutline, & .MuiPickersOutlinedInput-notchedOutline, & .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline, & .MuiPickersOutlinedInput-root:hover .MuiPickersOutlinedInput-notchedOutline, & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline, & .MuiPickersOutlinedInput-root.Mui-focused .MuiPickersOutlinedInput-notchedOutline":
    {
      borderColor: `${COLORS.fieldBorder} !important`,
      borderWidth: "1px !important",
    },
  "& .MuiInputLabel-root, & .MuiOutlinedInput-input, & .MuiPickersSectionList-root, & .MuiPickersSectionList-section, & .MuiPickersSectionList-sectionContent, & .MuiPickersInputBase-root":
    {
      color: COLORS.text,
      fontSize: 14,
    },
  "& .MuiInputLabel-root.Mui-focused": {
    color: `${COLORS.text} !important`,
  },
  "& .MuiSvgIcon-root, & .MuiIconButton-root": {
    color: COLORS.text,
  },
  "& .MuiPickersSectionList-section.Mui-selected, & .MuiPickersSectionList-section[aria-selected='true']":
    {
      backgroundColor: "rgba(82, 82, 82, 0.35)",
      color: `${COLORS.text} !important`,
    },
  "& .MuiInputBase-root.Mui-disabled, & .MuiInputBase-input.Mui-disabled, & .MuiIconButton-root.Mui-disabled":
    {
      cursor: "not-allowed !important",
    },
} as const;

const paperSx = {
  bgcolor: COLORS.background,
  color: COLORS.text,
  border: `1px solid ${COLORS.border}`,
  "& .MuiMenuItem-root": {
    color: COLORS.text,
    fontSize: 14,
  },
  "& .MuiMenuItem-root.Mui-disabled": {
    color: `${COLORS.disabledText} !important`,
    opacity: 0.5,
  },
  "& .MuiMenuItem-root.Mui-selected": {
    color: `${COLORS.text} !important`,
    backgroundColor: "rgba(0, 79, 158, 0.35)",
  },
  "& .MuiMenuItem-root:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  "& .MuiMultiSectionDigitalClock-root": {
    width: "100%",
    justifyContent: "center",
  },
  "& .MuiMultiSectionDigitalClockSection-root": {
    "&::-webkit-scrollbar": { width: 6 },
    "&::-webkit-scrollbar-track": { background: "transparent" },
    "&::-webkit-scrollbar-thumb": {
      background: "#475569",
      borderRadius: 3,
    },
    "&::-webkit-scrollbar-thumb:hover": { background: "#64748b" },
  },
  "& .MuiPickersToolbar-root, & .MuiTimePickerToolbar-root, & .MuiTimePickerToolbar-hourMinuteLabel":
    {
      color: COLORS.text,
      alignItems: "center",
    },
  "& .MuiPickersToolbar-title, & .MuiPickersToolbarText-root, & .MuiPickersToolbarText-root.Mui-selected, & .MuiTimePickerToolbar-hourMinuteLabel .MuiButtonBase-root, & .MuiTimePickerToolbar-separator, & .MuiClockNumber-root, & .MuiClockNumber-root.Mui-selected, & .MuiClock-amButton, & .MuiClock-pmButton, & .MuiPickersArrowSwitcher-button, & .MuiDialogActions-root .MuiButton-root, & .MuiPickersLayout-actionBar .MuiButton-root":
    {
      color: `${COLORS.text} !important`,
    },
  "& .MuiClock-clock": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  "& .MuiClockNumber-root.Mui-disabled": {
    color: "rgba(255, 255, 255, 0.35) !important",
  },
} as const;

export function getTimePickerSlotProps({
  fieldWidth,
  id,
  error,
  required,
}: TimePickerSlotPropsOptions): MuiSlotProps {
  return {
    textField: {
      id,
      error,
      required,
      size: "medium",
      className: FIELD_WIDTH_CLASS[fieldWidth],
      sx: fieldSx,
    },
    openPickerButton: {
      sx: { color: COLORS.text },
    },
    openPickerIcon: {
      sx: { color: COLORS.text, fill: "currentColor" },
    },
    toolbar: {
      sx: {
        color: COLORS.text,
        "& .MuiTypography-root, & .MuiPickersToolbarText-root": {
          color: `${COLORS.text} !important`,
        },
      },
    },
    actionBar: {
      sx: { "& .MuiButton-root": { color: COLORS.text } },
    },
    popper: {
      disablePortal: true,
      sx: { zIndex: 1600 },
    },
    desktopPaper: {
      className: "rounded-md shadow-lg",
      sx: paperSx,
    },
    mobilePaper: {
      className: "rounded-md shadow-lg",
      sx: paperSx,
    },
  };
}
