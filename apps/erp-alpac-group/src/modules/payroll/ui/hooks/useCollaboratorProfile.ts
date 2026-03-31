import { useQuery } from "@tanstack/react-query";
import { CollaboratorProfileServices } from "@app/modules/payroll/infraestructure/services/Collaborator-profileServices";

import { httpHandler } from "@app/core/adapters/axiosAdapter";
import type { CollaboratorProfileDetailsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-profile.request";

const collaboratorProfileServices = new CollaboratorProfileServices(
  httpHandler,
);

export const useCollaboratorProfileDetails = (
  payload: CollaboratorProfileDetailsRequest,
) => {
  const GetProfileDetails = useQuery({
    queryKey: ["collaboratorProfileDetails", payload],
    queryFn: () =>
      collaboratorProfileServices.GetCollaboratorProfileDetails(payload),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
  return { GetProfileDetails };
};
