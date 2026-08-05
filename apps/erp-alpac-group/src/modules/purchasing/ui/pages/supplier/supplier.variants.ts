export const constitutionTypeBadgeVariants = {
   Natural: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
   Legal: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
   default: "bg-slate-100 text-slate-800"
} as const satisfies Record<string, string>

export const idenitificationTypeBadgeVariants = {
   Ruc: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200",
   Cedula: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200",
   default: "bg-slate-100 text-slate-800"
} as const satisfies Record<string, string>