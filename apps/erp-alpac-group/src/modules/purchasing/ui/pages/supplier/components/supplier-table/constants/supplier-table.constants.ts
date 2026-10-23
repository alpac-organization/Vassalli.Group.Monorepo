import { SupplierExclusiveStatusEnum } from "@app/core/enums/supplier-exclusive-status.enum";
import type { SupplierExclusiveStatus } from "@app/core/enums/supplier-exclusive-status.enum";

export const contextMenuButton =
  "rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";

export const exclusiveStatusBadgeColors: Record<SupplierExclusiveStatus, string> = {
  None: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
  PendingReview:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  Approved:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  Rejected: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
};

export const exclusiveStatusBadges: Record<
  SupplierExclusiveStatus,
  { label: string; badgeColor: string }
> = {
  None: {
    label: SupplierExclusiveStatusEnum.None.label,
    badgeColor: exclusiveStatusBadgeColors.None,
  },
  PendingReview: {
    label: SupplierExclusiveStatusEnum.PendingReview.label,
    badgeColor: exclusiveStatusBadgeColors.PendingReview,
  },
  Approved: {
    label: SupplierExclusiveStatusEnum.Approved.label,
    badgeColor: exclusiveStatusBadgeColors.Approved,
  },
  Rejected: {
    label: SupplierExclusiveStatusEnum.Rejected.label,
    badgeColor: exclusiveStatusBadgeColors.Rejected,
  },
};
