import type { PagedResponseDeduction } from "@app/modules/payroll/domain/ApiContract/Responses/deduction-responses/get-deductions.response";

export interface DeductionPaymentDetailsDto {
  payroll_id: string;
  start_date: string;
  end_date: string;
}

export interface DeductionPaymentsDto {
  currency: string | number;
  amount_paid: number;
  amount_paid_in_dollars: number;
  status: string | number;
  origin: string | number;
  deduction_details: DeductionPaymentDetailsDto;
}

export type GetDeductionPaymentsResponse =
  PagedResponseDeduction<DeductionPaymentsDto>;
