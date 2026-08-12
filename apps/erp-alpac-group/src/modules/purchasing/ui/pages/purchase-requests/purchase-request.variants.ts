
import { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import { PurchaseRequestStatusEnum } from "@app/modules/purchasing/domain/enums/purchase-request-status.enum";
import type { PurchaseRequestVariants } from "./purchase-request.types";

export const purchaseRequestTypeBadgeVariants = {
   [PurchaseRequestEnum.Requisition.textValue]: { label: PurchaseRequestEnum.Requisition.label, badgeColor: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200" },
   [PurchaseRequestEnum.Eventual.textValue]: { label: PurchaseRequestEnum.Eventual.label, badgeColor: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200" },
   [PurchaseRequestEnum.Monthly.textValue]: { label: PurchaseRequestEnum.Monthly.label, badgeColor: "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-200" },
   default: { label: "", badgeColor: "bg-slate-100 text-slate-800" }
} as const satisfies Record<string, PurchaseRequestVariants>;

export const purchaseRequestStatusBadgeVariants = {
   [PurchaseRequestStatusEnum.Approved.textValue]: { label: PurchaseRequestStatusEnum.Approved.label, badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200" },
   [PurchaseRequestStatusEnum.Pending.textValue]: { label: PurchaseRequestStatusEnum.Pending.label, badgeColor: "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200" },
   [PurchaseRequestStatusEnum.Rejected.textValue]: { label: PurchaseRequestStatusEnum.Rejected.label, badgeColor: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200" },
   [PurchaseRequestStatusEnum.Canceled.textValue]: { label: PurchaseRequestStatusEnum.Canceled.label, badgeColor: "bg-red-200 text-red-800 dark:bg-red-900/40 dark:text-red-200" },
   default: { label: "", badgeColor: "bg-slate-100 text-slate-800" }
} as const satisfies Record<string, PurchaseRequestVariants>;