import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { httpHandler } from "@app/core/adapters";
import { PermissionServices } from "@app/modules/payroll/infrastructure/services/permission-services/PermissionServices";
import type { CreatePermissionPoliciesRequest } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/create-permission-policies";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { UpdatePermitTypePolicyRequest } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/update-permit-type-policy";

const permissionServices = new PermissionServices(httpHandler);

const STALE_TIME_MS = 5 * 60 * 1000;
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;

type UsePermissionPoliciesOptions = {
  enablePolicies?: boolean;
  enableForms?: boolean;
};

export type PermissionPoliciesFilters = {
  onlyActive?: boolean;
  permitApplicationType?: number;
  pageNumber?: number;
  pageSize?: number;
};

export const usePermissionPolicies = (
  context?: BaseRequest,
  options?: UsePermissionPoliciesOptions,
  filters?: PermissionPoliciesFilters,
) => {
  const queryClient = useQueryClient();
  const hasContext = Boolean(context?.company_id && context?.module_code);
  const enablePolicies = options?.enablePolicies ?? true;
  const enableForms = options?.enableForms ?? true;
  const pageNumber = filters?.pageNumber ?? DEFAULT_PAGE_NUMBER;
  const pageSize = filters?.pageSize ?? DEFAULT_PAGE_SIZE;
  const policiesQueryKey = [
    "permissionPolicies",
    context?.company_id,
    context?.module_code,
    filters?.onlyActive ?? "default",
    filters?.permitApplicationType ?? "all",
    pageNumber,
    pageSize,
  ] as const;

  const policiesQuery = useQuery({
    queryKey: policiesQueryKey,
    queryFn: () => {
      if (!context?.company_id || !context?.module_code) {
        throw new Error(
          "getPermissionPolicies: faltan company_id/module_code",
        );
      }
      return permissionServices.getPermissionPolicies({
        company_id: context.company_id,
        module_code: context.module_code,
        only_active: filters?.onlyActive,
        permit_application_type: filters?.permitApplicationType,
        page_number: pageNumber,
        page_size: pageSize,
      });
    },
    enabled: hasContext && enablePolicies,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
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

  const invalidatePolicies = () =>
    queryClient.invalidateQueries({
      queryKey: [
        "permissionPolicies",
        context?.company_id,
        context?.module_code,
      ],
    });

  const createPermissionPoliciesMutation = useMutation<
    void,
    ApiErrorResponse,
    CreatePermissionPoliciesRequest
  >({
    mutationKey: ["createPermissionPolicies"],
    mutationFn: (payload) =>
      permissionServices.CreatePermissionPolicies(payload),
    onSuccess: invalidatePolicies,
  });

  const updatePermitTypePolicyMutation = useMutation<
    void,
    ApiErrorResponse,
    UpdatePermitTypePolicyRequest
  >({
    mutationKey: ["update-permit-type-policies"],
    mutationFn: (payload) => permissionServices.updatePermitTypePolicy(payload),
    onSuccess: invalidatePolicies,
  });

  return {
    policiesQuery,
    formsQuery,
    createPermissionPoliciesMutation,
    updatePermitTypePolicyMutation,
  };
};
