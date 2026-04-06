/**
 * Vacaciones: mutación de creación y query de saldo y historial (getVacationSaldo y getVacationHistory).
 */
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { httpHandler } from "@app/core/adapters";
import { VacationServices } from "@app/modules/vacations/infrastructure/services/VacantionServices";
import type { CreateVacationRequest } from "@app/modules/vacations/domain/ApiContract/Requests/create-vacation-request";
import type { VacationHistoryRequest } from "@app/modules/vacations/domain/ApiContract/Requests/vacation-history-request";
const vacationServices = new VacationServices(httpHandler);
export type UseVacationPayload = {
  company_id: string;
  module_code: string;
  identification_number: string;
};
export const useVacation = (
  payload?: UseVacationPayload,
  filters?: VacationHistoryRequest,
) => {
  const queryClient = useQueryClient();

  const createVacationRequestMutation = useMutation({
    mutationKey: ["createVacationRequest"],
    mutationFn: (payload: CreateVacationRequest) =>
      vacationServices.createVacationRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vacationRequests"] });
      queryClient.invalidateQueries({ queryKey: ["vacationSaldo"] });
      queryClient.invalidateQueries({ queryKey: ["vacationHistory"] });
    },
  });

  const saldoQueryEnabled = Boolean(
    payload?.company_id &&
      payload?.module_code &&
      payload?.identification_number,
  );

  const historyQueryEnabled = Boolean(
    filters?.companie_id &&
      filters?.module_code &&
      filters?.identification_number,
  );

  const GetVacationSaldoQuery = useQuery({
    queryKey: ["vacationSaldo", payload] as const,
    queryFn: () => {
      if (!payload) {
        throw new Error("getVacationSaldo: faltante payload");
      }
      return vacationServices.getVacationSaldo(payload);
    },
    enabled: saldoQueryEnabled,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });

  const GetVacationHistory = useQuery({
    queryKey: ["vacationHistory", filters],
    queryFn: () => {
      if (!filters) {
        throw new Error("getVacationHistory: faltante filters");
      }
      return vacationServices.getVacationHistory(filters);
    },
    enabled: historyQueryEnabled,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
  return {
    createVacationRequestMutation,
    GetVacationSaldoQuery,
    GetVacationHistory,
  };
};
