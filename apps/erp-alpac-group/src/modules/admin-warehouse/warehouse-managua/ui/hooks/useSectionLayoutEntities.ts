import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { warehouseHttpHandler } from "@app/core/adapters";
import { WarehouseAdminServices } from "@app/modules/admin-warehouse/warehouse-managua/infrastructure/services/WarehouseAdmin";
import type { ExistingEntity } from "@app/modules/admin-warehouse/warehouse-managua/ui/components/layout-builder-2d/layout-builder-2d.types";
import {
  mapLotsToLayoutEntities,
  mapRacksToLayoutEntities,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/components/layout-builder-2d/utils/layout-entity.mapper";
import { LAYOUT_FETCH_PAGE_SIZE } from "@app/modules/admin-warehouse/warehouse-managua/ui/components/layout-builder-2d/layout-builder-2d.constants";

const service = new WarehouseAdminServices(warehouseHttpHandler);

interface Params {
  companyId: string;
  moduleCode: string;
  sectionId: string;
  kind: "lot" | "rack";
  sessionEntities?: ExistingEntity[];
}

const reconcileEntities = (
  fromApi: ExistingEntity[],
  sessionEntities: ExistingEntity[],
) => {
  const identities = new Set(
    fromApi.flatMap((entity) => [
      `id:${entity.id}`,
      entity.name ? `name:${entity.name}` : "",
    ]),
  );
  return [
    ...fromApi,
    ...sessionEntities.filter(
      (entity) =>
        !identities.has(`id:${entity.id}`) &&
        (!entity.name || !identities.has(`name:${entity.name}`)),
    ),
  ];
};

export function useSectionLayoutEntities({
  companyId,
  moduleCode,
  sectionId,
  kind,
  sessionEntities = [],
}: Params) {
  const query = useQuery({
    queryKey: ["section-layout-entities", kind, companyId, moduleCode, sectionId],
    enabled: Boolean(companyId && moduleCode && sectionId),
    refetchOnWindowFocus: false,
    retry: 1,
    queryFn: async () => {
      let pageNumber = 1;
      let total = Number.POSITIVE_INFINITY;
      const records: unknown[] = [];

      while (records.length < total && pageNumber <= 100) {
        const response =
          kind === "lot"
            ? await service.GetLots({
                company_id: companyId,
                module_code: moduleCode,
                section_id: sectionId,
                page_number: pageNumber,
                page_size: LAYOUT_FETCH_PAGE_SIZE,
              })
            : await service.GetRacks({
                company_id: companyId,
                module_code: moduleCode,
                section_id: sectionId,
                level_number: 1,
                usage_profile: null,
                status: null,
                page_number: pageNumber,
                page_size: LAYOUT_FETCH_PAGE_SIZE,
              });
        records.push(...(response.data ?? []));
        total = response.total ?? records.length;
        if (!response.data?.length) break;
        pageNumber += 1;
      }

      return kind === "lot"
        ? mapLotsToLayoutEntities(records as Parameters<typeof mapLotsToLayoutEntities>[0])
        : mapRacksToLayoutEntities(records as Parameters<typeof mapRacksToLayoutEntities>[0]);
    },
  });

  return {
    ...query,
    entities: useMemo(
      () => reconcileEntities(query.data ?? [], sessionEntities),
      [query.data, sessionEntities],
    ),
  };
}
