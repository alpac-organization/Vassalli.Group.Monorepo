import type { IHttpHandler } from "@app/core/ports";
import type { ITerminationServices } from "@app/modules/payroll/application/interfaces/termination-interfaces/ITerminationServices";
import type { CancelTerminationRequest } from "@app/modules/payroll/domain/ApiContract/Requests/termination-requests/cancel-termination.request";
import type { CloseTerminationRequest } from "@app/modules/payroll/domain/ApiContract/Requests/termination-requests/close-termination.request";
import type { GetTerminationDetailsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/termination-requests/get-termination-details.request";
import type { GetTerminationsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/termination-requests/get-terminations.request";
import type { RegisterTerminationRequest } from "@app/modules/payroll/domain/ApiContract/Requests/termination-requests/register-termination.request";
import type {
  GetTerminationsResponse,
  TerminationDetailDto,
} from "@app/modules/payroll/domain/ApiContract/Responses/termination-responses/get-terminations.response";
import { cleanParams } from "@app/shared/utils/object.utils";

export class TerminationServices implements ITerminationServices {
  private readonly httpHandler: IHttpHandler;

  constructor(httpHandler: IHttpHandler) {
    this.httpHandler = httpHandler;
  }

  async getTerminations(payload: GetTerminationsRequest): Promise<GetTerminationsResponse> {
    const { company_id, module_code, ...rest } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/collaborator-termination`;
    return this.httpHandler.get<GetTerminationsResponse>(url, {
      params: cleanParams(rest),
    });
  }

  async getTerminationDetails(
    payload: GetTerminationDetailsRequest,
  ): Promise<TerminationDetailDto> {
    const { company_id, module_code, termination_id } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/collaborator-termination/${termination_id}`;
    return this.httpHandler.get<TerminationDetailDto>(url);
  }

  async registerTermination(payload: RegisterTerminationRequest): Promise<void> {
    const { company_id, module_code, ...rest } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/collaborator-termination`;
    await this.httpHandler.post<void>(url, rest);
  }

  async closeTermination(payload: CloseTerminationRequest): Promise<void> {
    const { company_id, module_code, termination_id, ...rest } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/collaborator-termination/${termination_id}/close`;
    await this.httpHandler.patch<void>(url, rest);
  }

  async cancelTermination(payload: CancelTerminationRequest): Promise<void> {
    const { company_id, module_code, termination_id, ...rest } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/collaborator-termination/${termination_id}/cancel`;
    await this.httpHandler.patch<void>(url, rest);
  }
}
