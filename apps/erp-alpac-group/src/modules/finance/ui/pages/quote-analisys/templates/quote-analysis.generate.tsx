import { pdf } from "@react-pdf/renderer";
import { warehouseHttpHandler } from "@app/core/adapters/axiosAdapter";
import { QuoteAnalysisServices } from "@app/modules/finance/Infrastructure/services/QuoteAnalysisServices";
import type { RequisitionAccountingReviewDetailsDto } from "@app/modules/finance/domain/ApiContract/responses/quote-analysis-details";
import type { PurchaseRequestProductInformation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import { QuoteAnalysisPDF } from "@app/modules/finance/ui/pages/quote-analisys/templates/quote-analysis";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";

const quoteAnalysisService = new QuoteAnalysisServices(warehouseHttpHandler);

const resolveReviewProducts = (
	detail: RequisitionAccountingReviewDetailsDto,
	fallback: PurchaseRequestProductInformation[] = [],
): PurchaseRequestProductInformation[] =>
	detail.purchase_request?.purchase_request_items?.length
		? detail.purchase_request.purchase_request_items
		: fallback;

export async function generateQuoteAnalysisPdfBlob(
	detail: RequisitionAccountingReviewDetailsDto,
	products: PurchaseRequestProductInformation[] = [],
): Promise<Blob> {
	const companyLogoUrl = useCompanyStore.getState().urlImage;

	return pdf(
		<QuoteAnalysisPDF
			detail={detail}
			products={resolveReviewProducts(detail, products)}
			companyLogoUrl={companyLogoUrl}
		/>,
	).toBlob();
}

export async function openQuoteAnalysisPdf(
	detail: RequisitionAccountingReviewDetailsDto,
	products: PurchaseRequestProductInformation[] = [],
): Promise<void> {
	const blob = await generateQuoteAnalysisPdfBlob(detail, products);
	const url = URL.createObjectURL(blob);
	window.open(url, "_blank");
}

export async function fetchAndOpenQuoteAnalysisPdf(params: {
	companyId: string;
	moduleCode: string;
	purchaseRequestsReviewedAccountingId: string;
}): Promise<void> {
	const detail = await quoteAnalysisService.GetQuoteAnalysisDetails({
		company_id: params.companyId,
		module_code: params.moduleCode,
		purchase_requests_reviewed_accounting_id:
			params.purchaseRequestsReviewedAccountingId,
	});

	if (!detail.purchase_request?.purchase_request_id) {
		throw new Error("No se encontró la solicitud de compra asociada.");
	}

	await openQuoteAnalysisPdf(detail);
}
