export const datePickerFieldClassName =
  "w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";

export const controlVacationCalendarDaySx = {
  color: "#ffffff",
  "& .MuiTypography-root": {
    color: "#ffffff",
  },
  "&.Mui-selected": {
    color: "#ffffff",
    backgroundColor: "rgba(0, 79, 158, 0.35)",
  },
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  "&.Mui-disabled": {
    color: "#6b7280",
    opacity: 0.45,
    backgroundColor: "transparent",
    "& .MuiTypography-root": {
      color: "#6b7280",
      opacity: 0.45,
    },
  },
} as const;
