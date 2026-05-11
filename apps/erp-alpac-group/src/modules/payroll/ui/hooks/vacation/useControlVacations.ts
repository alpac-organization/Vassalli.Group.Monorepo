import { useQuery } from "@tanstack/react-query";
import type { ControlVacationHistoryRequest } from "@app/modules/payroll/domain/ApiContract/Requests/control-vacation-requests/control-vacations-request";
import { httpHandler } from "@app/core/adapters/axiosAdapter";
import { ControlVacationServices } from "@app/modules/payroll/infrastructure/services/vacation-services/ControlVacationsServices";
import type { GetVacationsListResponse } from "@app/modules/payroll/domain/ApiContract/Responses/control-vacation-responses/get-control-vacations-response";

const controlVacationServices = new ControlVacationServices(httpHandler);

interface useControlVacationsProps {
  filtersVacations?: ControlVacationHistoryRequest;
}

export const useControlVacations = (props: useControlVacationsProps) => {
  const { filtersVacations } = props;

  const GetControlVacationHistoryQuery = useQuery<
    GetVacationsListResponse,
    Error
  >({
    queryKey: ["vacationsHistory", filtersVacations],
    queryFn: () => controlVacationServices.GetVacations(filtersVacations!),
    enabled: Boolean(filtersVacations?.type && filtersVacations?.branch_id),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });

  const getVacationReportData = async (
    payload: ControlVacationHistoryRequest,
  ): Promise<GetVacationsListResponse> =>
    controlVacationServices.GetVacations(payload);

  return {
    GetControlVacationHistoryQuery,
    getVacationReportData,
  };
};
