import type { GenerateReportPayrollRequest } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/generate-report-payroll";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { PayrollServices } from "@app/modules/payroll/infrastructure/services/payroll-services/PayrollServices";
import { httpHandler } from "@app/core/adapters";
import type { GetPayrollReportsPayloadResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-reports";
const payrollServices = new PayrollServices(httpHandler);

type UsePayrollReportsProps = {
  payload: GenerateReportPayrollRequest;
  enabled?: boolean;
};
export function usePayrollReports({
  payload,
  enabled = true,
}: UsePayrollReportsProps): UseQueryResult<
  GetPayrollReportsPayloadResponse,
  Error
> {
  const { companie_id, report_type, payroll_id } = payload;
  return useQuery<GetPayrollReportsPayloadResponse, Error>({
    queryKey: ["payrollReports", companie_id, report_type, payroll_id],
    queryFn: () => payrollServices.generateReportsPayroll(payload),
    enabled: enabled && Boolean(companie_id && report_type && payroll_id),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
