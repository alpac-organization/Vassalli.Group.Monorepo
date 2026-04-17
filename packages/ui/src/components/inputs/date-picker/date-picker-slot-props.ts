import type { DatePickerProps as MuiDatePickerProps } from "@mui/x-date-pickers/DatePicker";

export type DatePickerFieldWidth = "small" | "medium" | "large";

type MuiSlotProps = NonNullable<MuiDatePickerProps["slotProps"]>;

const outlineSlate600 = "#475569";
const outlineNeutral600 = "#525252";

const fieldWidthClass: Record<DatePickerFieldWidth, string> = {
   small: "w-full max-w-[156px] sm:w-[156px]",
   medium: "w-full max-w-[220px] sm:w-[220px]",
   large: "w-full min-w-0 flex-1 max-w-none",
};

const calendarPaperSx = {
   bgcolor: "#272b34",
   color: "#fff",
   border: "1px solid #3e4451",
   "& .MuiPickersDay-root": {
      color: "#ffffff !important",
   },
   "& .MuiPickersDay-root.Mui-disabled": {
      color: "#94a3b8 !important",
   },
   "& .MuiPickersDay-root .MuiTypography-root": {
      color: "inherit !important",
   },
   "& .MuiPickersDay-root.Mui-selected": {
      color: "#ffffff !important",
      backgroundColor: "rgba(0, 79, 158, 0.35)",
   },
   "& .MuiPickersDay-root.Mui-selected .MuiTypography-root": {
      color: "#ffffff !important",
   },
   "& .MuiPickersDay-root:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
   },
   "& .MuiDayCalendar-weekDayLabel": {
      color: "rgba(255, 255, 255, 0.75)",
   },
   "& .MuiPickersCalendarHeader-label, & .MuiPickersArrowSwitcher-button": {
      color: "#ffffff",
   },
   "& .MuiPickersCalendarHeader-switchViewButton": {
      color: "#ffffff",
   },
   "& .MuiPickersCalendarHeader-switchViewButton .MuiSvgIcon-root": {
      color: "#ffffff",
      fill: "currentColor",
   },
   "& .MuiPickersYear-yearButton, & .MuiPickersMonth-monthButton": {
      color: "#ffffff",
   },
   "& .MuiPickersYear-yearButton.Mui-disabled, & .MuiPickersMonth-monthButton.Mui-disabled": {
      color: "#94a3b8 !important",
   },
} as const;

function buildTextFieldClassName(fieldWidth: DatePickerFieldWidth) {
   return [
      fieldWidthClass[fieldWidth],
      "!text-[14px]",
      "[&_.MuiOutlinedInput-root]:!h-12 [&_.MuiOutlinedInput-root]:!min-h-12 [&_.MuiOutlinedInput-root]:!max-h-12 [&_.MuiOutlinedInput-root]:!items-center",
      "[&_.MuiOutlinedInput-notchedOutline]:!border-slate-600",
      "[&_.MuiOutlinedInput-root:hover_.MuiOutlinedInput-notchedOutline]:!border-slate-600",
      "dark:[&_.MuiOutlinedInput-notchedOutline]:!border-neutral-600",
      "dark:[&_.MuiOutlinedInput-root:hover_.MuiOutlinedInput-notchedOutline]:!border-neutral-600",
      "[&_.MuiOutlinedInput-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:!border-slate-600",
      "dark:[&_.MuiOutlinedInput-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:!border-neutral-600",
      "dark:[&_.MuiOutlinedInput-root]:!bg-[#1e222a]",
      "[&_.MuiOutlinedInput-input]:!text-white !text-[14px]",
      "[&_.MuiInputLabel-root]:!text-white [&_.MuiInputLabel-root]:!text-[14px]",
      "[&_.MuiInputLabel-root.Mui-focused]:!text-white",
      "[&_.MuiOutlinedInput-input::placeholder]:!text-white/80",
      "[&_.MuiSvgIcon-root]:!text-white",
      "[&_.MuiIconButton-root]:!text-white",
      "[&_.MuiInputBase-root.Mui-disabled]:!cursor-not-allowed",
      "[&_.MuiInputBase-input.Mui-disabled]:!cursor-not-allowed",
   ].join(" ");
}

