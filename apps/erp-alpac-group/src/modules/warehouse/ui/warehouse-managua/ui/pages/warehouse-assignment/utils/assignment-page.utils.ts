import {
  AssignmentOperationalStatus,
  AssignmentOperationalStatusLabels,
  DestinationType,
  DestinationTypeLabels,
  MachineryType,
  MachineryTypeLabels,
} from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/assignment-enums";

const STATUS_CONFIG: Record<
  string | number,
  { label: string; className: string }
> = {
  Pending: {
    label:
      AssignmentOperationalStatusLabels[AssignmentOperationalStatus.Pending],
    className:
      "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-800 px-2.5! py-0.5! text-xs font-semibold",
  },
  [AssignmentOperationalStatus.Pending]: {
    label:
      AssignmentOperationalStatusLabels[AssignmentOperationalStatus.Pending],
    className:
      "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-800 px-2.5! py-0.5! text-xs font-semibold",
  },

  InProgress: {
    label:
      AssignmentOperationalStatusLabels[
        AssignmentOperationalStatus.InProgress
      ],
    className:
      "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-800 px-2.5! py-0.5! text-xs font-semibold",
  },
  [AssignmentOperationalStatus.InProgress]: {
    label:
      AssignmentOperationalStatusLabels[
        AssignmentOperationalStatus.InProgress
      ],
    className:
      "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-800 px-2.5! py-0.5! text-xs font-semibold",
  },

  OnHold: {
    label:
      AssignmentOperationalStatusLabels[AssignmentOperationalStatus.OnHold],
    className:
      "bg-orange-100 text-orange-800 border border-orange-200 dark:bg-orange-900/40 dark:text-orange-200 dark:border-orange-800 px-2.5! py-0.5! text-xs font-semibold",
  },
  [AssignmentOperationalStatus.OnHold]: {
    label:
      AssignmentOperationalStatusLabels[AssignmentOperationalStatus.OnHold],
    className:
      "bg-orange-100 text-orange-800 border border-orange-200 dark:bg-orange-900/40 dark:text-orange-200 dark:border-orange-800 px-2.5! py-0.5! text-xs font-semibold",
  },

  Downloaded: {
    label:
      AssignmentOperationalStatusLabels[
        AssignmentOperationalStatus.Downloaded
      ],
    className:
      "bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-800 px-2.5! py-0.5! text-xs font-semibold",
  },
  [AssignmentOperationalStatus.Downloaded]: {
    label:
      AssignmentOperationalStatusLabels[
        AssignmentOperationalStatus.Downloaded
      ],
    className:
      "bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-800 px-2.5! py-0.5! text-xs font-semibold",
  },
};

const DEFAULT_STATUS_BADGE = {
  label: AssignmentOperationalStatusLabels[AssignmentOperationalStatus.None] ?? "Ninguno",
  className:
    "bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 px-2.5! py-0.5! text-xs font-semibold",
};

export function getAssignmentStatusBadgeProps(
  status?: AssignmentOperationalStatus | number | string | null,
): { label: string; className: string } {
  if (status == null) return DEFAULT_STATUS_BADGE;
  return STATUS_CONFIG[status] ?? DEFAULT_STATUS_BADGE;
}

export function isAssignmentPendingOrBeyond(
  status?: AssignmentOperationalStatus | number | string | null,
): boolean {
  if (status == null) return false;
  return Boolean(STATUS_CONFIG[status]);
}

export function canSendAssignmentToUnloading(
  status?: AssignmentOperationalStatus | number | string | null,
): boolean {
  return !isAssignmentPendingOrBeyond(status);
}

export function canStartTask(
  status?: AssignmentOperationalStatus | number | string | null,
): boolean {
  if (status == null) return false;
  return (
    status === AssignmentOperationalStatus.Pending ||
    status === 1 ||
    status === "Pending"
  );
}

export function canAssignPositions(
  status?: AssignmentOperationalStatus | number | string | null,
): boolean {
  if (status == null) return false;
  return (
    status === AssignmentOperationalStatus.InProgress ||
    status === 2 ||
    status === "InProgress"
  );
}

const DESTINATION_LABELS: Record<string | number, string> = {
  Warehouse: DestinationTypeLabels[DestinationType.Warehouse],
  [DestinationType.Warehouse]: DestinationTypeLabels[DestinationType.Warehouse],
  CustomYard: DestinationTypeLabels[DestinationType.CustomYard],
  [DestinationType.CustomYard]: DestinationTypeLabels[DestinationType.CustomYard],
  CustomSheld: DestinationTypeLabels[DestinationType.CustomSheld],
  [DestinationType.CustomSheld]: DestinationTypeLabels[DestinationType.CustomSheld],
};

export function getDestinationLabel(
  type?: DestinationType | number | string | null,
): string {
  if (type == null) return "—";
  return DESTINATION_LABELS[type] ?? "Ninguno";
}

const MACHINERY_LABELS: Record<string | number, string> = {
  Forklift: MachineryTypeLabels[MachineryType.Forklift],
  [MachineryType.Forklift]: MachineryTypeLabels[MachineryType.Forklift],
};

export function getMachineryTypeLabel(
  type?: MachineryType | number | string | null,
): string {
  if (type == null) return "Maquinaria";
  return MACHINERY_LABELS[type] ?? "Maquinaria";
}
