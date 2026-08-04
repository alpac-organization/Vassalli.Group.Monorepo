import { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";

export function typeBadgeColor(type: string): string {
	switch (type) {
		case PurchaseRequestEnum.Requisition.textValue:
			return "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200";
		case PurchaseRequestEnum.Eventual.textValue:
			return "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200";
		case PurchaseRequestEnum.Monthly.textValue:
			return "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-200";
		default:
			return "bg-slate-100 text-slate-800";
	}
}
