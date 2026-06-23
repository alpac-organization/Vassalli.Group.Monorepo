import { cleanParams } from "@app/shared/utils/object.utils";
import type { ICollaboratorServices } from "@app/modules/payroll/application/interfaces/collaborator-interfaces/ICollaboratorServices";
import type { GetCollaboratorsListResponse } from "@app/modules/payroll/domain/ApiContract/Responses/collaborator-responses/get-collaborators.response";
import type { IHttpHandler } from "@app/core/ports";
import type { CollaboratorRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-requests/collaborator.request";
import type { AddCollaboratorRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-requests/add-collaborator.request";
import type { CollaboratorProfileDetailsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-requests/collaborator-profile.request";
import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/collaborator-responses/get-collaborator-profile.response";
import type { UpdateCollaboratorProfileDetailsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-requests/update-collaborator-request";
import type { GetCollaboratorProfileGeneratedDocumentParams } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-requests/generated-document.request";
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

   public async PostCollaborator(
      payload: AddCollaboratorRequest,
   ): Promise<void> {
      try {
         const { company_id, module_code, ...rest } = payload;

         await this.apiHandler.post<void>(
            `/companies/${company_id}/modules/${module_code}/collaborators`,
            rest,
         );
      } catch (error) {
         throw error;
      }
   }

   public async GetCollaboratorProfileDetails(
      payload: CollaboratorProfileDetailsRequest,
   ): Promise<GetCollaboratorProfileDetailsResponse> {
      try {
         const response =
            await this.apiHandler.get<GetCollaboratorProfileDetailsResponse>(
               `/companies/${payload.company_id}/modules/${payload.module_code}/collaborators/${payload.identification_number}/details`,
            );
         return response;
      } catch (error) {
         throw error;
      }
   }

   public async UpdateCollaboratorProfileDetails(
      payload: UpdateCollaboratorProfileDetailsRequest,
   ): Promise<void> {
      try {
         const { company_id, module_code, identification_number, ...rest } =
            payload;

         await this.apiHandler.patch<void>(
            `/companies/${company_id}/modules/${module_code}/collaborators/${identification_number}/details`,
            rest,
         );
      } catch (error) {
         throw error;
      }
   }
   
   public async GenerateCollaboratorProfileDocument(
      payload: GetCollaboratorProfileGeneratedDocumentParams,
   ): Promise<Blob> {
      try {
         const { company_id, module_code, identification_number, document_type } =
            payload;
         const blob = await this.apiHandler.get<Blob>(
            `/companies/${company_id}/modules/${module_code}/collaborators/${identification_number}/documents/${document_type}/generator`,
            { responseType: "blob" },
         );
         return blob;
      } catch (error) {
         throw error;
      }
   }
}
