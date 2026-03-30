import type { ICollaboratorServices } from "@app/modules/payroll/application/interfaces/ICollaboratorServices";
import type { GetCollaboratorsListResponse } from "@app/modules/payroll/domain/ApiContract/Responses/get-collaborators.response";
import type { IHttpHandler } from "@app/core/ports";
import type { CollaboratorRequest } from "../../domain/ApiContract/Requests/collaborator.request";

export class CollaboratorServices implements ICollaboratorServices {
  private apiHandler: IHttpHandler;

  constructor(httpHandler: IHttpHandler) {
    this.apiHandler = httpHandler;
  }

  public async GetCollaborators(
    payload: CollaboratorRequest,
  ): Promise<GetCollaboratorsListResponse> {
    try {
      const collaborators =
        await this.apiHandler.get<GetCollaboratorsListResponse>(
          `/companies/${payload.company_id}/modules/${payload.module_code}/collaborators`,
        );
      return collaborators;
    } catch (error) {
      throw error;
    }
  }
}
