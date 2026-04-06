import { useQuery } from "@tanstack/react-query";
import { CollaboratorServices } from "@app/modules/payroll/infraestructure/services/CollaboratorServices";
import { httpHandler } from "@app/core/adapters/axiosAdapter";
import type { CollaboratorRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator.request";

const collaboratorServices = new CollaboratorServices(httpHandler);

/**
 * @hook useCollaborators
 * @description Hook para obtener el listado de colaboradores filtrado desde el backend.
 * Usa TanStack Query con el objeto `filters` como parte del `queryKey`, de modo que
 * cualquier cambio en los filtros dispara automáticamente una nueva petición.
 *
 * @param filters - Objeto con los parámetros de filtro: `company_id`, `module_code`,
 * `identification_number`, `branch_id`, `area_id`, `page_number`, `page_size` y `status`.
 *
 * @returns `GetCollaboratorsQuery` — query de TanStack con el estado y datos del listado.
 *
 * @example
 * const { GetCollaboratorsQuery } = useCollaborators({ company_id, module_code, page_number: 1, page_size: 10 });
 * const collaborators = GetCollaboratorsQuery.data?.data ?? [];
 */
export const useCollaborators = function (filters: CollaboratorRequest) {
  const GetCollaboratorsQuery = useQuery({
    queryKey: ["collaboratorData", filters],
    queryFn: () => collaboratorServices.GetCollaborators(filters),
    enabled: !!filters,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });

  return {
    GetCollaboratorsQuery,
  };
};
