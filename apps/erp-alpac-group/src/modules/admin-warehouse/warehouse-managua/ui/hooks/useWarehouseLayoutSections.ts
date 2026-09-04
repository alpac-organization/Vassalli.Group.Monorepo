import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { warehouseHttpHandler } from "@app/core/adapters";
import { WarehouseAdminServices } from "@app/modules/admin-warehouse/warehouse-managua/infrastructure/services/WarehouseAdmin";
import type { SectionResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-section-res";
import type { SectionDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-section-byId";
import type { ExistingEntity } from "@app/modules/admin-warehouse/warehouse-managua/ui/components/layout-builder-2d/layout-builder-2d.types";
import {
  mapSectionsToLayoutEntities,
  sectionHasSpatialLayout,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/components/layout-builder-2d/utils/layout-entity.mapper";
import { LAYOUT_FETCH_PAGE_SIZE } from "@app/modules/admin-warehouse/warehouse-managua/ui/components/layout-builder-2d/layout-builder-2d.constants";

const warehouseAdminServices = new WarehouseAdminServices(warehouseHttpHandler);

interface UseWarehouseLayoutSectionsParams {
  companyId: string;
  moduleCode: string;
  warehouseId: string;
  sessionEntities?: ExistingEntity[];
}

async function fetchAllWarehouseSections(params: {
  companyId: string;
  moduleCode: string;
  warehouseId: string;
}): Promise<SectionResponse[]> {
  const pageSize = LAYOUT_FETCH_PAGE_SIZE;
  let pageNumber = 1;
  let total = Number.POSITIVE_INFINITY;
  const sections: SectionResponse[] = [];

  while (sections.length < total) {
    const response = await warehouseAdminServices.GetSections({
      company_id: params.companyId,
      module_code: params.moduleCode,
      warehouse_id: params.warehouseId,
      page_number: pageNumber,
      page_size: pageSize,
    });

    const batch = response.data ?? [];
    sections.push(...batch);
    total = typeof response.total === "number" ? response.total : sections.length;

    if (batch.length === 0) break;
    pageNumber += 1;
    if (pageNumber > 100) break;
  }

  return sections;
}

async function hydrateSectionsWithSpatialData(params: {
  companyId: string;
  moduleCode: string;
  warehouseId: string;
  sections: SectionResponse[];
}): Promise<Array<SectionResponse | SectionDto>> {
  const { companyId, moduleCode, warehouseId, sections } = params;

  return Promise.all(
    sections.map(async (section) => {
      if (sectionHasSpatialLayout(section)) return section;

      try {
        return await warehouseAdminServices.GetSectionById({
          company_id: companyId,
          module_code: moduleCode,
          warehouse_id: warehouseId,
          section_id: section.section_id,
        });
      } catch {
        return section;
      }
    }),
  );
}

/**
 * Loads every warehouse section for the 2D plane.
 * Paginates the list endpoint and hydrates missing spatial fields via GetById.
 */
export function useWarehouseLayoutSections({
  companyId,
  moduleCode,
  warehouseId,
  sessionEntities = [],
}: UseWarehouseLayoutSectionsParams) {
  const query = useQuery({
    queryKey: [
      "warehouse-layout-sections",
      companyId,
      moduleCode,
      warehouseId,
    ],
    enabled: Boolean(
      companyId?.trim() && moduleCode?.trim() && warehouseId?.trim(),
    ),
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    retry: 1,
    queryFn: async () => {
      const sections = await fetchAllWarehouseSections({
        companyId,
        moduleCode,
        warehouseId,
      });

      const needsHydration = sections.some(
        (section) => !sectionHasSpatialLayout(section),
      );

      const spatialSources = needsHydration
        ? await hydrateSectionsWithSpatialData({
            companyId,
            moduleCode,
            warehouseId,
            sections,
          })
        : sections;

      return mapSectionsToLayoutEntities(spatialSources);
    },
  });

  const entities = useMemo(() => {
    const fromApi = query.data ?? [];
    const apiIdentities = new Set(
      fromApi.flatMap((entity) => [
        `id:${entity.id}`,
        entity.name ? `name:${entity.name}` : "",
      ]),
    );
    const pendingSession = sessionEntities.filter(
      (entity) =>
        !apiIdentities.has(`id:${entity.id}`) &&
        (!entity.name || !apiIdentities.has(`name:${entity.name}`)),
    );
    return [...fromApi, ...pendingSession];
  }, [query.data, sessionEntities]);

  return {
    entities,
    isPending: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
