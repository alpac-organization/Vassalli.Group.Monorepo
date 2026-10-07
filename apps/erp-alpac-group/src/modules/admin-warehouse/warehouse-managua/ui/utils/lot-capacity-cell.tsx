import type { LotCapacitiesResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-capacities-res";
import {
  formatAreaM2,
  getOccupancyBarColor,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/lot-area.utils";

export function LotCapacityCell({
  capacity,
  isLoading,
}: {
  capacity?: LotCapacitiesResponse;
  isLoading: boolean;
}) {
  if (!capacity) {
    return (
      <span className="text-xs text-slate-500 dark:text-slate-400">
        {isLoading ? "…" : "—"}
      </span>
    );
  }

  const occupancy = Math.min(
    100,
    Math.max(0, 100 - (capacity.percentage_available_area_with_margin_m2 ?? 0)),
  );

  return (
    <div className="flex w-[180px] flex-col gap-1.5">
      <div className="flex justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <span>Total: {formatAreaM2(capacity.total_area_m2)}</span>
        <span>Libre: {formatAreaM2(capacity.available_area_with_margin_m2)}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className={`h-full w-full origin-left rounded-full ${getOccupancyBarColor(occupancy)}`}
          style={{ transform: `scaleX(${occupancy / 100})` }}
        />
      </div>
      <span className="text-xs text-slate-500 dark:text-slate-400">
        Ocupación: {Math.round(occupancy)}%
      </span>
    </div>
  );
}
