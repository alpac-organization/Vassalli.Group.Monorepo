import { SPANISH_MONTHS } from "@app/modules/purchasing/ui/pages/purchase-requests/components/reports/purchase-request-consolidated-pdf/constants/purchase-req-consolidated";
import { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";

export function formatFormDate(dateString: string): string {
	if (!dateString) return "";
	const date = new Date(dateString);
	if (Number.isNaN(date.getTime())) return "";

	const day = String(date.getUTCDate()).padStart(2, "0");
	const month = SPANISH_MONTHS[date.getUTCMonth()];
	const year = date.getUTCFullYear();

	return `${day}-${month}-${year}`;
}

export function resolvePeriodLabel(requestType: string): string {
	if (requestType === PurchaseRequestEnum.Monthly.textValue) {
		return PurchaseRequestEnum.Monthly.label;
	}
	if (requestType === PurchaseRequestEnum.Eventual.textValue) {
		return PurchaseRequestEnum.Eventual.label;
	}
	return requestType;
}