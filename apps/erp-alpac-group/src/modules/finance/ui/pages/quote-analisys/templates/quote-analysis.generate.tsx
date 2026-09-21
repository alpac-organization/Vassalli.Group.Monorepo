import { pdf } from "@react-pdf/renderer";
import { warehouseHttpHandler } from "@app/core/adapters/axiosAdapter";
import { QuoteAnalysisServices } from "@app/modules/finance/Infrastructure/services/QuoteAnalysisServices";
import { PurchaseServices } from "@app/modules/purchasing/infrastructure/services/purchase/PurchaseServices";
import type { RequisitionAccountingReviewDetailsDto } from "@app/modules/finance/domain/ApiContract/responses/quote-analysis-details";
import type { PurchaseRequestProductInformation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import { QuoteAnalysisPDF } from "@app/modules/finance/ui/pages/quote-analisys/templates/quote-analysis";

const quoteAnalysisService = new QuoteAnalysisServices(warehouseHttpHandler);
const purchaseServices = new PurchaseServices(warehouseHttpHandler);

export async function generateQuoteAnalysisPdfBlob(
	detail: RequisitionAccountingReviewDetailsDto,
	products: PurchaseRequestProductInformation[],
): Promise<Blob> {
	return pdf(<QuoteAnalysisPDF detail={detail} products={products} />).toBlob();
}

export async function openQuoteAnalysisPdf(
	detail: RequisitionAccountingReviewDetailsDto,
	products: PurchaseRequestProductInformation[],
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

	const purchaseRequestId = detail.purchase_request?.purchase_request_id;
	if (!purchaseRequestId) {
		throw new Error("No se encontró la solicitud de compra asociada.");
	}

	const productsResponse = await purchaseServices.GetPurchaseRequestProducts({
		company_id: params.companyId,
		module_code: params.moduleCode,
		purchase_request_id: purchaseRequestId,
	});

	await openQuoteAnalysisPdf(detail, productsResponse.data ?? []);
}
