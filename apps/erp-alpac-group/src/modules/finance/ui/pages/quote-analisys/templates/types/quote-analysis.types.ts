import type { RequisitionAccountingReviewDetailsDto } from "@app/modules/finance/domain/ApiContract/responses/quote-analysis-details";
import type { PurchaseRequestProductInformation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";

export type QuoteAnalysisPdfSupplier = {
	supplierId: string;
	name: string;
};

export type QuoteAnalysisPdfItemCell = {
	brand: string;
	unitPrice: string;
	iva: string;
	total: string;
	rawPrice: number;
	rawIva: number;
	rawTotal: number;
};

export type QuoteAnalysisPdfItemRow = {
	quantity: string;
	unitMeasure: string;
	description: string;
	cellsBySupplierId: Record<string, QuoteAnalysisPdfItemCell | null>;
};

export type QuoteAnalysisPdfTotals = {
	subtotal: Record<string, number>;
	iva: Record<string, number>;
	total: Record<string, number>;
};

export type QuoteAnalysisPdfQualitative = {
	delivery: Record<string, string>;
	transport: Record<string, string>;
	warranty: Record<string, string>;
};

export type QuoteAnalysisPdfViewModel = {
	suppliers: QuoteAnalysisPdfSupplier[];
	items: QuoteAnalysisPdfItemRow[];
	totals: QuoteAnalysisPdfTotals;
	qualitative: QuoteAnalysisPdfQualitative;
	selectedSupplierNames: string;
	justification: string;
	elaboratedBy: string;
};

export type QuoteAnalysisPDFProps = {
	detail: RequisitionAccountingReviewDetailsDto;
	products: PurchaseRequestProductInformation[];
	companyLogoUrl?: string;
	elaborationDate?: string;
};

export type TotalsRowKey = keyof QuoteAnalysisPdfTotals;

export type QualitativeRowKey = keyof QuoteAnalysisPdfQualitative;
