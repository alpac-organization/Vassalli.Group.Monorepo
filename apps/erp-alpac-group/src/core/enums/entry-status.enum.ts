export type EntryStatus = "PendingReview" | "ApprovedEntry" | "CancelEntry";

export interface EntryStatusValues {
  value: number;
  label: string;
}

export const EntryStatus: Record<EntryStatus, EntryStatusValues> = {
  PendingReview: {
    value: 1,
    label: "Pendiente de revisión",
  },
  ApprovedEntry: {
    value: 2,
    label: "Aprobada",
  },
  CancelEntry: {
    value: 3,
    label: "Cancelada",
  },
} as const;
