import type { PurchaseRequestQuotationFile } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";

export interface QuoteQuotationAttachmentsProps {
	images?: PurchaseRequestQuotationFile[] | null;
	documents?: PurchaseRequestQuotationFile[] | null;
}
