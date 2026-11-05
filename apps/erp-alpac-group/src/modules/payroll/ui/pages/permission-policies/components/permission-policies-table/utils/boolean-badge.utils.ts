export function booleanBadgeColor(value: boolean): string {
  return value
    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
    : "bg-[#722F37]/15 text-[#722F37] dark:bg-[#5c1a22]/45 dark:text-[#e8a0a8]";
}

export function booleanBadgeLabel(value: boolean): string {
  return value ? "Activa" :  "Inactiva"
}
