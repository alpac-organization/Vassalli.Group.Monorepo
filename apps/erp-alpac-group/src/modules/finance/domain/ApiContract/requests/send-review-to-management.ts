export interface SendReviewToManagementRequest {
  company_id: string;
  module_code: string;
  purchase_requests_reviewed_accounting_id: string;
  comments?: string | null;
  is_approved: boolean;
}
