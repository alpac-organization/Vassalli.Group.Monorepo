import { PurchaseOrderStatusEnum } from "@app/modules/purchasing/domain/enums/purchase-order-status.enum";
import { PriorityLevelEnum, type PriorityLevelType } from "@app/modules/purchasing/domain/enums/purchase-request-priority-level.enum";

export const purchaseOrderStatusBadgeVariants = {
  [PurchaseOrderStatusEnum.Pending.textValue]: {
    label: PurchaseOrderStatusEnum.Pending.label,
    badgeColor: "bg-amber-500/15 text-amber-300 border border-amber-400/40",
  },

  [PurchaseOrderStatusEnum.Generated.textValue]: {
    label: PurchaseOrderStatusEnum.Generated.label,
    badgeColor:
      "bg-emerald-500/15 text-emerald-300 border border-emerald-400/40",
  },

  default: {
    label: "",
    badgeColor: "bg-slate-500/15 text-slate-300 border border-slate-400/30",
  },
} as const;

type PurchaseOrderStatusBadgeVariant = {
  label: string;
  badgeColor: string;
};

export const resolvePurchaseOrderStatusBadge = (
  status?: string | null,
): PurchaseOrderStatusBadgeVariant => {
  const variants = purchaseOrderStatusBadgeVariants as Record<
    string,
    PurchaseOrderStatusBadgeVariant
  >;

  return (status ? variants[status] : undefined) ?? variants.default;
};


const PRIORITY_LEVEL_COLORS: Record<PriorityLevelType, string> = {
  None:       "bg-slate-500/10 text-slate-600 ring-1 ring-inset ring-slate-500/20 dark:bg-slate-400/10 dark:text-slate-400 dark:ring-slate-400/20",
  Critical:   "bg-red-500/12 text-[#8B0000] ring-1 ring-inset ring-[#8B0000]/25 dark:bg-red-900/35 dark:text-red-300 dark:ring-red-700/50",
  Unforeseen: "bg-amber-500/12 text-amber-800 ring-1 ring-inset ring-amber-600/25 dark:bg-amber-400/10 dark:text-amber-400 dark:ring-amber-400/25",
  Normal:     "bg-blue-500/10 text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/25",
};

export function getPriorityLevelBadge(priority?: PriorityLevelType | null) {
  const item = priority ? PriorityLevelEnum[priority] : PriorityLevelEnum.None;
  const resolved = item ?? PriorityLevelEnum.None;

  return {
    label: resolved.label,
    color: PRIORITY_LEVEL_COLORS[resolved.textValue],
  };
}