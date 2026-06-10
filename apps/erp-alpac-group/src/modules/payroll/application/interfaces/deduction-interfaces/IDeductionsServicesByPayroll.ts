import type { GetDeductionsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/deduction-requests/get-deductions.request";
import type { GetDeductionDetailsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/deduction-requests/get-deduction-details.request";
import type { GetDeductionPaymentsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/deduction-requests/get-deduction-payments.request";
import type { GetDeductionsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/deduction-responses/get-deductions.response";
import type { DeductionDetailsDto } from "@app/modules/payroll/domain/ApiContract/Responses/deduction-responses/get-deduction-details.response";
import type { GetDeductionPaymentsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/deduction-responses/get-deduction-payments.response";

export interface IDeductionsServicesByPayroll {
  GetDeductionsByAsync(payload: GetDeductionsRequest): Promise<GetDeductionsResponse>;
  GetDeductionDetailsAsync(payload: GetDeductionDetailsRequest): Promise<DeductionDetailsDto>;
  GetDeductionPaymentsAsync(
    payload: GetDeductionPaymentsRequest,
  ): Promise<GetDeductionPaymentsResponse>;
}
