import type { IHttpHandler } from "@app/core/ports";
import type { ICollaboratorProfileServices } from "@app/modules/payroll/application/interfaces/ICollaborator-profileServices";
import type { CollaboratorProfileDetailsRequest } from "../../domain/ApiContract/Requests/collaborator-profile.request";
import type { GetCollaboratorProfileDetailsResponse } from "../../domain/ApiContract/Responses/get-collaborator-profile.response";

export class CollaboratorProfileServices
  implements ICollaboratorProfileServices
{
  private apiHandler: IHttpHandler;
  constructor(httpHandler: IHttpHandler) {
    this.apiHandler = httpHandler;
  }
  public async GetCollaboratorProfileDetails(
    payload: CollaboratorProfileDetailsRequest,
  ): Promise<GetCollaboratorProfileDetailsResponse> {
    try {
      const detailProfileCollaborator =
        await this.apiHandler.get<GetCollaboratorProfileDetailsResponse>(
          `/companies/${payload.company_id}/modules/${payload.module_code}/collaborators/${payload.identification_number}/details`,
        );
      return detailProfileCollaborator;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }
}
