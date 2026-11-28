import { httpHandler } from "@app/core/adapters";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { CalculateLiquidationRequest } from "@app/modules/payroll/domain/ApiContract/Requests/liquidation-requests/calculate-liquidation.request";
import type { GetLiquidationsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/liquidation-requests/get-liquidations.request";
import type {
  CancelLiquidationRequest,
  LiquidationActionRequest,
} from "@app/modules/payroll/domain/ApiContract/Requests/liquidation-requests/liquidation-action.request";
import type {
  GetLiquidationsResponse,
  LiquidationDetailDto,
} from "@app/modules/payroll/domain/ApiContract/Responses/liquidation-responses/get-liquidations.response";
import { LiquidationServices } from "@app/modules/payroll/infrastructure/services/liquidation-services/LiquidationServices";
import { useMutation, useQuery, useQueryClient, useQueries } from "@tanstack/react-query";

const liquidationServices = new LiquidationServices(httpHandler);

const ACTIVE_LIQUIDATION_STATUSES = new Set(["Calculated", "Approved", "Paid"]);

const LIQUIDATIONS_QUERY_KEY = "liquidations";
const LIQUIDATION_DETAILS_QUERY_KEY = "liquidation-details";

const isListEnabled = (filters?: GetLiquidationsRequest) =>
  Boolean(filters?.company_id?.trim() && filters.module_code?.trim() && filters.page_number);

const isDetailEnabled = (filters?: LiquidationActionRequest) =>
  Boolean(
    filters?.company_id?.trim() &&
      filters.module_code?.trim() &&
      filters.liquidation_id,
  );

type UseLiquidationProps = {
  liquidationsFilters?: GetLiquidationsRequest;
  liquidationDetailFilters?: LiquidationActionRequest;
};

export const useLiquidation = (props?: UseLiquidationProps) => {
  const queryClient = useQueryClient();
  const listFilters = props?.liquidationsFilters;
  const detailFilters = props?.liquidationDetailFilters;

  const GetLiquidations = useQuery<GetLiquidationsResponse, ApiErrorResponse>({
    queryKey: [LIQUIDATIONS_QUERY_KEY, listFilters],
    queryFn: () => {
      if (!listFilters) {
        return Promise.reject(new Error("Filtros de liquidación no definidos"));
      }
      return liquidationServices.getLiquidations(listFilters);
    },
    enabled: isListEnabled(listFilters),
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const GetLiquidationDetails = useQuery<LiquidationDetailDto, ApiErrorResponse>({
    queryKey: [LIQUIDATION_DETAILS_QUERY_KEY, detailFilters],
    queryFn: () => {
      if (!detailFilters) {
        return Promise.reject(new Error("Detalle de liquidación no definido"));
      }
      return liquidationServices.getLiquidationDetails(detailFilters);
    },
    enabled: isDetailEnabled(detailFilters),
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [LIQUIDATIONS_QUERY_KEY] });
    queryClient.invalidateQueries({ queryKey: [LIQUIDATION_DETAILS_QUERY_KEY] });
  };

  const CalculateLiquidation = useMutation<
    LiquidationDetailDto,
    ApiErrorResponse,
    CalculateLiquidationRequest
  >({
    mutationKey: ["calculate-liquidation"],
    mutationFn: (payload) => liquidationServices.calculateLiquidation(payload),
    onSuccess: invalidate,
  });

  const ApproveLiquidation = useMutation<void, ApiErrorResponse, LiquidationActionRequest>({
    mutationKey: ["approve-liquidation"],
    mutationFn: (payload) => liquidationServices.approveLiquidation(payload),
    onSuccess: invalidate,
  });

  const PayLiquidation = useMutation<void, ApiErrorResponse, LiquidationActionRequest>({
    mutationKey: ["pay-liquidation"],
    mutationFn: (payload) => liquidationServices.payLiquidation(payload),
    onSuccess: invalidate,
  });

  const CancelLiquidation = useMutation<void, ApiErrorResponse, CancelLiquidationRequest>({
    mutationKey: ["cancel-liquidation"],
    mutationFn: (payload) => liquidationServices.cancelLiquidation(payload),
    onSuccess: invalidate,
  });

  return {
    GetLiquidations,
    GetLiquidationDetails,
    CalculateLiquidation,
    ApproveLiquidation,
    PayLiquidation,
    CancelLiquidation,
  };
};

export const useTerminationsWithoutActiveLiquidation = (
  terminationIds: string[],
  companyId: string,
  moduleCode: string,
  enabled: boolean,
) => {
  const queries = useQueries({
    queries: terminationIds.map((terminationId) => ({
      queryKey: [
        LIQUIDATIONS_QUERY_KEY,
        "by-termination",
        companyId,
        moduleCode,
        terminationId,
      ],
      queryFn: () =>
        liquidationServices.getLiquidations({
          company_id: companyId,
          module_code: moduleCode,
          page_number: 1,
          page_size: 5,
          termination_id: terminationId,
        }),
      enabled: enabled && Boolean(companyId.trim() && moduleCode.trim() && terminationId),
      refetchOnWindowFocus: false,
      retry: 1,
    })),
  });

  const withoutActiveLiquidation = new Set<string>();
  terminationIds.forEach((terminationId, index) => {
    const query = queries[index];
    if (query?.isError) {
      withoutActiveLiquidation.add(terminationId);
      return;
    }
    if (!query?.isSuccess) return;
    const hasActiveLiquidation = query.data.data.some((row) =>
      ACTIVE_LIQUIDATION_STATUSES.has(row.status),
    );
    if (!hasActiveLiquidation) withoutActiveLiquidation.add(terminationId);
  });

  return withoutActiveLiquidation;
};
