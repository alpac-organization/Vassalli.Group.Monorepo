import type { GetRacksRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-racks";
import type { RackStatusValue } from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-status";
import type { RackUsageProfileValue } from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-usage-profile";
import type { RackFilters } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/types/racks.types";

export function filtersToGetRacksParams(
  filters: RackFilters,
): Pick<GetRacksRequest, "level_number" | "status" | "usage_profile"> {
  const level = filters.level.trim();
  const levelNumber = level ? Number(level) : null;

  return {
    level_number:
      levelNumber != null && !Number.isNaN(levelNumber) ? levelNumber : null,
    status: (filters.status || null) as RackStatusValue | null,
    usage_profile: (filters.usage || null) as RackUsageProfileValue | null,
  };
}
