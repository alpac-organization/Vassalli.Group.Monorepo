import { MetricCard } from "@alpac/design-system";
import { CircleCheckBig, CircleParking, TruckIcon, Warehouse } from "lucide-react";
import { formatNumber } from "@app/shared/utils/string.utils";
import type { AccessControlStatsProps } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/access-control-stats/types/access-control-stats.types";

export function AccessControlStats({ metrics }: AccessControlStatsProps) {
  const plantaValue = formatNumber(metrics.totalesEnPlanta.toString());

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-4">
      <MetricCard
        title="Total ingresos"
        value={formatNumber(metrics.totalIngresos.toString())}
        trend="Unidades a plantel"
        icon={<TruckIcon size={24} />}
        themeClass="bg-red-500 text-white"
      />
      <MetricCard
        title="Totales en Planta"
        value={plantaValue}
        trend="Unidades al día de hoy"
        icon={<CircleParking size={24} />}
        themeClass="bg-amber-500 text-white"
      />
      <MetricCard
        title="Total despachados"
        value={formatNumber(metrics.totalDespachados.toString())}
        trend="Unidades con salidas"
        icon={<CircleCheckBig size={24} />}
        themeClass="bg-emerald-500 text-white"
      />

      <MetricCard
        title="Contenedores sitio"
        value={formatNumber(metrics.totalContainerEnSitio.toString())}
        trend="Total en sitio"
        icon={<Warehouse size={24} />}
        themeClass="bg-blue-500 text-white"
      />
      <MetricCard
        title="Contenedores fuera"
        value={formatNumber(metrics.totalContainerFuera.toString())}
        trend="Total despachados"
        icon={<CircleCheckBig size={24} />}
        themeClass="bg-gray-500 text-white"
      />
    </div>
  );
}
