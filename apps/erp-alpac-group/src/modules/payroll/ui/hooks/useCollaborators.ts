import { useQuery } from "@tanstack/react-query";
import { CollaboratorServices } from "@app/modules/payroll/infraestructure/services/CollaboratorServices";
import { httpHandler } from "@app/core/adapters/axiosAdapter";
import type { CollaboratorRequest } from "../../domain/ApiContract/Requests/collaborator.request";

const collaboratorServices = new CollaboratorServices(httpHandler);

export const useCollaborators = function (filters: CollaboratorRequest) {
  const GetCollaboratorsQuery = useQuery({
    queryKey: ["collaboratorData", filters],
    queryFn: () => collaboratorServices.GetCollaborators(filters),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });

  return {
    GetCollaboratorsQuery,
  };
};
