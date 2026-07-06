import type { IHttpHandler } from "@app/core/ports";
import type { ISubsidyServices } from "@app/modules/payroll/application/interfaces/subsidy-interfaces/ISubsidyServices";
import type { CreateSubsidyRequest } from "@app/modules/payroll/domain/ApiContract/Requests/subsidy-requests/create-subsidy.request";
import type { GetSubsidyHistoryRequest } from "@app/modules/payroll/domain/ApiContract/Requests/subsidy-requests/get-subsidy-history.request";
import type { GetSubsidyTypesRequest } from "@app/modules/payroll/domain/ApiContract/Requests/subsidy-requests/get-subsidy-types.request";
import type { GetSubsidyHistoryListResponse } from "@app/modules/payroll/domain/ApiContract/Responses/subsidy-responses/get-subsidy-history.response";
import type { GetSubsidyTypesResponse } from "@app/modules/payroll/domain/ApiContract/Responses/subsidy-responses/get-subsidy-types.response";

export class SubsidyServices implements ISubsidyServices {
  private readonly httpHandler: IHttpHandler;

  constructor(httpHandler: IHttpHandler) {
    this.httpHandler = httpHandler;
  }

  public async CreateSubsidy(payload: CreateSubsidyRequest): Promise<void> {
    try {
      const { company_id, module_code, collaborator_id, ...rest } = payload;

      const url = `/companies/${company_id}/modules/${module_code}/collaborators/${collaborator_id}/subsidies`;

      await this.httpHandler.post<void>(url, rest);
    } catch (error) {
      throw error;
    }
  }

  public async GetSubsidyTypes(
    payload: GetSubsidyTypesRequest,
  ): Promise<GetSubsidyTypesResponse> {
    try {
      const { company_id } = payload;

      const url = `/companies/${company_id}/types-subsidy`;

      const response = await this.httpHandler.get<GetSubsidyTypesResponse>(url);

      return response;
    } catch (error) {
      throw error;
    }
  }

  public async GetSubsidyHistory(
    payload: GetSubsidyHistoryRequest,
  ): Promise<GetSubsidyHistoryListResponse> {
    try {
      const { companie_id, module_code, ...queryParams } = payload;

      const url = `/companies/${companie_id}/modules/${module_code}/subsidies`;

      const response = await this.httpHandler.get<GetSubsidyHistoryListResponse>(
        url,
        {
          params: queryParams,
        },
      );

      return response;
    } catch (error) {
      throw error;
    }
  }
}
