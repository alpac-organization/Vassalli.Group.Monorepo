export interface SendReviewToManagementRequest {
  company_id: string;
  module_code: string;
  requisition_accounting_review_id: string;
  comments?: string | null;
  is_approved: boolean;
}
