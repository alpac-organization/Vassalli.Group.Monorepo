const KNOWN_STATUS_BADGE_CLASS: Record<string, string> = {
  InTail:
    "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200",
  InUnloading:
    "bg-green-100 text-green-900 dark:bg-green-900/40 dark:text-green-200",
  Completed: "bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-200",
  Abandoned: "bg-red-100 text-red-900 dark:bg-red-900/40 dark:text-red-200",
};

export function getStatusBadgeClass(status: string): string {
  return KNOWN_STATUS_BADGE_CLASS[status.toUpperCase()];
}
