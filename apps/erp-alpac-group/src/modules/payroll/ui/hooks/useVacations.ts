import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { ControlVacationHistoryRequest } from "@app/modules/payroll/domain/ApiContract/Requests/control-vacations-request";
import { httpHandler } from "@app/core/adapters/axiosAdapter";
import { ControlVacationServices } from "@app/modules/payroll/infrastructure/services/VacationsServices";
import type { ControlVacationGenerateTableReportRequest } from "@app/modules/payroll/domain/ApiContract/Requests/control-vacation-generate-docs-request";
import type { GetReportVacationDocResponse } from "@app/modules/payroll/domain/ApiContract/Responses/get-report-vacation.doc";

const controlVacationServices = new ControlVacationServices(httpHandler);

export interface UserControlVacationPayload {
  company_id: string;
  module_code: string;
  identification_number: string;
}

interface useControlVacationsProps {
  filtersVacations?: ControlVacationHistoryRequest;
  payload?: UserControlVacationPayload;
}

const vacationServices = new ControlVacationServices(httpHandler);

export const useControlVacations = (props: useControlVacationsProps) => {
  const queryClient = useQueryClient();
  const { filtersVacations } = props;

  const GetControlVacationHistoryQuery = useQuery({
    queryKey: ["vacationsHistory", filtersVacations],
    queryFn: () => vacationServices.GetVacations(filtersVacations!),
    enabled: Boolean(filtersVacations),
    placeholderData: keepPreviousData,
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
