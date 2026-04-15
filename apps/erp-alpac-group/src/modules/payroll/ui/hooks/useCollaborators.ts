import { useQuery } from "@tanstack/react-query";
import { httpHandler } from "@app/core/adapters/axiosAdapter";
import type { CollaboratorRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator.request";
import type { CollaboratorProfileDetailsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-profile.request";
import { CollaboratorServices } from "@app/modules/payroll/infrastructure/services/CollaboratorServices";
import type { UpdateCollaboratorProfileDetailsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/update-collaborator-request";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
const collaboratorServices = new CollaboratorServices(httpHandler);
export interface useCollaboratorsProps {
   Collaboratorsfilters?: CollaboratorRequest;
   CollaboratorDetailsPayload?: CollaboratorProfileDetailsRequest;
}

export const useCollaborators = function (props: useCollaboratorsProps) {

   const queryClient = useQueryClient();

   const { Collaboratorsfilters, CollaboratorDetailsPayload } = props;

   const collaboratorsListEnabled = Boolean(
      Collaboratorsfilters?.company_id?.trim() &&
      Collaboratorsfilters.module_code?.trim(),
   );

   const profileDetailsCanFetch = Boolean(
      CollaboratorDetailsPayload?.company_id?.trim() &&
      CollaboratorDetailsPayload.module_code?.trim() &&
      CollaboratorDetailsPayload.identification_number?.trim(),
   );

   const profileDetailsQueryEnabled = profileDetailsCanFetch &&
      (CollaboratorDetailsPayload?.QueryEnabled ?? true);

   type CollaboratorProfileResponse = Awaited<ReturnType<typeof collaboratorServices.GetCollaboratorProfileDetails>>;

   // Query para obtener el listado de colaboradores, si y solo si se proporcionan los filtros necesarios
   const GetCollaboratorsQuery = useQuery({
      queryKey: ["collaboratorData", Collaboratorsfilters],
      queryFn: () => collaboratorServices.GetCollaborators(Collaboratorsfilters!),
      enabled: collaboratorsListEnabled,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 10,
      retry: 1,
   });

   // Query para obtener los detalles del perfil del colaborador, si y solo si se proporciona el payload necesario
   const GetProfileDetails = useQuery<CollaboratorProfileResponse, ApiErrorResponse>({
      queryKey: ["collaboratorProfileDetails", CollaboratorDetailsPayload],
      queryFn: () => {
         const { QueryEnabled: _qe, ...apiPayload } = CollaboratorDetailsPayload!;
         return collaboratorServices.GetCollaboratorProfileDetails(apiPayload);
      },
      enabled: profileDetailsQueryEnabled,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 10,
      retry: 1,
   });

   const UpdateCollaboratorProfileDetails = useMutation({
      mutationKey: ["updateCollaboratorProfileDetails"],
      mutationFn: (payload: UpdateCollaboratorProfileDetailsRequest) => {
         return collaboratorServices.UpdateCollaboratorProfileDetails(payload);
      },
      onSuccess: (_, _variables) => {
         queryClient.invalidateQueries({
            queryKey: [
               "collaboratorProfileDetails",
               {
                  company_id: _variables.company_id,
                  module_code: _variables.module_code,
                  identification_number: _variables.identification_number,
               },
            ],
         });
      },
   });

   return {
      GetCollaboratorsQuery,
      GetProfileDetails,
      UpdateCollaboratorProfileDetails,
   };
};
