export interface ChildSupportDetailDto {
  is_percentage: boolean;
  percentage?: number | null;
  deduct_from_salary: boolean;
  deduct_from_overtime: boolean;
  deduct_from_christmas_bonus: boolean;
  deduct_from_liquidation: boolean;
  seizure_act_number: string;
  start_date: string;
  seizure_act_url?: string | null;
  has_official_letter: boolean;
  official_letter_number?: string | null;
  official_letter_date?: string | null;
  official_letter_url?: string | null;
  beneficiary_name?: string | null;
}

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
  type?: string | number;
  status?: string | number;
  held_payments_count?: number;
  child_support_detail?: ChildSupportDetailDto | null;
}
