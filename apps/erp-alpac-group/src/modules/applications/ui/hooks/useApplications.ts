import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { ApplicationRequest } from "@app/modules/applications/domain/ApiContract/Requests/application.request"
import { ApplicationServices } from "@app/modules/applications/infrastructure/services/ApplicationServices"
import { httpHandler } from "@app/core/adapters"
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse"
import type { ApplicationProcessRequest } from "../../domain/ApiContract/Requests/application.process.request"

const applicationServices = new ApplicationServices(httpHandler)

/**
 * @hook useApplications
 * @description Hook para obtener el listado de solicitudes filtrado desde el backend.
 * Usa TanStack Query con el objeto `filters` como parte del `queryKey`, de modo que
 * cualquier cambio en los filtros dispara automáticamente una nueva petición.
 * 
 * @param filters - Objeto con los parámetros de filtro: `company_id`, `module_code`,
 * `identification_number`, `branch_id`, `area_id`, `page_number`, `page_size` y `status`.
 * 
 * @returns `GetApplicationsQuery` — query de TanStack con el estado y datos del listado.
 * 
 * @example
 * const { GetApplicationsQuery } = useApplications({ company_id, module_code, page_number: 1, page_size: 10 });
 * const applications = GetApplicationsQuery.data?.data ?? [];
 */
export const useApplications = (filters?: ApplicationRequest, config?: { enabled?: boolean, enabledDetail?: boolean }) => {

   const queryClient = useQueryClient();

   type ApplicationResponse = Awaited<ReturnType<ApplicationServices["GetApplications"]>>;

   type ApplicationDetailResponse = Awaited<ReturnType<ApplicationServices["GetApplicationDetail"]>>;

   type ProcessApplicationResponse = Awaited<ReturnType<ApplicationServices["ProcessApplication"]>>;

   const GetApplicationsQuery = useQuery<ApplicationResponse, ApiErrorResponse>({
      queryKey: ["applicationsData", filters],
      queryFn: () => applicationServices.GetApplications(filters!),
      enabled: config?.enabled !== undefined ? config.enabled : !!filters,
      refetchOnWindowFocus: false,
      staleTime: 0,
      retry: 1,
   })

   const ProcessApplication = useMutation<ProcessApplicationResponse, ApiErrorResponse, ApplicationProcessRequest>({
      mutationFn: (payload: ApplicationProcessRequest) => applicationServices.ProcessApplication(payload),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["applicationsData"] });
         queryClient.invalidateQueries({ queryKey: ["applicationDetailData"] });
      },
   })

   const GetApplicationDetailQuery = useQuery<ApplicationDetailResponse, ApiErrorResponse>({
      queryKey: ["applicationDetailData", filters],
      queryFn: () => applicationServices.GetApplicationDetail(filters!),
      enabled: config?.enabledDetail !== undefined ? config.enabledDetail : !!filters,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 10,
      retry: 1,
   })

   return { GetApplicationsQuery, ProcessApplication, GetApplicationDetailQuery }
}