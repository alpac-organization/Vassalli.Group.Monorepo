import type { SupplierVariants } from "./supplier.types"

export const constitutionTypeBadgeVariants = {
   Natural: { label: "Natural", badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200" },
   Legal: { label: "Legal", badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200" },
   default: { label: "Sin consitución", badgeColor: "bg-slate-100 text-slate-800" }
} as const satisfies Record<string, SupplierVariants>

export const idenitificationTypeBadgeVariants = {
   Ruc: { label: "Ruc", badgeColor: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200" },
   Cedula: { label: "Cedula", badgeColor: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200" },
   default: { label: "Sin identificación", badgeColor: "bg-slate-100 text-slate-800" }
} as const satisfies Record<string, SupplierVariants>