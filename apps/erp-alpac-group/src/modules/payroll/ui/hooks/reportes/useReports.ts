import { httpHandler } from "@app/core/adapters";
import type { GenerateReportRequest } from "@app/modules/payroll/domain/ApiContract/Requests/reports-requests/generate-report-request";
import { ReportsServices } from "@app/modules/payroll/infrastructure/services/reports-services/ReportsServices";
import { useMutation } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
const reportsServices = new ReportsServices(httpHandler);
type UseReportsPayload = {
  payloadReport: GenerateReportRequest;
};

export const useReports = (props: UseReportsPayload) => {
  const queryClient = new QueryClient();
  const { payloadReport } = props;
  const generateReportsMutation = useMutation({
    mutationKey: ["generateReports"],
    mutationFn: () => reportsServices.generateReports(payloadReport),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
  return { generateReportsMutation };
};
