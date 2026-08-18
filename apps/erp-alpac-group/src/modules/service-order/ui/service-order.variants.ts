import { ServiceOrderStatusEnum } from "@app/modules/service-order/domain/enums/service-order-status.enum";
import type { ServiceOrderVariants } from "./service-order.types";

export const serviceOrderStatusBadgeVariants = {
   [ServiceOrderStatusEnum.Pending.textValue]: {
      label: ServiceOrderStatusEnum.Pending.label,
      badgeColor: "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200",
   },
   [ServiceOrderStatusEnum.InProgress.textValue]: {
      label: ServiceOrderStatusEnum.InProgress.label,
      badgeColor: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200",
   },
   [ServiceOrderStatusEnum.Completed.textValue]: {
      label: ServiceOrderStatusEnum.Completed.label,
      badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
   },
   [ServiceOrderStatusEnum.Canceled.textValue]: {
      label: ServiceOrderStatusEnum.Canceled.label,
      badgeColor: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200",
   },
   default: { label: "", badgeColor: "bg-slate-100 text-slate-800" },
} as const satisfies Record<string, ServiceOrderVariants>;
