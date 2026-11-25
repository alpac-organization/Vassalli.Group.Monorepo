import type { IHttpHandler } from "@app/core/ports";
import type { IPersonnelActionService } from "@app/modules/payroll/application/interfaces/personnel-action-interfaces/IPersonnelActionService";
import type { ApplyPersonnelActionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/personnel-action-requests/apply-personnel-action.request";
import type { CreatePersonnelActionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/personnel-action-requests/create-personnel-action.request";
import type { GetPersonnelActionByIdRequest } from "@app/modules/payroll/domain/ApiContract/Requests/personnel-action-requests/get-personnel-action-by-id.request";
import type { GetPersonnelActionsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/personnel-action-requests/get-personnel-actions.request";
import type { ReviewPersonnelActionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/personnel-action-requests/review-personnel-action.request";
import type { PersonnelActionRequestDetailDto } from "@app/modules/payroll/domain/ApiContract/Responses/personnel-action-responses/get-personnel-action-detail.response";
import type { GetPersonnelActionsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/personnel-action-responses/get-personnel-actions.response";
import { cleanParams } from "@app/shared/utils/object.utils";

export class PersonnelActionServices implements IPersonnelActionService {
  private readonly httpHandler: IHttpHandler;

  constructor(httpHandler: IHttpHandler) {
    this.httpHandler = httpHandler;
  }

  async getPersonnelActions(
    payload: GetPersonnelActionsRequest,
  ): Promise<GetPersonnelActionsResponse> {
    const { company_id, module_code, ...rest } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/personnel-action-requests`;
    return await this.httpHandler.get<GetPersonnelActionsResponse>(url, {
      params: cleanParams(rest),
    });
  }

  async getPersonnelActionById(
    payload: GetPersonnelActionByIdRequest,
  ): Promise<PersonnelActionRequestDetailDto> {
    const { company_id, module_code, request_id } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/personnel-action-requests/${request_id}`;
    return await this.httpHandler.get<PersonnelActionRequestDetailDto>(url);
  }

  async createPersonnelAction(
    payload: CreatePersonnelActionRequest,
  ): Promise<void> {
    const { company_id, module_code, ...rest } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/personnel-action-requests`;
    await this.httpHandler.post<void>(url, rest);
  }

  async reviewPersonnelAction(
    payload: ReviewPersonnelActionRequest,
  ): Promise<void> {
    const { company_id, module_code, request_id, ...rest } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/personnel-action-requests/${request_id}/review`;
    await this.httpHandler.patch<void>(url, rest);
  }

  async applyPersonnelAction(
    payload: ApplyPersonnelActionRequest,
  ): Promise<void> {
    const { company_id, module_code, request_id } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/personnel-action-requests/${request_id}/apply`;
    await this.httpHandler.post<void>(url, {});
  }
}
