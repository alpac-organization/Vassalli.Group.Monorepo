import { httpHandler } from "@app/core/adapters";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { ApplyAbsenceRequest } from "@app/modules/payroll/domain/ApiContract/Requests/absence-requests/apply-absence.request";
import type { CancelAbsenceRequest } from "@app/modules/payroll/domain/ApiContract/Requests/absence-requests/cancel-absence.request";
import type { DeleteAbsenceRequest } from "@app/modules/payroll/domain/ApiContract/Requests/absence-requests/delete-absence.request";
import type { GetAbsenceDetailsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/absence-requests/get-absence-details.request";
import type { GetAbsencesRequest } from "@app/modules/payroll/domain/ApiContract/Requests/absence-requests/get-absences.request";
import type { RegisterAbsenceRequest } from "@app/modules/payroll/domain/ApiContract/Requests/absence-requests/register-absence.request";
import { AbsenceServices } from "@app/modules/payroll/infrastructure/services/absence-services/AbsenceServices";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";

const absenceServices = new AbsenceServices(httpHandler);

const ABSENCES_STALE_TIME = 1000 * 60 * 2;

export type UseAbsenceProps = {
  absencesFilters?: GetAbsencesRequest;
  absenceDetailFilters?: GetAbsenceDetailsRequest;
};

const isAbsencesListEnabled = (filters?: GetAbsencesRequest) =>
  Boolean(
    filters?.company_id?.trim() &&
      filters.module_code?.trim() &&
      filters.page_number,
  );

const isAbsenceDetailsEnabled = (filters?: GetAbsenceDetailsRequest) =>
  Boolean(
    filters?.company_id?.trim() &&
      filters.module_code?.trim() &&
      filters.absence_id,
  );

const absenceDetailsQueryOptions = (filters?: GetAbsenceDetailsRequest) => ({
  queryKey: ["absence-details", filters] as const,
  queryFn: () => absenceServices.getAbsenceDetails(filters!),
  enabled: isAbsenceDetailsEnabled(filters),
  refetchOnWindowFocus: false as const,
  retry: 1,
});

const registerAbsenceMutationOptions = (queryClient: QueryClient) => ({
  mutationKey: ["register-absence"] as const,
  mutationFn: (payload: RegisterAbsenceRequest) =>
    absenceServices.registerAbsence(payload),
  onSuccess() {
    queryClient.invalidateQueries({ queryKey: ["absences"] });
    queryClient.invalidateQueries({ queryKey: ["absence-details"] });
  },
  retry: 1,
});

const applyAbsenceMutationOptions = (queryClient: QueryClient) => ({
  mutationKey: ["apply-absence"] as const,
  mutationFn: (payload: ApplyAbsenceRequest) =>
    absenceServices.applyAbsence(payload),
  onSuccess() {
    queryClient.invalidateQueries({ queryKey: ["absences"] });
    queryClient.invalidateQueries({ queryKey: ["absence-details"] });
    queryClient.invalidateQueries({ queryKey: ["faults"] });
    queryClient.invalidateQueries({ queryKey: ["fault-details"] });
  },
  retry: 1,
});

const cancelAbsenceMutationOptions = (queryClient: QueryClient) => ({
  mutationKey: ["cancel-absence"] as const,
  mutationFn: (payload: CancelAbsenceRequest) =>
    absenceServices.cancelAbsence(payload),
  onSuccess() {
    queryClient.invalidateQueries({ queryKey: ["absences"] });
    queryClient.invalidateQueries({ queryKey: ["absence-details"] });
    queryClient.invalidateQueries({ queryKey: ["faults"] });
    queryClient.invalidateQueries({ queryKey: ["fault-details"] });
  },
  retry: 1,
});

const deleteAbsenceMutationOptions = (queryClient: QueryClient) => ({
  mutationKey: ["delete-absence"] as const,
  mutationFn: (payload: DeleteAbsenceRequest) =>
    absenceServices.deleteAbsence(payload),
  onSuccess() {
    queryClient.invalidateQueries({ queryKey: ["absences"] });
    queryClient.invalidateQueries({ queryKey: ["absence-details"] });
    queryClient.invalidateQueries({ queryKey: ["faults"] });
    queryClient.invalidateQueries({ queryKey: ["fault-details"] });
  },
  retry: 1,
});

export const useAbsencesList = (filters: GetAbsencesRequest) =>
  useQuery({
    queryKey: ["absences", filters],
    queryFn: () => absenceServices.getAbsences(filters),
    staleTime: ABSENCES_STALE_TIME,
    enabled: isAbsencesListEnabled(filters),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });

export const useAbsence = (props?: UseAbsenceProps) => {
  const queryClient = useQueryClient();

  const { absencesFilters, absenceDetailFilters } = props || {};

  const GetAbsences = useQuery({
    queryKey: ["absences", absencesFilters],
    queryFn: () => absenceServices.getAbsences(absencesFilters!),
    staleTime: ABSENCES_STALE_TIME,
    enabled: isAbsencesListEnabled(absencesFilters),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });

  const GetAbsenceDetails = useQuery(
    absenceDetailsQueryOptions(absenceDetailFilters),
  );

  const RegisterAbsence = useMutation<
    void,
    ApiErrorResponse,
    RegisterAbsenceRequest
  >(registerAbsenceMutationOptions(queryClient));

  const ApplyAbsence = useMutation<void, ApiErrorResponse, ApplyAbsenceRequest>(
    applyAbsenceMutationOptions(queryClient),
  );

  const CancelAbsence = useMutation<
    void,
    ApiErrorResponse,
    CancelAbsenceRequest
  >(cancelAbsenceMutationOptions(queryClient));

  const DeleteAbsence = useMutation<
    void,
    ApiErrorResponse,
    DeleteAbsenceRequest
  >(deleteAbsenceMutationOptions(queryClient));

  return {
    GetAbsences,
    GetAbsenceDetails,
    RegisterAbsence,
    ApplyAbsence,
    CancelAbsence,
    DeleteAbsence,
  };
};
