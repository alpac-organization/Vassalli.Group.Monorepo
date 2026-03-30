import { useQuery } from "@tanstack/react-query";
import type { CatalogId } from "@app/core/enums/catalog.enum";

/**
 *
 * @param catalogId
 * @returns
 */
export const useCatalog = function (catalogId: CatalogId) {
  const query = useQuery({
    queryKey: ["catalog", catalogId],
    queryFn: async () => {},
    staleTime: 1000 * 60 * 10,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    options: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    query,
  };
};
