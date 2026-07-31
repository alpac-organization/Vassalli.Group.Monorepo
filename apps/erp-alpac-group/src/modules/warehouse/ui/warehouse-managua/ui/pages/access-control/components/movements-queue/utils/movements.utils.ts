import { RecordEntranceStatusEnum } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control";

const FALLBACK_STATUS_BADGE_CLASS =
  "bg-slate-100 text-slate-900 dark:bg-slate-600/60 dark:text-slate-200 p-1.5";

const QUEUE_STATUS_CLASS =
  "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200";

const ENTRY_MOVEMENT_STATUS_CLASS: Record<string, string> = {
  queue: QUEUE_STATUS_CLASS,
  intail: QUEUE_STATUS_CLASS,
  unloading:
    "bg-green-100 text-green-900 dark:bg-green-900/40 dark:text-green-200",
  inunloading:
    "bg-green-100 text-green-900 dark:bg-green-900/40 dark:text-green-200",
  completed: "bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-200",
  abandoned:
    "bg-slate-200 text-slate-800 dark:bg-slate-700/60 dark:text-slate-200",
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
  const normalized = normalizeStatusKey(status);
  const fromEnum = Object.entries(RecordEntranceStatusEnum).find(
    ([key]) => normalizeStatusKey(key) === normalized,
  )?.[1]?.label;

  if (fromEnum) return fromEnum;

  const legacyLabels: Record<string, string> = {
    intail: "En cola",
    inunloading: "En descarga",
    completed: "Completado",
    abandoned: "Abandonado",
    queue: "En cola",
    unloading: "En descarga",
  };

  return legacyLabels[normalized] ?? status;
}
