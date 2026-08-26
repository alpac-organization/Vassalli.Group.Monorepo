import { useMemo } from "react";
import {
  useQueries,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { warehouseHttpHandler } from "@app/core/adapters";
import { WarehouseServices } from "@app/modules/warehouse/infrastructure/services/warehouse-services/WarehouseServices";
import type { WarehouseDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouses";
import type { GetSubwarehousesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-subwarehouses";
import { buildWarehouseTableRows } from "@app/modules/warehouse/ui/view/warehouse/components/warehouse-table/utils/build-warehouse-table";
import { collectParentIdsToFetch } from "@app/modules/warehouse/ui/view/warehouse/components/warehouse-table/utils/collect-parents";
import type { WarehouseTableRow } from "@app/modules/warehouse/ui/view/warehouse/components/warehouse-table/utils/skeleton-table";
const warehouseServices = new WarehouseServices(warehouseHttpHandler);

interface UseWarehouseTreeProps {
  companyId: string;
  moduleCode: string;
  rootWarehouses: WarehouseDto[];
}

interface UseWarehouseTreeResult {
  rows: WarehouseTableRow[];
  isLoadingChildren: boolean;
}

function getSubwarehouseChildrenMap(
  queryClient: QueryClient,
  companyId: string,
  moduleCode: string,
): Record<string, WarehouseDto[]> {
  const map: Record<string, WarehouseDto[]> = {};
  const entries = queryClient.getQueriesData<GetSubwarehousesResponse>({
    queryKey: ["get-subwarehouses", companyId, moduleCode],
  });

  for (const [queryKey, data] of entries) {
    if (data == null) continue;

    const warehouseId = queryKey[3] as string;
    map[warehouseId] = data.data ?? [];
  }

  return map;
}

export function useWarehouseTree({
  companyId,
  moduleCode,
  rootWarehouses,
}: UseWarehouseTreeProps): UseWarehouseTreeResult {
  const queryClient = useQueryClient();

  const childrenByParentId = getSubwarehouseChildrenMap(
    queryClient,
    companyId,
    moduleCode,
  );

  const parentIdsToFetch = collectParentIdsToFetch(
    rootWarehouses,
    childrenByParentId,
  );

  const subQueries = useQueries({
    queries: parentIdsToFetch.map((warehouse_id: string) => ({
      queryKey: ["get-subwarehouses", companyId, moduleCode, warehouse_id],
      queryFn: () =>
        warehouseServices.GetSubWarehouses({
          company_id: companyId,
          module_code: moduleCode,
          warehouse_id,
        }),
      enabled: Boolean(companyId?.trim() && moduleCode?.trim() && warehouse_id),
      refetchOnWindowFocus: false,
      retry: 1,
    })),
  });

  const loadingParentIds = useMemo(() => {
    const ids = new Set<string>();

    parentIdsToFetch.forEach((warehouseId: string, index: number) => {
      const query = subQueries[index];
      const hasCachedChildren = Boolean(
        childrenByParentId[warehouseId]?.length,
      );

      if (query?.isPending || (query?.isFetching && !hasCachedChildren)) {
        ids.add(warehouseId);
      }
    });

    return ids;
  }, [parentIdsToFetch, subQueries, childrenByParentId]);

  const rows = useMemo(
    () =>
      buildWarehouseTableRows(
        rootWarehouses,
        getSubwarehouseChildrenMap(queryClient, companyId, moduleCode),
        loadingParentIds,
      ),
    [
      rootWarehouses,
      subQueries,
      queryClient,
      companyId,
      moduleCode,
      loadingParentIds,
    ],
  );

  const isLoadingChildren = subQueries.some(
    (query) => query.isPending || query.isFetching,
  );

  return { rows, isLoadingChildren };
}
