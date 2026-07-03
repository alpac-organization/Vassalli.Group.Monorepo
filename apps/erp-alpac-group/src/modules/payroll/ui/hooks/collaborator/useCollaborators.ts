import { useQuery } from "@tanstack/react-query";
import { httpHandler } from "@app/core/adapters/axiosAdapter";
import { CollaboratorServices } from "@app/modules/payroll/infrastructure/services/collaborator-services/CollaboratorServices";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { CollaboratorProfileDocumentEnum } from "@app/modules/payroll/domain/enums/collaborator-enums/collaborator-profile-documents";

import type { CollaboratorRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-requests/collaborator.request";
import type { CollaboratorProfileDetailsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-requests/collaborator-profile.request";
import type { UpdateCollaboratorProfileDetailsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-requests/update-collaborator-request";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { GetCollaboratorProfileGeneratedDocumentParams } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-requests/generated-document.request";
import type { AddCollaboratorRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-requests/add-collaborator.request";
import type { DeactivateCollaboratorRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-requests/deactivate-collaborator.request";

const collaboratorServices = new CollaboratorServices(httpHandler);

interface useCollaboratorsProps {
   Collaboratorsfilters?: CollaboratorRequest;
   CollaboratorDetailsPayload?: CollaboratorProfileDetailsRequest;
}

export const useCollaborators = function (props?: useCollaboratorsProps) {

   const queryClient = useQueryClient();

   const { Collaboratorsfilters, CollaboratorDetailsPayload } = props || {};

   const collaboratorsListEnabled = Boolean(
      Collaboratorsfilters?.company_id?.trim() &&
      Collaboratorsfilters.module_code?.trim(),
   );

   const profileDetailsCanFetch = Boolean(
      CollaboratorDetailsPayload?.company_id?.trim() &&
      CollaboratorDetailsPayload.module_code?.trim() &&
      CollaboratorDetailsPayload.identification_number?.trim(),
   );

   const profileDetailsQueryEnabled =
      profileDetailsCanFetch &&
      (CollaboratorDetailsPayload?.QueryEnabled ?? true);

   type CollaboratorProfileResponse = Awaited<
      ReturnType<typeof collaboratorServices.GetCollaboratorProfileDetails>
   >;

   // Query para obtener el listado de colaboradores, si y solo si se proporcionan los filtros necesarios
   const GetCollaboratorsQuery = useQuery({
      queryKey: ["collaboratorData", Collaboratorsfilters],
      queryFn: () => collaboratorServices.GetCollaborators(Collaboratorsfilters!),
      enabled: collaboratorsListEnabled,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 2,
      retry: 1,
   });

   // Mutation para crear un nuevo colaborador
   const PostCollaboratorQuery = useMutation({
      mutationKey: ["create-collaborator"],
      mutationFn: (payload: AddCollaboratorRequest) =>
         collaboratorServices.PostCollaborator(payload),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["collaboratorData"] });
      },
      retry: 1,
   });

   // Query para obtener los detalles del perfil del colaborador, si y solo si se proporciona el payload necesario
   const GetProfileDetails = useQuery<
      CollaboratorProfileResponse,
      ApiErrorResponse
   >({
      queryKey: ["collaboratorProfileDetails", CollaboratorDetailsPayload],
      queryFn: () => {
         const { QueryEnabled: _qe, ...apiPayload } = CollaboratorDetailsPayload!;
         return collaboratorServices.GetCollaboratorProfileDetails(apiPayload);
      },
      enabled: profileDetailsQueryEnabled,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 2,
      retry: 1,
   });

   const UpdateCollaboratorProfileDetails = useMutation({
      mutationKey: ["updateCollaboratorProfileDetails"],
      mutationFn: (payload: UpdateCollaboratorProfileDetailsRequest) => {
         return collaboratorServices.UpdateCollaboratorProfileDetails(payload);
      },
      onSuccess: (_, _variables) => {
         queryClient.invalidateQueries({
            predicate: (query) => {
               if (query.queryKey[0] !== "collaboratorProfileDetails") return false;
               const key = query.queryKey[1];
               if (!key || typeof key !== "object") return false;
               return (
                  "company_id" in key &&
                  "module_code" in key &&
                  "identification_number" in key &&
                  key.company_id === _variables.company_id &&
                  key.module_code === _variables.module_code &&
                  key.identification_number === _variables.identification_number
               );
            },
         });
      },
   });

   const GenerateCollaboratorProfileDocument = useMutation({
      mutationKey: ["generateCollaboratorProfileDocument"],
      mutationFn: (payload: GetCollaboratorProfileGeneratedDocumentParams) => {
         return collaboratorServices.GenerateCollaboratorProfileDocument(payload);
      },
      onSuccess: (
         blob: Blob,
         variables: GetCollaboratorProfileGeneratedDocumentParams,
      ) => {
         const fileUrl = URL.createObjectURL(blob);
         const link = document.createElement("a");
         link.href = fileUrl;
         link.download = `${CollaboratorProfileDocumentEnum[variables.document_type].label}_${variables.identification_number}.pdf`;

         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
         setTimeout(() => URL.revokeObjectURL(fileUrl), 60_000);
      },
   });

   const DeactivateCollaborator = useMutation<void, ApiErrorResponse, DeactivateCollaboratorRequest>({
      mutationKey: ["deactivate-collaborator"],
      mutationFn: (payload: DeactivateCollaboratorRequest) => collaboratorServices.DeactivateCollaborator(payload),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["collaboratorData"] });
      },
      retryDelay: 2000,
      retry: 1,
   });

   return {
      GetCollaboratorsQuery,
      PostCollaboratorQuery,
      GetProfileDetails,
      GenerateCollaboratorProfileDocument,
      UpdateCollaboratorProfileDetails,
      DeactivateCollaborator
   };
};
