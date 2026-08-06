import {
  RecordEntranceStatusEnum,
  RecordEntranceVehicleStatusEnum,
} from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control";

const FALLBACK_STATUS_BADGE_CLASS =
  "bg-slate-100 text-slate-900 dark:bg-slate-600/60 dark:text-slate-200 p-1.5";

const QUEUE_STATUS_CLASS =
  "bg-amber-100 text-amber-900 border border-amber-200 dark:bg-[#4A2D00] dark:text-amber-200 dark:border-[#C97A14]";

const ENTRY_MOVEMENT_STATUS_CLASS: Record<string, string> = {
  queue: QUEUE_STATUS_CLASS,
  unloading:
    "bg-blue-100 text-blue-900 border border-blue-200 dark:bg-[#09365C] dark:text-[#93C5FD] dark:border-[#3B82F6]",
  completed:
    "bg-green-100 text-green-900 border border-green-200 dark:bg-green-900/40 dark:text-green-200 dark:border-green-700/50",
  abandoned:
    "bg-[#B1B37A]! text-[#1a1c0d]! border border-[#8f915f]! dark:bg-[#4B5563]! dark:text-[#DAD3C6]! dark:border-[#8f915f]!",
};

const VEHICLE_STATUS_CLASS: Record<string, string> = {
  onsite:
    "bg-emerald-100 text-emerald-900 border border-emerald-200 dark:bg-[#083A38] dark:text-[#7DD3FC] dark:border-[#14B8A6]",
  exited:
    "bg-slate-100 text-slate-800 border border-slate-200 dark:bg-[#3A0F19] dark:text-[#F9A8D4] dark:border-[#9F1239]",
};

function normalizeStatusKey(status: string): string {
  return status.replace(/[_\s-]/g, "").toLowerCase();
}

function resolveEnumLabel(
  status: string,
  enumMap: Record<string, { label: string }>,
): string | undefined {
  const normalized = normalizeStatusKey(status);
  return Object.entries(enumMap).find(
    ([key]) => normalizeStatusKey(key) === normalized,
  )?.[1]?.label;
}

export function getStatusBadgeClass(status: string): string {
  return (
    ENTRY_MOVEMENT_STATUS_CLASS[normalizeStatusKey(status)] ??
    FALLBACK_STATUS_BADGE_CLASS
  );
}

export function getStatusBadgeLabel(status: string): string {
  const normalized = normalizeStatusKey(status);
  const fromEnum = resolveEnumLabel(status, RecordEntranceStatusEnum);
  if (fromEnum) return fromEnum;

  const legacyLabels: Record<string, string> = {
    completed: "Completado",
    abandoned: "Abandonado",
    queue: "En cola",
    unloading: "En descarga",
  };

  return legacyLabels[normalized] ?? status;
}

export function getVehicleStatusBadgeClass(status: string): string {
  return (
    VEHICLE_STATUS_CLASS[normalizeStatusKey(status)] ??
    FALLBACK_STATUS_BADGE_CLASS
  );
}

export function getVehicleStatusBadgeLabel(status: string): string {
  const normalized = normalizeStatusKey(status);
  const fromEnum = resolveEnumLabel(status, RecordEntranceVehicleStatusEnum);
  if (fromEnum) return fromEnum;

  const legacyLabels: Record<string, string> = {
    onsite: "En sitio",
    exited: "Retirado",
  };

  return legacyLabels[normalized] ?? status;
}
