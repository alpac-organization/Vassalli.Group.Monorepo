import { useQuery } from "@tanstack/react-query";
import type { CatalogRequest } from "@app/modules/catalog/domain/ApiContract/Requests/catalog.request";
import { CatalogServices } from "@app/modules/catalog/infrastructure/services/CatalogServices";
import { httpHandler } from "@app/core/adapters/axiosAdapter";

const catalogServices = new CatalogServices(httpHandler);

type UseCatalogOptions = {
  enabled?: boolean;
};

/**
 * @hook useCatalog
 * @description Hook genérico para obtener el listado de un catálogo desde el backend.
 * Usa TanStack Query para cachear la respuesta por `catalog_type`, evitando
 * peticiones repetidas mientras los datos sigan frescos (10 minutos por defecto).
 *
 * @param payload - Objeto con `company_id` y `catalog_type_id` que identifica el catálogo a cargar.
 * @param options.enabled - Si es false, no dispara la petición (útil para cargar on-demand).
 *
 * @returns `GetCatalogListQuery` — query de TanStack con el estado y datos del catálogo.
 *
 * @example
 * const { GetCatalogListQuery } = useCatalog(
 *   { company_id: companyId, catalog_type_id: CatalogEnum.BANKS },
 *   { enabled: isOpen },
 * );
 */
export const useCatalog = function (
  payload: CatalogRequest,
  options?: UseCatalogOptions,
) {
  const canFetch =
    Boolean(payload.company_id?.trim()) && Boolean(payload.catalog_type_id);
  const enabled = canFetch && (options?.enabled ?? true);

  const GetCatalogListQuery = useQuery({
    queryKey: ["catalog", payload.company_id, payload.catalog_type_id],
    queryFn: () => catalogServices.getCatalogList(payload),
    enabled,
    staleTime: 1000 * 60 * 10,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    GetCatalogListQuery,
  };
};
