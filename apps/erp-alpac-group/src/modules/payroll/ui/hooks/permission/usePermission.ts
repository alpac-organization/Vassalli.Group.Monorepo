import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { httpHandler } from "@app/core/adapters";
import { PermissionServices } from "@app/modules/payroll/infrastructure/services/permission-services/PermissionServices";
import type { CreatePermissionRequestBase } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/create-permission-request";
import type { PermissionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/permission-request";
import type { CancelPermissionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/cancel-permission-request";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";

const permissionServices = new PermissionServices(httpHandler);
export type UseVacationPayload = {
  company_id: string;
  module_code: string;
  identification_number: string;
};
export const usePermission = (filters?: PermissionRequest) => {
  const queryClient = useQueryClient();

  const createPermissionRequestMutation = useMutation({
    mutationKey: ["createVacationRequest"],
    mutationFn: (payload: CreatePermissionRequestBase) =>
      permissionServices.createPermissionRequest(payload),
    onSuccess: () => {
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ["vacationRequests"] }),
        queryClient.invalidateQueries({ queryKey: ["vacationSaldo"] }),
        queryClient.invalidateQueries({ queryKey: ["vacationHistory"] }),
      ]);
    },
  });

  const cancelPermissionRequestMutation = useMutation<
    void,
    ApiErrorResponse,
    CancelPermissionRequest
  >({
    mutationKey: ["cancelPermissionRequest"],
    mutationFn: (payload: CancelPermissionRequest) =>
      permissionServices.cancelPermissionRequest(payload),
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["vacationHistory"] }),
        queryClient.invalidateQueries({ queryKey: ["applicationsData"] }),
        queryClient.invalidateQueries({ queryKey: ["applicationDetailData"] }),
      ]);
    },
  });

  const historyQueryEnabled = Boolean(
    filters?.companie_id && filters?.module_code,
  );

  const GetPermissionHistory = useQuery({
    queryKey: ["vacationHistory", filters],
    queryFn: () => {
      if (!filters) {
        throw new Error("getVacationHistory: faltante filters");
      }
      return permissionServices.getPermissions(filters);
    },
    enabled: historyQueryEnabled,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: 1,
  });
  //   const generatePermissionDocumentMutation = useMutation({
  //     mutationKey: ["generatePermissionDocument"],
  //     mutationFn: (payload: GeneratePermissionDocumentRequest) =>
  //       permissionServices.generatePermissionDocument(payload),
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ["vacationHistory"] });
  //     },
  //   });
  return {
    createPermissionRequestMutation,
    cancelPermissionRequestMutation,
    GetPermissionHistory,
    //  generatePermissionDocumentMutation,
  };
};
