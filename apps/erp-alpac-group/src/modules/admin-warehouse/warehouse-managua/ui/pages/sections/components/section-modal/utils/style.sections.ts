export const inputClassName =
  "w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
export const dropdownClassName = `${inputClassName} focus:border-blue-600! focus:ring-2! focus:ring-green-50/50!`;
export const labelClassName = "text-black! dark:text-white!";

export const overflowAccordionTransition = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1] as const,
};

export const parseDecimal = (value: unknown) => {
  const trimmed = String(value ?? "").trim();
  return trimmed ? parseFloat(trimmed.replace(/,/g, "")) : undefined;
};
