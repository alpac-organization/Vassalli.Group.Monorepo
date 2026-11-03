export type OutflowStatus =
  | "PendingReview"
  | "Annuled"
  | "PendingDispatch"
  | "DispatchCancelled"
  | "Approved";

export interface OutflowStatusValues {
  value: number;
  label: string;
}

export const OutflowStatus: Record<OutflowStatus, OutflowStatusValues> = {
  PendingReview: {
    value: 1,
    label: "Pendiente revisión",
  },
  Annuled: {
    value: 2,
    label: "Anulado",
  },
  PendingDispatch: {
    value: 3,
    label: "Pendiente despacho",
  },
  DispatchCancelled: {
    value: 4,
    label: "Despacho cancelado",
  },
  Approved: {
    value: 5,
    label: "Aprobado",
  },
} as const;
