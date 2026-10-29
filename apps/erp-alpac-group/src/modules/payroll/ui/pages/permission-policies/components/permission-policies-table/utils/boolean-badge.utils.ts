export function booleanBadgeColor(value: boolean): string {
  return value
    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
    : "bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300";
}

export function booleanBadgeLabel(value: boolean): string {
  return value ? "Activa" :  "Inactiva"
}
