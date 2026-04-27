import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ControlVacationHistoryRequest } from "@app/modules/payroll/domain/ApiContract/Requests/control-vacation-requests/control-vacations-request";
import { httpHandler } from "@app/core/adapters/axiosAdapter";
import { ControlVacationServices } from "@app/modules/payroll/infrastructure/services/vacation-services/ControlVacationsServices";
import type { ControlVacationGenerateTableReportRequest } from "@app/modules/payroll/domain/ApiContract/Requests/control-vacation-requests/control-vacation-generate-docs-request";
import type { GetReportVacationDocResponse } from "@app/modules/payroll/domain/ApiContract/Responses/vacation-responses/get-report-vacation.doc";
import type { GetVacationsListResponse } from "@app/modules/payroll/domain/ApiContract/Responses/control-vacation-responses/get-control-vacations-response";

const controlVacationServices = new ControlVacationServices(httpHandler);

interface useControlVacationsProps {
  filtersVacations?: ControlVacationHistoryRequest;
}

export const useControlVacations = (props: useControlVacationsProps) => {
  const queryClient = useQueryClient();
  const { filtersVacations } = props;

  const GetControlVacationHistoryQuery = useQuery<
    GetVacationsListResponse,
    Error
  >({
    queryKey: ["vacationsHistory", filtersVacations],
    queryFn: () => controlVacationServices.GetVacations(filtersVacations!),
    enabled: Boolean(
      filtersVacations?.start_date &&
      filtersVacations?.end_date &&
      filtersVacations.start_date.length > 0 &&
      filtersVacations.end_date.length > 0,
    ),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });

  const generateVacationTableReportMutation = useMutation<
    GetReportVacationDocResponse,
    Error,
    ControlVacationGenerateTableReportRequest
  >({
    mutationKey: ["generateVacationTableReport"],
    mutationFn: (payload: ControlVacationGenerateTableReportRequest) =>
      controlVacationServices.generateVacationTableReport(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vacationsHistory"] });
    },
  });

  return {
    GetControlVacationHistoryQuery,
    generateVacationTableReportMutation,
  };
};
