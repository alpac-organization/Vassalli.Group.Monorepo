import type {
	PurchaseRequestReturnScope,
	PurchaseRequestReturnSource,
} from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";

const RETURN_SCOPE_LABELS: Record<PurchaseRequestReturnScope, string> = {
	QuotationOnly: "Recotización",
	FullProcess: "Trámite completo",
};

const RETURN_SOURCE_LABELS: Record<PurchaseRequestReturnSource, string> = {
	Accounting: "Contabilidad",
	Management: "Gerencia",
};

export function resolveReturnScopeLabel(
	scope: PurchaseRequestReturnScope | string | null | undefined,
): string {
	if (!scope) return "—";
	return (
		RETURN_SCOPE_LABELS[scope as PurchaseRequestReturnScope] ?? String(scope)
	);
}

export function resolveReturnSourceLabel(
	source: PurchaseRequestReturnSource | string | null | undefined,
): string {
	if (!source) return "—";
	return (
		RETURN_SOURCE_LABELS[source as PurchaseRequestReturnSource] ??
		String(source)
	);
}
