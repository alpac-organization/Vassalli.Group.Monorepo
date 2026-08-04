import { PurchaseRequestStatusEnum } from "@app/modules/purchasing/domain/enums/purchase-request-status.enum";

export function statusBadgeColor(status: string): string {
	switch (status) {
		case PurchaseRequestStatusEnum.Approved.textValue:
			return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200";
		case PurchaseRequestStatusEnum.Pending.textValue:
			return "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200";
		case PurchaseRequestStatusEnum.Rejected.textValue:
			return "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200";
		case PurchaseRequestStatusEnum.Canceled.textValue:
			return "bg-red-200 text-red-800 dark:bg-red-900/40 dark:text-red-200";
		default:
			return "bg-slate-100 text-slate-800";
	}
}
