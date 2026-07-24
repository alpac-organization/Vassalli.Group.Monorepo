const FALLBACK_STATUS_BADGE_CLASS =
  "bg-slate-100 text-slate-900 dark:bg-slate-800/60 dark:text-slate-200";

const ENTRY_MOVEMENT_STATUS_CLASS: Record<string, string> = {
  intail:
    "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200",
  inunloading:
    "bg-green-100 text-green-900 dark:bg-green-900/40 dark:text-green-200",
  completed:
    "bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-200",
};

export const KNOWN_STATUS_BADGE_LABEL: Record<string, string> = {
  intail: "En cola",
  inunloading: "En descarga",
  completed: "Completado",
};

function normalizeStatusKey(status: string): string {
  return status.replace(/[_\s-]/g, "").toLowerCase();
}

export function getStatusBadgeClass(status: string): string {
  return (
    ENTRY_MOVEMENT_STATUS_CLASS[normalizeStatusKey(status)] ??
    FALLBACK_STATUS_BADGE_CLASS
  );
}

export function getStatusBadgeLabel(status: string): string {
  return KNOWN_STATUS_BADGE_LABEL[normalizeStatusKey(status)] ?? status;
}
