export const gateEntryLabelClassName = "text-black! dark:text-white!";

export const gateEntryInputClassName =
  "w-full! h-9! md:h-9! py-1.5! md:py-1.5! pl-3! pr-3! rounded-md! text-[13px]! md:text-[14px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";

export const footerButtonClass =
  "w-full! sm:w-auto! shrink-0! max-sm:h-9! max-sm:px-2! max-sm:py-1! max-sm:text-[12px]! text-[14px]! sm:text-[15px]! rounded-md! justify-center!";
export const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 24 : -24,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 24 : -24,
    opacity: 0,
  }),
};
