import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpHandler } from "@app/core/adapters";
import { VacationServices } from "@app/modules/vacations/infrastructure/services/VacantionRequestServices";
import type { CreateVacationRequest } from "@app/modules/vacations/domain/ApiContract/Requests/create-vacation-request";

const vacationServices = new VacationServices(httpHandler);

export const useCreateVacationRequest = () => {
  const queryClient = useQueryClient();

  const createVacationRequestMutation = useMutation({
    mutationKey: ["createVacationRequest"],
    mutationFn: (payload: CreateVacationRequest) =>
      vacationServices.createVacationRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vacationRequests"] });
    },
  });

  return { createVacationRequestMutation };
};
