export type EntryStatus = "PendingReview" | "ApprovedEntry" | "CancelEntry";

export interface EntryStatusValues {
  value: number;
  label: string;
  badgeColor: string;
}

export const EntryStatus: Record<EntryStatus, EntryStatusValues> = {
  PendingReview: {
    value: 1,
    label: "Pendiente de revisión",
    badgeColor: "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800" 
  },
  ApprovedEntry: {
    value: 2,
    label: "Aprobada",
    badgeColor: "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
  },
  CancelEntry: {
    value: 3,
    label: "Cancelada",
    badgeColor: "bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
  },
} as const;
