import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ControlVacationHistoryRequest } from "@app/modules/payroll/domain/ApiContract/Requests/vacation-request";
import { httpHandler } from "@app/core/adapters/axiosAdapter";
import { ControlVacationServices } from "@app/modules/payroll/infrastructure/services/VacationsServices";
import { useMutation } from "@tanstack/react-query";
import type { GeneratePermissionDocumentRequest } from "@app/modules/vacations/domain/ApiContract/Requests/generate-permission-docs-request";
import type { ControlVacationGenerateRequest } from "../../domain/ApiContract/Requests/vacation-generate-request";

const controlVacationServices = new ControlVacationServices(httpHandler);
export interface UserControlVacationPayload {
  company_id: string;
  module_code: string;
  identification_number: string;
}
interface useControlVacationsProps {
  filtersVacations?: ControlVacationHistoryRequest;
  payloadVacations?: UserControlVacationPayload;
}
const vacationServices = new ControlVacationServices(httpHandler);
export const useControlVacations = (props: useControlVacationsProps) => {
  const queryClient = useQueryClient();
  const { filtersVacations, payloadVacations } = props;
  const GetControlVacationHistoryQuery = useQuery({
    queryKey: ["vacations", filtersVacations],
    queryFn: () => vacationServices.GetVacations(filtersVacations!),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });

  const generateVacationDocumentMutation = useMutation({
    mutationKey: ["generatePermissionDocument", payloadVacations],
    mutationFn: (payload: ControlVacationGenerateRequest) =>
      controlVacationServices.generateControlVacationDocument(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vacationHistory"] });
    },
  });
  return { GetControlVacationHistoryQuery, generateVacationDocumentMutation };
};
