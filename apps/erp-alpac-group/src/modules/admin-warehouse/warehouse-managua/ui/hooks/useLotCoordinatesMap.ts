import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { warehouseHttpHandler } from "@app/core/adapters";
import { WarehouseAdminServices } from "@app/modules/admin-warehouse/warehouse-managua/infrastructure/services/WarehouseAdminService";
import { useUserStore } from "@app/shared/stores/useUserStore";
import type { LotListItemResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";
import type { LotCoordinatesResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-coordinates-res";

const warehouseAdminServices = new WarehouseAdminServices(warehouseHttpHandler);

interface UseLotCoordinatesMapProps {
  warehouseId: string;
  sectionId: string;
  lots: LotListItemResponse[];
}

export const useLotCoordinatesMap = ({
  warehouseId,
  sectionId,
  lots,
}: UseLotCoordinatesMapProps) => {
  const { companyId, moduleCode } = useUserStore();
  const hasCompanyContext = Boolean(
    companyId?.trim() && moduleCode?.trim() && warehouseId && sectionId,
  );

  const lotIds = useMemo(
    () => lots.map((lot) => lot.id).filter(Boolean),
    [lots],
  );

  const results = useQueries({
    queries: lotIds.map((lotId) => ({
      queryKey: ["get-lot-coordinates-record", lotId],
      queryFn: () =>
        warehouseAdminServices.GetLotCoordinates({
          company_id: companyId,
          module_code: moduleCode,
          warehouse_id: warehouseId,
          section_id: sectionId,
          lot_id: lotId,
        }),
      enabled: hasCompanyContext,
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60,
    })),
  });

  const coordinatesByLotId = useMemo(() => {
    const map: Record<string, LotCoordinatesResponse | undefined> = {};
    lotIds.forEach((lotId, index) => {
      map[lotId] = results[index]?.data;
    });
    return map;
  }, [lotIds, results]);

  const isAnyLoading = results.some((r) => r.isPending);

  return { coordinatesByLotId, isAnyLoading };
};
