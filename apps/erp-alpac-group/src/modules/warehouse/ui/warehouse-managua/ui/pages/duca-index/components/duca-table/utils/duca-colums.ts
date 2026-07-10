
import React from 'react';
import type { TableColumn } from '@alpac/design-system';
import type { WarehouseItem } from '@app/modules/warehouse/ui/pages/warehouse-managua/context/wareouse-context';

// Función pura para el estado (sin JSX por estar en archivo .ts)
const renderEstado = (item: WarehouseItem) => {
  const className = `px-2 py-1 rounded text-[10px] font-bold ${
    item.estado === 'COMPLETADO'
      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
  }`;
  return React.createElement('span', { className }, item.estado);
};

export const getDucaColumns = (onSelect: (item: WarehouseItem) => void): TableColumn<WarehouseItem>[] => [
  { key: 'osNumber', label: 'Orden Servicio' },
  { key: 'conductor', label: 'Conductor' },
  { key: 'placaCabezal', label: 'Placas' },
  { key: 'consignatario', label: 'Consignatario' },
  {
    key: 'estado',
    label: 'Estado Portón',
    render: renderEstado // Usamos la función definida fuera
  },
  {
    key: 'actions',
    label: 'Acciones',
    render: (item: WarehouseItem) => React.createElement(
      'button',
      {
        onClick: () => onSelect(item),
        className: 'text-cyan-400 hover:text-cyan-300 transition-colors text-xs font-semibold',
      },
      'Gestionar DUCA'
    )
  }
];