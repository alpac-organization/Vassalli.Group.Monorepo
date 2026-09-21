export interface AcceptOfferPurchaseRequest {
  company_id: string;
  module_code: string;
  quotation_id: string;
  purchase_request_item_id: string;
	supplier_selection_justification: string | null;
	supplier_rejection_justification: string | null;
}
