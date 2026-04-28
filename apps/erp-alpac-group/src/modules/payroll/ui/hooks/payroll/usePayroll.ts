import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import { httpHandler } from "@app/core/adapters/axiosAdapter";
import { PayrollServices } from "@app/modules/payroll/infrastructure/services/payroll-services/PayrollServices";
import type { GetPayrollProcessResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-process";
import type { PayrollProcessRequest } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-process.request";
import type { PayrollRequest } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-request";
import type { GetPayrollResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
const payrollServices = new PayrollServices(httpHandler);

/**
 * Define los tipos de propiedades para el hook usePayroll.
 * Permite seleccionar entre dos modos de uso:
 * - "status": para obtener el estado del proceso de dicha nómina, requiere un payload de tipo PayrollProcessRequest.
 * - "ordinary": para obtener información de nómina ordinaria, requiere un payload de tipo OrdinaryPayrollRequest.
 */
export type UsePayrollProps =
  | {
      mode: "status";
      payload: PayrollProcessRequest;
      enabled?: boolean;
    }
  | {
      mode: "details";
      payload: PayrollRequest;
      enabled?: boolean;
    };

/**
 * Hook para obtener el estado del proceso de nómina.
 * Utiliza React Query para manejar la solicitud y el caching.
 *
 * @param props Objeto con el modo "status" y el payload del proceso de nómina.
 * @returns Resultado del query con la respuesta del estado del proceso de nómina.
 */
export function usePayroll(props: {
  mode: "status";
  payload: PayrollProcessRequest;
  enabled?: boolean;
}): UseQueryResult<GetPayrollProcessResponse, Error>;

/**
 * Hook para obtener los detalles de un tipo de nomina y sucursal especifica.
 * Utiliza React Query para manejar la solicitud y el caching de la nómina especifica según los parámetros proporcionados.
 *
 * @param props Objeto con el modo "details" y el payload correspondiente a la solicitud de nómina especifica.
 * @returns Resultado del query con la respuesta de la nómina especifica.
 */
export function usePayroll(props: {
  mode: "details";
  payload: PayrollRequest;
  enabled?: boolean;
}): UseQueryResult<GetPayrollResponse, Error>;

export function usePayroll(props: UsePayrollProps) {
  const isEnabled = props.enabled ?? true;

  if (props.mode === "status") {
    const { companie_id, module_code, payrol_type, branch_id } = props.payload;
    return useQuery<GetPayrollProcessResponse, Error>({
      queryKey: [
        "payrollsStatus",
        companie_id,
        module_code,
        payrol_type,
        branch_id,
      ],
      queryFn: () => payrollServices.getPayrollsProcessStatus(props.payload),
      enabled: isEnabled && Boolean(companie_id && module_code && branch_id),
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    });
  }
  const {
    companie_id,
    module_code,
    type,
    branch_id,
    page_number = 1,
    page_size = 10,
  } = props.payload;
  return useQuery<GetPayrollResponse, Error>({
    queryKey: [
      "detailsPayroll",
      companie_id,
      module_code,
      type,
      branch_id,
      page_number,
      page_size,
    ],
    queryFn: () => payrollServices.getPayroll(props.payload),
    enabled:
      isEnabled && Boolean(companie_id && module_code && type && branch_id),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
