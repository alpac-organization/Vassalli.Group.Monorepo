export interface DeductionDto {
  deduction_id: string;
  type: string | number;
  status: string | number;
  collaborato_fullname?: string;
  identification_number?: string;
}

export interface PagedResponseDeduction<T> {
  data: T[];
  page_number: number;
  page_size: number;
  total_deductions: number;
}

export type GetDeductionsResponse = PagedResponseDeduction<DeductionDto>;
