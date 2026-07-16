import { StatsCard } from "@alpac/design-system";
import { CircleCheckBig, CircleParking, TruckIcon } from "lucide-react";
import { formatNumber } from "@app/shared/utils/string.utils";
import type { AccessControlStatsProps } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/access-control-stats/types/access-control-stats.types";

export function AccessControlStats({ metrics }: AccessControlStatsProps) {
  const plantaValue =
    metrics.totalesEnPlanta < 10
      ? `0${formatNumber(metrics.totalesEnPlanta.toString())}`
      : formatNumber(metrics.totalesEnPlanta.toString());

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
      <StatsCard
        title="Total ingresos"
        value={formatNumber(metrics.totalIngresos.toString())}
        trend="Unidades ingresadas a plantel"
        icon={<TruckIcon size={30} />}
        borderColor="border-red-600! dark:border-red-500!"
      />
      <StatsCard
        title="Totales en Planta"
        value={plantaValue}
        trend="Unidades en plantel"
        icon={<CircleParking size={30} />}
        borderColor="border-yellow-600! dark:border-yellow-500!"
      />
      <StatsCard
        title="Total despachados"
        value={formatNumber(metrics.totalDespachados.toString())}
        trend="Unidades registradas con salidas"
        icon={<CircleCheckBig size={30} />}
        borderColor="border-green-800! dark:border-green-600!"
      />
    </div>
  );
}
