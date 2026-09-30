import { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import { PurchaseRequestStatusEnum } from "@app/modules/purchasing/domain/enums/purchase-request-status.enum";
import type { PurchaseRequestVariants } from "./purchase-request.types";
import { PriorityLevelEnum } from "@app/modules/purchasing/domain/enums/purchase-request-priority-level.enum";
import { PurchaseRequestDestinationEnum } from "@app/modules/purchasing/domain/enums/purchase-request-destination.enum";

export const purchaseRequestTypeBadgeVariants = {
  [PurchaseRequestEnum.Requisition.textValue]: {
    label: PurchaseRequestEnum.Requisition.label,
    badgeColor: "bg-sky-500/15 text-sky-300 border border-sky-400/40",
  },

  [PurchaseRequestEnum.Eventual.textValue]: {
    label: PurchaseRequestEnum.Eventual.label,
    badgeColor: "bg-violet-500/15 text-violet-300 border border-violet-400/40",
  },

  [PurchaseRequestEnum.Monthly.textValue]: {
    label: PurchaseRequestEnum.Monthly.label,
    badgeColor: "bg-teal-500/15 text-teal-300 border border-teal-400/40",
  },

  default: {
    label: "",
    badgeColor: "bg-slate-500/15 text-slate-300 border border-slate-400/30",
  },
} as const satisfies Record<string, PurchaseRequestVariants>;

export const purchaseRequestStatusBadgeVariants = {
  [PurchaseRequestStatusEnum.Approved.textValue]: {
    label: PurchaseRequestStatusEnum.Approved.label,
    badgeColor:
      "bg-emerald-500/15 text-emerald-300 border border-emerald-400/40",
  },

  [PurchaseRequestStatusEnum.Pending.textValue]: {
    label: PurchaseRequestStatusEnum.Pending.label,
    badgeColor: "bg-amber-500/15 text-amber-300 border border-amber-400/40",
  },

  [PurchaseRequestStatusEnum.Rejected.textValue]: {
    label: PurchaseRequestStatusEnum.Rejected.label,
    badgeColor: "bg-red-500/15 text-red-300 border border-red-400/40",
  },

  [PurchaseRequestStatusEnum.Canceled.textValue]: {
    label: PurchaseRequestStatusEnum.Canceled.label,
    badgeColor: "bg-slate-500/15 text-slate-300 border border-slate-400/30",
  },

  default: {
    label: "",
    badgeColor: "bg-slate-500/15 text-slate-300 border border-slate-400/30",
  },
} as const satisfies Record<string, PurchaseRequestVariants>;

export const purchaseRequestPriorityBadgeVariants = {
  [PriorityLevelEnum.Critical.textValue]: {
    label: PriorityLevelEnum.Critical.label,
    badgeColor: "bg-pink-500/15 text-pink-300 border border-pink-400/40",
  },

  [PriorityLevelEnum.Unforeseen.textValue]: {
    label: PriorityLevelEnum.Unforeseen.label,
    badgeColor: "bg-orange-500/15 text-orange-300 border border-orange-400/40",
  },

  [PriorityLevelEnum.Normal.textValue]: {
    label: PriorityLevelEnum.Normal.label,
    badgeColor: "bg-blue-500/15 text-blue-300 border border-blue-400/40",
  },

  [PriorityLevelEnum.PrintedStationery.textValue]: {
    label: PriorityLevelEnum.PrintedStationery.label,
    badgeColor: "bg-lime-500/15 text-lime-300 border border-lime-400/40",
  },

  default: {
    label: "",
    badgeColor: "bg-slate-500/15 text-slate-300 border border-slate-400/30",
  },
} as const satisfies Record<string, PurchaseRequestVariants>;

export const purchaseRequestDestinationBadgeVariants = {
  [PurchaseRequestDestinationEnum.Internal.textValue]: {
    label: PurchaseRequestDestinationEnum.Internal.label,
    badgeColor: "bg-indigo-500/15 text-indigo-300 border border-indigo-400/40",
  },

  [PurchaseRequestDestinationEnum.Client.textValue]: {
    label: PurchaseRequestDestinationEnum.Client.label,
    badgeColor: "bg-cyan-500/15 text-cyan-300 border border-cyan-400/40",
  },

  [PurchaseRequestDestinationEnum.ServiceOrder.textValue]: {
    label: PurchaseRequestDestinationEnum.ServiceOrder.label,
    badgeColor:
      "bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-400/40",
  },

  [PurchaseRequestDestinationEnum.OperationalOrder.textValue]: {
    label: PurchaseRequestDestinationEnum.OperationalOrder.label,
    badgeColor: "bg-rose-500/15 text-rose-300 border border-rose-400/40",
  },

  default: {
    label: "",
    badgeColor: "bg-slate-500/15 text-slate-300 border border-slate-400/30",
  },
} as const satisfies Record<string, PurchaseRequestVariants>;
