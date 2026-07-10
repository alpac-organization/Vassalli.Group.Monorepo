import React, { useMemo } from 'react';
import { StatsCard } from '@alpac/design-system';
import { TruckIcon, CircleCheckBig, CircleParking } from 'lucide-react';
import { formatNumber } from '@app/shared/utils/string.utils';
import { useWarehouse } from '../../../../../context/wareouse-context';

export const WarehouseStats: React.FC = () => {
  const { itemsQueue } = useWarehouse();

  // Ajuste de métricas según la realidad del plantel físico
  const metrics = useMemo(() => {
    const totalIngresos = itemsQueue.length;
    
    // Total despachados = 0 (Unidades que salieron físicamente por portón)
    const totalDespachados = 0; 
    
    // Totales en Planta = Al no haber salidas, el 100% de las unidades ingresadas siguen en patio
    const totalesEnPlanta = totalIngresos - totalDespachados;

    return {
      totalIngresos: totalIngresos.toString(),
      totalesEnPlanta: totalesEnPlanta.toString(),
      totalDespachados: totalDespachados.toString(),
      isEnPlantaSingleDigit: totalesEnPlanta < 10
    };
  }, [itemsQueue]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatsCard
        title="Total ingresos"
        value={formatNumber(metrics.totalIngresos)}
        trend="Unidades ingresadas a plantel"
        icon={<TruckIcon size={30} />}
        borderColor="border-red-600! dark:border-red-500!"
      />
      <StatsCard
        title="Totales en Planta"
        value={
          metrics.isEnPlantaSingleDigit 
            ? `0${formatNumber(metrics.totalesEnPlanta)}` 
            : formatNumber(metrics.totalesEnPlanta)
        }
        trend="Unidades en plantel / patio"
        icon={<CircleParking size={30} />}
        borderColor="border-yellow-600! dark:border-yellow-500!"
      />
      <StatsCard
        title="Total despachados"
        value={formatNumber(metrics.totalDespachados)}
        trend="Unidades registradas con salidas"
        icon={<CircleCheckBig size={30} />}
        borderColor="border-green-800! dark:border-green-600!"
      />
    </div>
  );
};