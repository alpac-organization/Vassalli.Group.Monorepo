export interface DeductionDetailsDto {
  deduction_id: string;
  currency: string | number;
  description?: string;
  number_fortnights?: number;
  number_fortnights_paid?: number;
  fortnightly_amount?: number;
  fortnightly_amount_in_dollars?: number;
  total_balance?: number;
  total_balance_in_dollars?: number;
  amount_paid?: number;
  amount_paid_in_dollars?: number;
  total_amount: number;
  total_amount_in_dollars: number;
}
