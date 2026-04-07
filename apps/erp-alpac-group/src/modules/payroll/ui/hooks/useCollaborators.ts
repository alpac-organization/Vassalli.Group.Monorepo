import { useQuery } from "@tanstack/react-query";
import { httpHandler } from "@app/core/adapters/axiosAdapter";
import type { CollaboratorRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator.request";
import type { CollaboratorProfileDetailsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-profile.request";
import { CollaboratorServices } from "@app/modules/payroll/infraestructure/services/CollaboratorServices";
import type { UpdateCollaboratorRequest } from "@app/modules/payroll/domain/ApiContract/Requests/update-collaborator-request";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
const collaboratorServices = new CollaboratorServices(httpHandler);
export interface useCollaboratorsProps {
  Collaboratorsfilters?: CollaboratorRequest;
  CollaboratorDetailsPayload?: CollaboratorProfileDetailsRequest;
  UpdateCollaboratorDetailsPayload?: UpdateCollaboratorRequest;
}

export const useCollaborators = function (props: useCollaboratorsProps) {
  const {
    Collaboratorsfilters,
    CollaboratorDetailsPayload,
    UpdateCollaboratorDetailsPayload,
  } = props;
  const queryClient = useQueryClient();

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
  const GetProfileDetails = useQuery({
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
    mutationKey: [
      "updateCollaboratorProfileDetails",
      UpdateCollaboratorDetailsPayload,
    ],
    mutationFn: (payload: UpdateCollaboratorRequest) => {
      return collaboratorServices.UpdateCollaboratorProfileDetails(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["collaboratorProfileDetails"],
      });
    },
  });
  return {
    GetCollaboratorsQuery,
    GetProfileDetails,
    UpdateCollaboratorProfileDetails,
  };
};
