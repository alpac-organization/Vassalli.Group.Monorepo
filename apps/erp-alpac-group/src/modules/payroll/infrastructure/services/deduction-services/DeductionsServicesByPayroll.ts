import type { IHttpHandler } from "@app/core/ports";
import type { IDeductionsServicesByPayroll } from "@app/modules/payroll/application/interfaces/deduction-interfaces/IDeductionsServicesByPayroll";
import type { GetDeductionsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/deduction-requests/get-deductions.request";
import type { GetDeductionDetailsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/deduction-requests/get-deduction-details.request";
import type { GetDeductionPaymentsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/deduction-requests/get-deduction-payments.request";
import type { GetDeductionsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/deduction-responses/get-deductions.response";
import type { DeductionDetailsDto } from "@app/modules/payroll/domain/ApiContract/Responses/deduction-responses/get-deduction-details.response";
import type { GetDeductionPaymentsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/deduction-responses/get-deduction-payments.response";

export class DeductionsServicesByPayroll implements IDeductionsServicesByPayroll {
  private readonly httpHandler: IHttpHandler;

  constructor(httpHandler: IHttpHandler) {
    this.httpHandler = httpHandler;
  }

  async GetDeductionsByAsync(
    payload: GetDeductionsRequest,
  ): Promise<GetDeductionsResponse> {
    try {
      const { companie_id, module_code, ...queryParams } = payload;
      const url = `/companies/${companie_id}/modules/${module_code}/deductions`;
      const response = await this.httpHandler.get<GetDeductionsResponse>(url, {
        params: queryParams,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
  async GetDeductionDetailsAsync(
    payload: GetDeductionDetailsRequest,
  ): Promise<DeductionDetailsDto> {
    try {
      const { company_id, module_code, deduction_id, identification_number } =
        payload;

      const url = `/companies/${company_id}/modules/${module_code}/deductions/${deduction_id}/details`;

      const response = await this.httpHandler.get<DeductionDetailsDto>(url, {
        params: { identification_number },
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  async GetDeductionPaymentsAsync(
    payload: GetDeductionPaymentsRequest,
  ): Promise<GetDeductionPaymentsResponse> {
    try {
      const { company_id, module_code, deduction_id, ...queryParams } =
        payload;

      const url = `/companies/${company_id}/modules/${module_code}/deductions/${deduction_id}/payments`;

      const response = await this.httpHandler.get<GetDeductionPaymentsResponse>(
        url,
        { params: queryParams },
      );
      console.log(response);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
