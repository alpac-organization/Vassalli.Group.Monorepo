import { useMemo } from "react";
import { BODEGA_2_OCCUPANCY_MOCK } from "../data/bodega-2-fiscal.occupancy.mock";
import type { OccupancyMap } from "../types/warehouse-3d.types";

/**
 * Occupancy by location code.
 * v1: static mock. Swap fetcher for React Query / API without changing scene consumers.
 */
export function useWarehouseOccupancy(bodegaId: string | null): {
  locations: OccupancyMap;
  isLoading: boolean;
} {
  const locations = useMemo(() => {
    if (!bodegaId) return {};
    if (bodegaId === "bodega-2-fiscal") return BODEGA_2_OCCUPANCY_MOCK;
    return {};
  }, [bodegaId]);

  return { locations, isLoading: false };
}
