import { httpHandler } from "@app/core/adapters";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { ApplyPersonnelActionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/personnel-action-requests/apply-personnel-action.request";
import type { CreatePersonnelActionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/personnel-action-requests/create-personnel-action.request";
import type { GetPersonnelActionByIdRequest } from "@app/modules/payroll/domain/ApiContract/Requests/personnel-action-requests/get-personnel-action-by-id.request";
import type { GetPersonnelActionsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/personnel-action-requests/get-personnel-actions.request";
import type { ReviewPersonnelActionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/personnel-action-requests/review-personnel-action.request";
import type { PersonnelActionRequestDetailDto } from "@app/modules/payroll/domain/ApiContract/Responses/personnel-action-responses/get-personnel-action-detail.response";
import type { GetPersonnelActionsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/personnel-action-responses/get-personnel-actions.response";
import { PersonnelActionServices } from "@app/modules/payroll/infrastructure/services/personnel-action-services/PersonnelActionServices";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";

const personnelActionServices = new PersonnelActionServices(httpHandler);

const PERSONNEL_ACTIONS_STALE_TIME = 1000 * 60 * 2; // 2 minutes

export type UsePersonnelActionProps = {
  requestsFilters?: GetPersonnelActionsRequest;
  requestDetailFilters?: GetPersonnelActionByIdRequest;
};

const isActionsListEnabled = (filters?: GetPersonnelActionsRequest) =>
  Boolean(
    filters?.company_id?.trim() &&
      filters.module_code?.trim() &&
      filters.page_number,
  );

const isActionDetailEnabled = (filters?: GetPersonnelActionByIdRequest) =>
  Boolean(
    filters?.company_id?.trim() &&
      filters.module_code?.trim() &&
      filters.request_id?.trim(),
  );

const createPersonnelActionMutationOptions = (queryClient: QueryClient) => ({
  mutationKey: ["create-personnel-action"] as const,
  mutationFn: (payload: CreatePersonnelActionRequest) =>
    personnelActionServices.createPersonnelAction(payload),
  onSuccess() {
    queryClient.invalidateQueries({
      queryKey: ["personnel-actions"],
      refetchType: "all",
    });
  },
  retry: 1,
});

const reviewPersonnelActionMutationOptions = (queryClient: QueryClient) => ({
  mutationKey: ["review-personnel-action"] as const,
  mutationFn: (payload: ReviewPersonnelActionRequest) =>
    personnelActionServices.reviewPersonnelAction(payload),
  onSuccess() {
    queryClient.invalidateQueries({
      queryKey: ["personnel-actions"],
      refetchType: "all",
    });
    queryClient.invalidateQueries({
      queryKey: ["personnel-action-detail"],
      refetchType: "all",
    });
  },
  retry: 1,
});

const applyPersonnelActionMutationOptions = (queryClient: QueryClient) => ({
  mutationKey: ["apply-personnel-action"] as const,
  mutationFn: (payload: ApplyPersonnelActionRequest) =>
    personnelActionServices.applyPersonnelAction(payload),
  onSuccess() {
    queryClient.invalidateQueries({
      queryKey: ["personnel-actions"],
      refetchType: "all",
    });
    queryClient.invalidateQueries({
      queryKey: ["personnel-action-detail"],
      refetchType: "all",
    });
  },
  retry: 1,
});

export const usePersonnelAction = (props?: UsePersonnelActionProps) => {
  const queryClient = useQueryClient();

  const { requestsFilters, requestDetailFilters } = props || {};

  const GetPersonnelActions = useQuery<
    GetPersonnelActionsResponse,
    ApiErrorResponse
  >({
    queryKey: ["personnel-actions", requestsFilters],
    queryFn: () => personnelActionServices.getPersonnelActions(requestsFilters!),
    staleTime: PERSONNEL_ACTIONS_STALE_TIME,
    enabled: isActionsListEnabled(requestsFilters),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const GetPersonnelActionDetail = useQuery<
    PersonnelActionRequestDetailDto,
    ApiErrorResponse
  >({
    queryKey: ["personnel-action-detail", requestDetailFilters?.request_id],
    queryFn: () =>
      personnelActionServices.getPersonnelActionById(requestDetailFilters!),
    staleTime: PERSONNEL_ACTIONS_STALE_TIME,
    enabled: isActionDetailEnabled(requestDetailFilters),
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const CreatePersonnelAction = useMutation<
    void,
    ApiErrorResponse,
    CreatePersonnelActionRequest
  >(createPersonnelActionMutationOptions(queryClient));

  const ReviewPersonnelAction = useMutation<
    void,
    ApiErrorResponse,
    ReviewPersonnelActionRequest
  >(reviewPersonnelActionMutationOptions(queryClient));

  const ApplyPersonnelAction = useMutation<
    void,
    ApiErrorResponse,
    ApplyPersonnelActionRequest
  >(applyPersonnelActionMutationOptions(queryClient));

  return {
    GetPersonnelActions,
    GetPersonnelActionDetail,
    CreatePersonnelAction,
    ReviewPersonnelAction,
    ApplyPersonnelAction,
  };
};
