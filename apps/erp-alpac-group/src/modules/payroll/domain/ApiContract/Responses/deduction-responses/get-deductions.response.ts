import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";
import type { ChildSupportDetailDto } from "./get-deduction-details.response";

export interface DeductionDto {
  deduction_id: string;
  type: string | number;
  status: string | number;
  collaborato_fullname?: string;
  identification_number?: string;
  currency?: string | number;
  amount_paid?: number | null;
  amount_paid_in_dollars?: number | null;
  held_payments_count?: number;
  child_support_detail?: ChildSupportDetailDto | null;
}

export interface PagedResponseDeduction<T>
  extends Omit<PaginateBaseResponse<T>, "total"> {
  total_deductions: number;
}

export type GetDeductionsResponse = PagedResponseDeduction<DeductionDto>;
