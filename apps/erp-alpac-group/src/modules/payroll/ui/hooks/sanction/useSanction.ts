import { httpHandler } from "@app/core/adapters";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { GetSanctionDetailsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/disciplinary-requests/get-sanction-details.request";
import type { GetSanctionsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/disciplinary-requests/get-sanctions.request";
import type { RegisterSanctionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/disciplinary-requests/register-sanction.request";
import { SanctionServices } from "@app/modules/payroll/infrastructure/services/sanction-services/SanctionServices";
import {
   useMutation,
   useQuery,
   useQueryClient,
   type QueryClient,
} from "@tanstack/react-query";

const sanctionServices = new SanctionServices(httpHandler);

const SANCTIONS_STALE_TIME = 1000 * 60 * 2;

export type UseSanctionProps = {
   sanctionsFilters?: GetSanctionsRequest;
   sanctionDetailFilters?: GetSanctionDetailsRequest;
};

const isSanctionsListEnabled = (filters?: GetSanctionsRequest) =>
   Boolean(
      filters?.company_id?.trim() &&
      filters.module_code?.trim() &&
      filters.page_number,
   );

const isSanctionDetailsEnabled = (filters?: GetSanctionDetailsRequest) =>
   Boolean(
      filters?.company_id?.trim() &&
      filters.module_code?.trim() &&
      filters.sanction_id,
   );

const sanctionDetailsQueryOptions = (filters?: GetSanctionDetailsRequest) => ({
   queryKey: ["sanction-details", filters] as const,
   queryFn: () => sanctionServices.getSanctionDetails(filters!),
   enabled: isSanctionDetailsEnabled(filters),
   refetchOnWindowFocus: false as const,
   retry: 1,
});

const registerSanctionMutationOptions = (queryClient: QueryClient) => ({
   mutationKey: ["register-sanction"] as const,
   mutationFn: (payload: RegisterSanctionRequest) =>
      sanctionServices.registerSanction(payload),
   onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["sanctions"] });
      queryClient.invalidateQueries({ queryKey: ["sanction-details"] });
      queryClient.invalidateQueries({ queryKey: ["faults"] });
      queryClient.invalidateQueries({ queryKey: ["fault-details"] });
      queryClient.invalidateQueries({ queryKey: ["suggested-sanction"] });
   },
   retry: 1,
});

export const useSanctionsList = (filters: GetSanctionsRequest) =>
   useQuery({
      queryKey: ["sanctions", filters],
      queryFn: () => sanctionServices.getSanctions(filters),
      staleTime: SANCTIONS_STALE_TIME,
      enabled: isSanctionsListEnabled(filters),
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
   });

export const useSanction = (props?: UseSanctionProps) => {
   const queryClient = useQueryClient();

   const { sanctionsFilters, sanctionDetailFilters } = props || {};

   const GetSanctions = useQuery({
      queryKey: ["sanctions", sanctionsFilters],
      queryFn: () => sanctionServices.getSanctions(sanctionsFilters!),
      staleTime: SANCTIONS_STALE_TIME,
      enabled: isSanctionsListEnabled(sanctionsFilters),
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
   });

   const GetSanctionDetails = useQuery(
      sanctionDetailsQueryOptions(sanctionDetailFilters)
   );

   const RegisterSanction = useMutation<void, ApiErrorResponse, RegisterSanctionRequest>(
      registerSanctionMutationOptions(queryClient)
   );

   return {
      GetSanctions,
      GetSanctionDetails,
      RegisterSanction,
   };
};
