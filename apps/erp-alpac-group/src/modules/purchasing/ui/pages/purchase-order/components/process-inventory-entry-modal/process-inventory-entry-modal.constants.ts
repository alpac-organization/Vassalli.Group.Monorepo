export const QUANTITY_FORMATTER = new Intl.NumberFormat("es-NI", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const DOCUMENT_CODE_BADGE_COLORS = {
  order:
    "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  request:
    "bg-violet-100 text-violet-800 border border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800",
  product:
    "bg-indigo-100 text-indigo-800 border border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
} as const;

export const DOCUMENT_CODE_BADGE_CLASS =
  "text-[11px]! px-2! py-0.5! font-semibold! tracking-wide";

export const SECTION_TITLE_CLASS =
  "m-0 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-200";
