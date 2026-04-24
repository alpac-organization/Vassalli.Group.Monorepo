import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AddCollaboratorRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-requests/add-collaborator.request";
import { CollaboratorServices } from "@app/modules/payroll/infrastructure/services/collaborator-services/CollaboratorServices";
import { httpHandler } from "@app/core/adapters/axiosAdapter";

const collaboratorServices = new CollaboratorServices(httpHandler);

export const useCreateCollaborators = () => {
  const queryClient = useQueryClient();

  const PostCollaboratorQuery = useMutation({
    mutationKey: ["create-collaborator"],
    mutationFn: (payload: AddCollaboratorRequest) =>
      collaboratorServices.PostCollaborator(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collaboratorData"] });
    },
    retry: 1,
  });

  return {
    PostCollaboratorQuery,
  };
};