const textFieldSxBase = {
   color: "#ffffff",
   fontSize: 14,
   "& .MuiInputBase-root.Mui-disabled": {
      cursor: "not-allowed !important",
      "& .MuiOutlinedInput-notchedOutline": {
         cursor: "not-allowed !important",
      },
   },
   "& .MuiInputBase-input.Mui-disabled": {
      cursor: "not-allowed !important",
   },
   "& .MuiIconButton-root.Mui-disabled": {
      cursor: "not-allowed !important",
   },
   "& .MuiOutlinedInput-root, & .MuiPickersOutlinedInput-root": {
      minHeight: 48,
      height: 48,
      maxHeight: 48,
   },
   "& .MuiOutlinedInput-notchedOutline, & .MuiPickersOutlinedInput-notchedOutline": {
      borderColor: `${outlineSlate600} !important`,
   },
   "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline, & .MuiPickersOutlinedInput-root:hover .MuiPickersOutlinedInput-notchedOutline":
   {
      borderColor: `${outlineSlate600} !important`,
   },
   "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline, & .MuiPickersOutlinedInput-root.Mui-focused .MuiPickersOutlinedInput-notchedOutline":
   {
      borderColor: `${outlineSlate600} !important`,
      borderWidth: "1px !important",
   },
   "[data-theme=dark] & .MuiOutlinedInput-notchedOutline, [data-theme=dark] & .MuiPickersOutlinedInput-notchedOutline":
   {
      borderColor: `${outlineNeutral600} !important`,
   },
   "[data-theme=dark] & .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline, [data-theme=dark] & .MuiPickersOutlinedInput-root:hover .MuiPickersOutlinedInput-notchedOutline":
   {
      borderColor: `${outlineNeutral600} !important`,
   },
   "[data-theme=dark] & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline, [data-theme=dark] & .MuiPickersOutlinedInput-root.Mui-focused .MuiPickersOutlinedInput-notchedOutline":
   {
      borderColor: `${outlineNeutral600} !important`,
      borderWidth: "1px !important",
   },
   "& .MuiOutlinedInput-input": { fontSize: 14 },
   "& .MuiInputLabel-root": { fontSize: 14 },
   "& .MuiInputLabel-root.Mui-focused": {
      color: "#ffffff !important",
   },
   "& .MuiPickersSectionList-root": { color: "#ffffff", fontSize: 14 },
   "& .MuiPickersSectionList-section": { color: "#ffffff", fontSize: 14 },
   "& .MuiPickersSectionList-sectionContent": { color: "#ffffff", fontSize: 14 },
   "& .MuiPickersInputBase-root": { color: "#ffffff", fontSize: 14 },
   "& .MuiPickersSectionList-section.Mui-selected, & .MuiPickersSectionList-section[aria-selected='true']": {
      backgroundColor: "rgba(82, 82, 82, 0.35)",
      color: "#ffffff !important",
   },
   "& .MuiPickersSectionList-section.Mui-selected .MuiTypography-root, & .MuiPickersSectionList-section[aria-selected='true'] .MuiTypography-root":
   {
      color: "#ffffff !important",
   },
} as const;

const sharedSlotProps = {
   openPickerButton: {
      sx: { color: "#ffffff" },
   },
   openPickerIcon: {
      sx: { color: "#ffffff", fill: "currentColor" },
   },
   day: {
      sx: {
         color: "#ffffff",
         "&.Mui-selected": {
            color: "#ffffff",
            backgroundColor: "rgba(0, 79, 158, 0.35)",
         },
         "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.08)",
         },
         "& .MuiTypography-root": {
            color: "#ffffff",
         },
      },
   },
   toolbar: {
      sx: {
         color: "#ffffff",
         "& .MuiTypography-root": { color: "#ffffff" },
         "& .MuiPickersToolbarText-root": { color: "#ffffff" },
      },
   },
   actionBar: {
      sx: {
         "& .MuiButton-root": {
            color: "#ffffff",
         },
      },
   },
   popper: {
      disablePortal: true,
      sx: {
         zIndex: 1600,
      },
   },
   desktopPaper: {
      className: "rounded-md shadow-lg dark:bg-[#272b34] dark:text-white",
      sx: calendarPaperSx,
   },
   mobilePaper: {
      className: "rounded-md shadow-lg dark:bg-[#272b34] dark:text-white",
      sx: calendarPaperSx,
   },
} as const;

export function getDatePickerSlotProps(fieldWidth: DatePickerFieldWidth = "small") {
   return {
      ...sharedSlotProps,
      textField: {
         size: "medium" as const,
         className: buildTextFieldClassName(fieldWidth),
         sx: { ...textFieldSxBase },
      },
   };
}

export type AlpacDatePickerSlotPropsBundle = ReturnType<typeof getDatePickerSlotProps>;

export const datePickerSlotProps = getDatePickerSlotProps("small");

function isPlainObjectSx(sx: unknown): sx is Record<string, unknown> {
   return typeof sx === "object" && sx !== null && !Array.isArray(sx);
}

type TextFieldSlotObject = Record<string, unknown>;

function asTextFieldSlotObject(value: unknown): TextFieldSlotObject | null {
   if (value === null || value === undefined) return null;
   if (typeof value === "function") return null;
   if (typeof value !== "object") return null;
   return value as TextFieldSlotObject;
}

export function mergeAlpacDatePickerSlotProps(
   base: AlpacDatePickerSlotPropsBundle,
   override?: MuiSlotProps | null,
): MuiSlotProps {
   if (!override) {
      return base as MuiSlotProps;
   }

   const ut = override.textField;
   const btObj = asTextFieldSlotObject(base.textField) ?? {};

   let mergedTextField: MuiSlotProps["textField"];

   if (ut === undefined) {
      mergedTextField = base.textField as MuiSlotProps["textField"];
   } else if (typeof ut === "function") {
      mergedTextField = ut;
   } else {
      const utObj = asTextFieldSlotObject(ut) ?? {};
      const btClass = typeof btObj.className === "string" ? btObj.className : "";
      const utClass = typeof utObj.className === "string" ? utObj.className : "";
      const classNameMerged = [btClass, utClass].filter(Boolean).join(" ");

      const sxMerged =
         typeof utObj.sx === "function"
            ? utObj.sx
            : {
               ...(isPlainObjectSx(btObj.sx) ? btObj.sx : {}),
               ...(isPlainObjectSx(utObj.sx) ? utObj.sx : {}),
            };

      mergedTextField = {
         ...btObj,
         ...utObj,
         ...(classNameMerged ? { className: classNameMerged } : {}),
         sx: sxMerged,
      } as MuiSlotProps["textField"];
   }

   return {
      ...base,
      ...override,
      textField: mergedTextField,
   } as MuiSlotProps;
}
