/**
 * Vacaciones: mutación de creación y query de saldo y historial (getVacationSaldo y getVacationHistory).
 */
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { httpHandler } from "@app/core/adapters";
import { PermissionServices } from "@app/modules/vacations/infrastructure/services/PermissionServices";
import type { CreatePermissionRequest } from "@app/modules/vacations/domain/ApiContract/Requests/create-permission-request";
import type { PermissionHistoryRequest } from "@app/modules/vacations/domain/ApiContract/Requests/permission-history-request";
import type { CancelPermissionRequest } from "@app/modules/vacations/domain/ApiContract/Requests/cancel-permission-request";
const permissionServices = new PermissionServices(httpHandler);
export type UseVacationPayload = {
  company_id: string;
  module_code: string;
  identification_number: string;
};
export const usePermission = (
  payload?: UseVacationPayload,
  filters?: PermissionHistoryRequest,
) => {
  const queryClient = useQueryClient();

  const createPermissionRequestMutation = useMutation({
    mutationKey: ["createVacationRequest"],
    mutationFn: (payload: CreatePermissionRequest) =>
      permissionServices.createPermissionRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vacationRequests"] });
      queryClient.invalidateQueries({ queryKey: ["vacationSaldo"] });
      queryClient.invalidateQueries({ queryKey: ["vacationHistory"] });
    },
  });

  const cancelPermissionRequestMutation = useMutation({
    mutationKey: ["cancelPermissionRequest"],
    mutationFn: (payload: CancelPermissionRequest) =>
      permissionServices.cancelPermissionRequest(payload),
    onSuccess: () => {
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
      return permissionServices.getVacationSaldo(payload);
    },
    enabled: saldoQueryEnabled,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });

  const GetPermissionHistory = useQuery({
    queryKey: ["vacationHistory", filters],
    queryFn: () => {
      if (!filters) {
        throw new Error("getVacationHistory: faltante filters");
      }
      return permissionServices.getPermissionHistory(filters);
    },
    enabled: historyQueryEnabled,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: 1,
  });
  return {
    createPermissionRequestMutation,
    cancelPermissionRequestMutation,
    GetVacationSaldoQuery,
    GetPermissionHistory,
  };
};
