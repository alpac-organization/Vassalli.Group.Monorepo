import { ManagementReviewStatus } from "@app/modules/management/domain/enum/management-review-status";
import type { managementReviewStatusType } from "@app/modules/management/domain/enum/management-review-status";

const FALLBACK_BADGE = {
  label: "—",
  color: "bg-slate-100 text-slate-800 dark:bg-slate-700/60 dark:text-slate-200",
};

const STATUS_BADGE_VARIANTS: Record<
  managementReviewStatusType,
  { label: string; color: string }
> = {
  [ManagementReviewStatus.Pending.textValue]: {
    label: ManagementReviewStatus.Pending.label,
    color:
      "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200",
  },
  [ManagementReviewStatus.Approved.textValue]: {
    label: ManagementReviewStatus.Approved.label,
    color:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  },
  [ManagementReviewStatus.Rejected.textValue]: {
    label: ManagementReviewStatus.Rejected.label,
    color: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200",
  },
};

export function getInitials(fullname?: string | null): string {
  if (!fullname?.trim()) return "?";
  const parts = fullname.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function getManagementReviewStatusBadge(
  status: managementReviewStatusType,
) {
  return STATUS_BADGE_VARIANTS[status] ?? FALLBACK_BADGE;
}
