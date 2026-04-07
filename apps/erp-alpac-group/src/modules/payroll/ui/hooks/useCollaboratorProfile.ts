import { useQuery } from "@tanstack/react-query";
import { CollaboratorProfileServices } from "@app/modules/payroll/infrastructure/services/Collaborator-profileServices";

import { httpHandler } from "@app/core/adapters/axiosAdapter";
import type { CollaboratorProfileDetailsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-profile.request";

const collaboratorProfileServices = new CollaboratorProfileServices(
   httpHandler,
);

export const useCollaboratorProfileDetails = (
   payload: CollaboratorProfileDetailsRequest,
   enabled = true,
) => {
   const canFetch = Boolean(
      payload.company_id?.trim() &&
      payload.module_code?.trim() &&
      payload.identification_number?.trim(),
   );

   const GetProfileDetails = useQuery({
      queryKey: ["collaboratorProfileDetails", payload],
      queryFn: () =>
         collaboratorProfileServices.GetCollaboratorProfileDetails(payload),
      enabled: enabled && canFetch,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 10,
      retry: 1,
   });
   return { GetProfileDetails };
};
