import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface UpdateDeductionRequest extends BaseRequest {
  deduction_id: string;
  is_percentage?: boolean;
  percentage?: number | null;
  fixed_amount?: number | null;
  currency?: number;
  deduct_from_salary?: boolean;
  deduct_from_overtime?: boolean;
  deduct_from_christmas_bonus?: boolean;
  deduct_from_liquidation?: boolean;
  seizure_act_number?: string;
  start_date?: string;
  seizure_act_file_base64?: string | null;
  seizure_act_file_name?: string | null;
  beneficiary_name?: string | null;
  description?: string | null;
  status?: number;
}
