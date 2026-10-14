import { useQuery } from "@tanstack/react-query";
import type { CatalogRequest } from "@app/modules/catalog/domain/ApiContract/Requests/catalog.request";
import { CatalogServices } from "@app/modules/catalog/infrastructure/services/CatalogServices";
import { httpHandler } from "@app/core/adapters/axiosAdapter";

const catalogServices = new CatalogServices(httpHandler);

type UseCatalogOptions = {
  enabled?: boolean;
};

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
