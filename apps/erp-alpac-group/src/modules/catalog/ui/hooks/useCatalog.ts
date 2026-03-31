import { useQuery } from "@tanstack/react-query";
import type { CatalogRequest } from "@app/modules/catalog/domain/ApiContract/Requests/catalog.request";
import { CatalogServices } from "@app/modules/catalog/infrastructure/services/CatalogServices";
import { httpHandler } from "@app/core/adapters/axiosAdapter";

const catalogServices = new CatalogServices(httpHandler);

/**
 * @hook useCatalog
 * @description Hook genérico para obtener el listado de un catálogo desde el backend.
 * Usa TanStack Query para cachear la respuesta por `catalog_type`, evitando
 * peticiones repetidas mientras los datos sigan frescos (10 minutos por defecto).
 *
 * @param payload - Objeto con `company_id` y `catalog_type` que identifica el catálogo a cargar.
 *
 * @returns `GetCatalogListQuery` — query de TanStack con el estado y datos del catálogo.
 *
 * @example
 * const { GetCatalogListQuery } = useCatalog({ company_id: "", catalog_type: "" });
 * const options = GetCatalogListQuery.data?.data ?? [];
 */
export const useCatalog = function (payload: CatalogRequest) {
  const GetCatalogListQuery = useQuery({
    queryKey: ["catalog", payload],
    queryFn: () => catalogServices.getCatalogList(payload),
    staleTime: 1000 * 60 * 10,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    GetCatalogListQuery,
  };
};
