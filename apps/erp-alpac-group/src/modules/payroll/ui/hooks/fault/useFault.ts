import { httpHandler } from "@app/core/adapters";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { CancelFaultRequest } from "@app/modules/payroll/domain/ApiContract/Requests/disciplinary-requests/cancel-fault.request";
import type { GetFaultCatalogRequest } from "@app/modules/payroll/domain/ApiContract/Requests/disciplinary-requests/get-fault-catalog.request";
import type { GetFaultDetailsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/disciplinary-requests/get-fault-details.request";
import type { GetFaultsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/disciplinary-requests/get-faults.request";
import type { GetSuggestedSanctionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/disciplinary-requests/get-suggested-sanction.request";
import type { RegisterFaultRequest } from "@app/modules/payroll/domain/ApiContract/Requests/disciplinary-requests/register-fault.request";
import { FaultServices } from "@app/modules/payroll/infrastructure/services/fault-services/FaultServices";
import {
   useMutation,
   useQuery,
   useQueryClient,
   type QueryClient,
} from "@tanstack/react-query";

const faultServices = new FaultServices(httpHandler);

const FAULTS_STALE_TIME = 1000 * 60 * 2;

export type UseFaultProps = {
   faultsFilters?: GetFaultsRequest;
   faultDetailFilters?: GetFaultDetailsRequest;
   faultCatalogFilters?: GetFaultCatalogRequest;
   suggestedSanctionFilters?: GetSuggestedSanctionRequest;
};

const isFaultsListEnabled = (filters?: GetFaultsRequest) =>
   Boolean(
      filters?.company_id?.trim() &&
      filters.module_code?.trim() &&
      filters.page_number,
   );

const isFaultDetailsEnabled = (filters?: GetFaultDetailsRequest) =>
   Boolean(
      filters?.company_id?.trim() &&
      filters.module_code?.trim() &&
      filters.fault_id,
   );

const isFaultCatalogEnabled = (filters?: GetFaultCatalogRequest) =>
   Boolean(filters?.company_id?.trim() && filters.module_code?.trim());

const isSuggestedSanctionEnabled = (filters?: GetSuggestedSanctionRequest) =>
   Boolean(
      filters?.company_id?.trim() &&
      filters.module_code?.trim() &&
      filters.fault_id,
   );

const faultDetailsQueryOptions = (filters?: GetFaultDetailsRequest) => ({
   queryKey: ["fault-details", filters] as const,
   queryFn: () => faultServices.getFaultDetails(filters!),
   enabled: isFaultDetailsEnabled(filters),
   refetchOnWindowFocus: false as const,
   retry: 1,
});

const suggestedSanctionQueryOptions = (
   filters?: GetSuggestedSanctionRequest,
) => ({
   queryKey: ["suggested-sanction", filters] as const,
   queryFn: () => faultServices.getSuggestedSanction(filters!),
   enabled: isSuggestedSanctionEnabled(filters),
   refetchOnWindowFocus: false as const,
   retry: 1,
});

const registerFaultsMutationOptions = (queryClient: QueryClient) => ({
   mutationKey: ["register-faults"] as const,
   mutationFn: (payload: RegisterFaultRequest) =>
      faultServices.registerFaults(payload),
   onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["faults"] });
      queryClient.invalidateQueries({ queryKey: ["fault-details"] });
      queryClient.invalidateQueries({ queryKey: ["suggested-sanction"] });
   },
   retry: 1,
});

const cancelFaultMutationOptions = (queryClient: QueryClient) => ({
   mutationKey: ["cancel-fault"] as const,
   mutationFn: (payload: CancelFaultRequest) =>
      faultServices.cancelFault(payload),
   onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["faults"] });
      queryClient.invalidateQueries({ queryKey: ["fault-details"] });
      queryClient.invalidateQueries({ queryKey: ["suggested-sanction"] });
   },
   retry: 1,
});

export const useFaultsList = (filters: GetFaultsRequest) =>
   useQuery({
      queryKey: ["faults", filters],
      queryFn: () => faultServices.getFaults(filters),
      staleTime: FAULTS_STALE_TIME,
      enabled: isFaultsListEnabled(filters),
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
   });

export const useFault = (props?: UseFaultProps) => {
   const queryClient = useQueryClient();

   const {
      faultsFilters,
      faultDetailFilters,
      faultCatalogFilters,
      suggestedSanctionFilters,
   } = props || {};

   const GetFaults = useQuery({
      queryKey: ["faults", faultsFilters],
      queryFn: () => faultServices.getFaults(faultsFilters!),
      staleTime: FAULTS_STALE_TIME,
      enabled: isFaultsListEnabled(faultsFilters),
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
   });

   const GetFaultCatalog = useQuery({
      queryKey: ["fault-catalog", faultCatalogFilters],
      queryFn: () => faultServices.getFaultCatalog(faultCatalogFilters!),
      staleTime: FAULTS_STALE_TIME,
      enabled: isFaultCatalogEnabled(faultCatalogFilters),
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
   });

   const GetFaultDetails = useQuery(
      faultDetailsQueryOptions(faultDetailFilters)
   );

   const GetSuggestedSanction = useQuery(
      suggestedSanctionQueryOptions(suggestedSanctionFilters)
   );

   const RegisterFaults = useMutation<void, ApiErrorResponse, RegisterFaultRequest>(
      registerFaultsMutationOptions(queryClient)
   );

   const CancelFault = useMutation<void, ApiErrorResponse, CancelFaultRequest>(
      cancelFaultMutationOptions(queryClient)
   );

   return {
      GetFaults,
      GetFaultCatalog,
      GetFaultDetails,
      GetSuggestedSanction,
      RegisterFaults,
      CancelFault,
   };
};
