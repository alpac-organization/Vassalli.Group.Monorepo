import type { EntryStatus as EntryStatusEnum } from "@app/core/enums/entry-status.enum";

export const ENTRY_STATUS_BADGE_CLASS_NAME: Record<EntryStatusEnum, string> = {
  PendingReview:
    "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
  ApprovedEntry:
    "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  CancelEntry:
    "bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
};
