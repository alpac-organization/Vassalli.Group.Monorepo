import {
	PurchaseRequestStatusEnum,
	type PurchaseRequestStatusType,
} from "@app/modules/purchasing/domain/enums/purchase-request-status.enum";
import { purchaseRequestStatusBadgeVariants } from "@app/modules/purchasing/ui/pages/purchase-requests/purchase-request.variants";
import type { PurchaseRequestVariants } from "@app/modules/purchasing/ui/pages/purchase-requests/purchase-request.types";

export type ResolvedPurchaseRequestStatusBadge = PurchaseRequestVariants & {
	status: PurchaseRequestStatusType | string;
};

export const resolvePurchaseRequestStatusBadge = (
	status: string | null | undefined,
): ResolvedPurchaseRequestStatusBadge => {
	const statusKey = status ?? "";
	const enumEntry = Object.values(PurchaseRequestStatusEnum).find(
		(entry) => entry.textValue === statusKey,
	);
	const variant =
		purchaseRequestStatusBadgeVariants[
			statusKey as keyof typeof purchaseRequestStatusBadgeVariants
		] ?? purchaseRequestStatusBadgeVariants.default;

	return {
		status: statusKey,
		label: enumEntry?.label ?? (variant.label || statusKey),
		badgeColor: variant.badgeColor,
	};
};
