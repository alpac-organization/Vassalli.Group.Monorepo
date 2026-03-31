import { cleanParams } from "@app/shared/utils/object.utils";
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
      const { company_id, module_code, ...rest } = payload;
      const collaborators =
        await this.apiHandler.get<GetCollaboratorsListResponse>(
          `/companies/${company_id}/modules/${module_code}/collaborators`,
          {
            params: cleanParams(rest),
          },
        );
      return collaborators;
    } catch (error) {
      throw error;
    }
  }
}
