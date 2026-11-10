export const inputClassName =
  "w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
export const dropdownClassName = `${inputClassName} focus:border-blue-600! focus:ring-2! focus:ring-green-50/50!`;
export const labelClassName = "text-black! dark:text-white!";
export const secondaryButtonClassName =
  "text-[14px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!";
export const removeItemButtonClassName =
  "h-8 w-8! shrink-0 rounded-md! bg-red-500! text-[13px]! text-white! hover:bg-red-800! dark:bg-red-900!";
export const primaryButtonClassName =
  "text-[14px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!";

export const datePickerSlotProps = {
  popper: {
    disablePortal: false,
    sx: { zIndex: 2000 },
  },
};

export const tierEnterTransition = {
  height: { duration: 0.28, ease: "easeInOut" as const },
  opacity: { duration: 0.32, ease: "easeOut" as const, delay: 0.04 },
  y: { duration: 0.28, ease: "easeOut" as const, delay: 0.04 },
};
