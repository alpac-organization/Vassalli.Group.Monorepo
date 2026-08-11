import { DucaRecord } from "@app/modules/warehouse/domain/enums/warehouse-managua/duca-satus";

const FALLBACK_STATUS_BADGE_CLASS =
  "bg-slate-100 text-slate-900 dark:bg-slate-600/60 dark:text-slate-200 p-1.5";

const PENDING_STATUS_CLASS =
  "bg-amber-100 text-amber-900 border border-amber-200 dark:bg-[#4A2D00] dark:text-amber-200 dark:border-[#C97A14]";

const COMPLETED_STATUS_CLASS =
  "bg-green-100 text-green-900 border border-green-200 dark:bg-green-900/40 dark:text-green-200 dark:border-green-700/50";

function normalizeStatusKey(status: string): string {
  return status.replace(/[_\s-]/g, "").toLowerCase();
}

export function getDucaStatusBadgeLabel(status: string): string {
  const normalized = normalizeStatusKey(status);

  const match = Object.entries(DucaRecord).find(([key, item]) => {
    return (
      normalizeStatusKey(key) === normalized ||
      normalizeStatusKey(String(item.label)) === normalized ||
      String(item.value) === status.trim()
    );
  });

  return match?.[1].label ?? status;
}

export function getDucaStatusBadgeClass(status: string): string {
  const normalized = normalizeStatusKey(status);
  if (normalized === "pending") {
    return PENDING_STATUS_CLASS;
  }

  if (normalized === "completed") {
    return COMPLETED_STATUS_CLASS;
  }

  return FALLBACK_STATUS_BADGE_CLASS;
}
