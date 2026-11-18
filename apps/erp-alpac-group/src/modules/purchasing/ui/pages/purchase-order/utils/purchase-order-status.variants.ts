import { PurchaseOrderStatusEnum } from "@app/modules/purchasing/domain/enums/purchase-order-status.enum";

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
