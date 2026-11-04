import type { EnumType } from "@app/shared/types/enum.type";

export type OutflowStatus =
  | "PendingReview"
  | "Annuled"
  | "PendingDispatch"
  | "DispatchCancelled"
  | "Approved";

export const OutflowStatus: Record<OutflowStatus, EnumType> = {
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
