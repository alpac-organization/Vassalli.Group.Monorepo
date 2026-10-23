
export const inputClassName =
	"w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
export const dropdownClassName = `${inputClassName} focus:border-blue-600! focus:ring-2! focus:ring-green-50/50!`;
export const labelClassName = "text-black! dark:text-white!";
export const primaryButtonClassName =
	"w-full! sm:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!";
export const secondaryButtonClassName =
	"w-full! sm:w-auto! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!";
export const removeItemButtonClassName =
	"h-8! w-8! shrink-0 rounded-md! bg-red-500! text-[13px]! text-white! hover:bg-red-800! dark:bg-red-900!";
export const deleteButtonClass =
	"rounded-md! h-11 px-6! border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/20 hover:border-red-400 dark:hover:border-red-500/60 hover:text-red-700 dark:hover:text-red-300 shadow-sm transition-all duration-200";
export const cancelButtonClass =
	"rounded-md! h-11 px-6! hover:bg-slate-200 bg-slate-500 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600";

export const datePickerSlotProps = {
	popper: {
		disablePortal: false,
		sx: { zIndex: 2000 },
	},
};

export const UNIT_STEP_LABEL = "Precio unitario";
export const PREFERENTIAL_STEP_LABEL = "Precio preferencial";

export const preferencialEnterTransition = {
	height: { duration: 0.28, ease: "easeInOut" as const },
	opacity: { duration: 0.32, ease: "easeOut" as const, delay: 0.04 },
	y: { duration: 0.28, ease: "easeOut" as const, delay: 0.04 },
};

export const stepContentTransition = {
	opacity: { duration: 0.28, ease: "easeOut" as const },
	x: { duration: 0.3, ease: "easeOut" as const },
};

export const stepperRevealTransition = {
	opacity: { duration: 0.32, ease: "easeOut" as const },
	height: { duration: 0.35, ease: "easeInOut" as const },
};