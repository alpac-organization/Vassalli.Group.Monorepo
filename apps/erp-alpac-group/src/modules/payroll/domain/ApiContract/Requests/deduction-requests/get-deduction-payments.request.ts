export interface GetDeductionPaymentsRequest {
  companie_id: string;
  module_code: string;
  deduction_id: string;
  page_number?: number;
  page_size?: number;
}
