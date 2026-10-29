import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpHandler } from "@app/core/adapters";
import { PermissionServices } from "@app/modules/payroll/infrastructure/services/permission-services/PermissionServices";
import type { CreatePermissionPoliciesRequest } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/create-permission-policies";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

const permissionServices = new PermissionServices(httpHandler);

const STALE_TIME_MS = 5 * 60 * 1000;

type UsePermissionPoliciesOptions = {
  enablePolicies?: boolean;
  enableForms?: boolean;
};

export const usePermissionPolicies = (
  context?: BaseRequest,
  options?: UsePermissionPoliciesOptions,
) => {
  const queryClient = useQueryClient();
  const hasContext = Boolean(context?.company_id && context?.module_code);
  const enablePolicies = options?.enablePolicies ?? true;
  const enableForms = options?.enableForms ?? true;

  const policiesQuery = useQuery({
    queryKey: [
      "permissionPolicies",
      context?.company_id,
      context?.module_code,
    ],
    queryFn: () => {
      if (!context?.company_id || !context?.module_code) {
        throw new Error(
          "getPermissionPolicies: faltan company_id/module_code",
        );
      }
      return permissionServices.getPermissionPolicies({
        company_id: context.company_id,
        module_code: context.module_code,
      });
    },
    enabled: hasContext && enablePolicies,
    refetchOnWindowFocus: false,
    staleTime: STALE_TIME_MS,
    retry: 1,
  });

  const formsQuery = useQuery({
    queryKey: [
      "permissionForms",
      context?.company_id,
      context?.module_code,
    ],
    queryFn: () => {
      if (!context?.company_id || !context?.module_code) {
        throw new Error("getPermissionForms: faltan company_id/module_code");
      }
      return permissionServices.getPermissionFormsOptions({
        company_id: context.company_id,
        module_code: context.module_code,
      });
    },
    enabled: hasContext && enableForms,
    refetchOnWindowFocus: false,
    staleTime: STALE_TIME_MS,
    retry: 1,
  });

  const createPermissionPoliciesMutation = useMutation<
    void,
    ApiErrorResponse,
    CreatePermissionPoliciesRequest
  >({
    mutationKey: ["createPermissionPolicies"],
    mutationFn: (payload) =>
      permissionServices.CreatePermissionPolicies(payload),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: [
          "permissionPolicies",
          context?.company_id,
          context?.module_code,
        ],
      });
    },
  });

  return {
    policiesQuery,
    formsQuery,
    createPermissionPoliciesMutation,
  };
};
