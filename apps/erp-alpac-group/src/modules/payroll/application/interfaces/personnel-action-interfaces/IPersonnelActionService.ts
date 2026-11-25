import type { ApplyPersonnelActionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/personnel-action-requests/apply-personnel-action.request";
import type { CreatePersonnelActionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/personnel-action-requests/create-personnel-action.request";
import type { GetPersonnelActionByIdRequest } from "@app/modules/payroll/domain/ApiContract/Requests/personnel-action-requests/get-personnel-action-by-id.request";
import type { GetPersonnelActionsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/personnel-action-requests/get-personnel-actions.request";
import type { ReviewPersonnelActionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/personnel-action-requests/review-personnel-action.request";
import type { PersonnelActionRequestDetailDto } from "@app/modules/payroll/domain/ApiContract/Responses/personnel-action-responses/get-personnel-action-detail.response";
import type { GetPersonnelActionsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/personnel-action-responses/get-personnel-actions.response";

export interface IPersonnelActionService {
  getPersonnelActions(
    payload: GetPersonnelActionsRequest,
  ): Promise<GetPersonnelActionsResponse>;

  getPersonnelActionById(
    payload: GetPersonnelActionByIdRequest,
  ): Promise<PersonnelActionRequestDetailDto>;

  createPersonnelAction(payload: CreatePersonnelActionRequest): Promise<void>;

  reviewPersonnelAction(payload: ReviewPersonnelActionRequest): Promise<void>;

  applyPersonnelAction(payload: ApplyPersonnelActionRequest): Promise<void>;
}
