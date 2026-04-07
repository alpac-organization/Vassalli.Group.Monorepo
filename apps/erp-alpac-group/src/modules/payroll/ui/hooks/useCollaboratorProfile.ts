import { useQuery } from "@tanstack/react-query";
import { httpHandler } from "@app/core/adapters/axiosAdapter";
import type { CollaboratorRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator.request";
import type { CollaboratorProfileDetailsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-profile.request";
import { CollaboratorServices } from "@app/modules/payroll/infraestructure/services/CollaboratorServices";

const collaboratorServices = new CollaboratorServices(httpHandler);

export interface useCollaboratorsProps {
  Collaboratorsfilters?: CollaboratorRequest;
  ColllaboratorDetailsPayload?: CollaboratorProfileDetailsRequest;
}

export const useCollaborators = function (props: useCollaboratorsProps) {
  const { Collaboratorsfilters, ColllaboratorDetailsPayload } = props;

  // Query para obtener el listado de colaboradores, si y solo si se proporcionan los filtros necesarios
  const GetCollaboratorsQuery = useQuery({
    queryKey: ["collaboratorData", Collaboratorsfilters],
    queryFn: () => collaboratorServices.GetCollaborators(Collaboratorsfilters!),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });

  // Query para obtener los detalles del perfil del colaborador, si y solo si se proporciona el payload necesario
  const GetProfileDetails = useQuery({
    queryKey: ["collaboratorProfileDetails", ColllaboratorDetailsPayload],
    queryFn: () =>
      collaboratorServices.GetCollaboratorProfileDetails(
        ColllaboratorDetailsPayload!,
      ),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });

  return {
    GetCollaboratorsQuery,
    GetProfileDetails,
  };
};
