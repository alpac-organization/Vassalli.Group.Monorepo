import type { accountingReviewStatusType } from "@app/modules/finance/enum/analysis-quotation/accounting-review-status";
export interface GetQuotesAnalysisResponse {
  data: QuoteDetails[];
  page_number: number;
  page_size: number;
  total: number;
}

export interface QuoteDetails {
  requisition_accounting_review_id: string;
  comments: string;
  status: accountingReviewStatusType;
  reviewer_user_information: UserInformation;
  purchase_request: PurchaseRequest;
}

interface UserInformation {
  user_id: string;
  email: string;
  fullname: string;
  picture_url: string;
}

interface PurchaseRequest {
  code: string;
  purchase_request_id: string;
  request_type: "";
  request_date: string;
  revision_date: string;
  observations: string;
  reason_rejection: string;
  branch_information: BranchInformation;
  creator_user_information: UserInformation;
  reviewer_user_information: UserInformation;
  requested_products: RequestedProduct[];
}

interface BranchInformation {
  branch_id: string;
  branch_code: string;
  branch_name: string;
  company_alias: string;
}

interface RequestedProduct {
  has_quotation: boolean;
  quantity: number;
  quantity_unit: number;
  description: string;
  justification: string;
  purchase_request_id: string;
  product_details: ProductDetails;
  unit_measure_information: UnitMeasureInformation;
}

interface ProductDetails {
  product_id: string;
  product_name: string;
  category_information: CategoryInformation;
}

interface CategoryInformation {
  catagory_id: string;
  name: string;
  code: string;
}

interface UnitMeasureInformation {
  code: string;
  name: string;
  symbol: string;
}
