import React from 'react';
import { StatsCard } from '@alpac/design-system';
import { TruckIcon, WeightTildeIcon, CircleCheckBig } from 'lucide-react';
import { formatNumber } from '@app/shared/utils/string.utils';

export const WarehouseStats: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <StatsCard
      title="Total ingresos"
      value={formatNumber('42')}
      trend="Unidades ingresadas a plantel"
      icon={<TruckIcon size={30} />}
      borderColor="border-red-600! dark:border-red-500!"
    />
    <StatsCard
      title="Totales en Planta"
      value={`0${formatNumber('8')}`}
      trend="Unidades en plantel / patio"
      icon={<WeightTildeIcon size={30} />}
      borderColor="border-yellow-600! dark:border-yellow-500!"
    />
    <StatsCard
      title="Total despachados"
      value={formatNumber('20')}
      trend="Unidades registradas con salidas"
      icon={<CircleCheckBig size={30} />}
      borderColor="border-green-800! dark:border-green-600!"
    />
  </div>
);