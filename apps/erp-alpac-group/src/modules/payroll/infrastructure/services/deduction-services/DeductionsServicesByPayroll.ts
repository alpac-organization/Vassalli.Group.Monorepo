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
    const {
      company_id,
      module_code,
      type,
      status,
      identification_number,
      has_official_letter,
      page_number,
      page_size,
    } = payload;

    const params: Record<string, string | number | boolean> = {};
    if (type !== undefined && type !== "") params.type = type;
    if (status !== undefined && status !== "") params.status = status;
    if (identification_number !== undefined && identification_number !== "") {
      params.identification_number = identification_number;
    }
    if (typeof has_official_letter === "boolean") {
      params.has_official_letter = has_official_letter;
    }
    if (page_number !== undefined) params.page_number = page_number;
    if (page_size !== undefined) params.page_size = page_size;

    const url = `/companies/${company_id}/modules/${module_code}/deductions`;
    return this.httpHandler.get<GetDeductionsResponse>(url, {
      params,
    });
  }
  async GetDeductionDetailsAsync(
    payload: GetDeductionDetailsRequest,
  ): Promise<DeductionDetailsDto> {
    const { company_id, module_code, deduction_id, identification_number } =
      payload;

    const url = `/companies/${company_id}/modules/${module_code}/deductions/${deduction_id}/details`;

    return this.httpHandler.get<DeductionDetailsDto>(url, {
      params: { identification_number },
    });
  }

  async GetDeductionPaymentsAsync(
    payload: GetDeductionPaymentsRequest,
  ): Promise<GetDeductionPaymentsResponse> {
    const { company_id, module_code, deduction_id, ...queryParams } =
      payload;

    const url = `/companies/${company_id}/modules/${module_code}/deductions/${deduction_id}/payments`;

    return this.httpHandler.get<GetDeductionPaymentsResponse>(
      url,
      { params: queryParams },
    );
  }
}
