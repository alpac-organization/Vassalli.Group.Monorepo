import type { OutflowStatus } from "@app/core/enums/outflow-status.enum";

export const REQUEST_STATUS_TABS = [
  { id: "", label: "Todos", color: "#94a3b8" },
  { id: "PendingReview", label: "Pendiente revisión", color: "#F97316" },
  { id: "Approved", label: "Aprobado", color: "#22c55e" },
  { id: "Annuled", label: "Anulado", color: "#f87171" },
  { id: "PendingDispatch", label: "En proceso", color: "#5e57eb" },
  { id: "DispatchCancelled", label: "Despacho cancelado", color: "#c084fc" },
] as const;

const STATUS_BADGE_CLASS_NAME: Record<string, string> = {
  PendingReview:
    "bg-orange-100 text-orange-800 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
  Approved:
    "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  Annuled:
    "bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
  PendingDispatch:
    "bg-indigo-100 text-indigo-800 border border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
  DispatchCancelled:
    "bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
};

export const getStatusBadgeClassName = (status: OutflowStatus | string) =>
  STATUS_BADGE_CLASS_NAME[String(status)] ??
  "bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";

const REASON_BADGE_CLASS_NAME: Record<string, string> = {
  Sale: "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
};

export const getReasonBadgeClassName = (reasonUse: string | null | undefined) =>
  REASON_BADGE_CLASS_NAME[String(reasonUse ?? "")] ??
  "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";