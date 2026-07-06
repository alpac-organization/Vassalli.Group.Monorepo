import React from 'react';
import { WarehouseProvider } from '@app/modules/warehouse/ui/pages/warehouse-managua-index/context/wareouse-context'; 
import { GuardPanel } from './managua-reception/components/guard-panel/guard-panel';

/**
 * WarehouseManaguaPage
 * Vista enfocada exclusivamente en el control de acceso y movimientos.
 */
export const WarehouseManaguaPage: React.FC = () => {
  return (
    <WarehouseProvider>
      <div className="flex flex-col gap-6 p-6 animate-in fade-in duration-500">
        {/* Cabecera del Módulo */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-white tracking-tight text-slate-900">
            Control de Accesos
          </h1>
          <p className="text-sm text-slate-500 text-white">
            Monitoreo en tiempo real de entradas y salidas de unidades.
          </p>
        </div>

        {/* Layout Principal: Foco total en el panel de guardia */}
        <div className="w-full">
          <GuardPanel />
        </div>
      </div>
    </WarehouseProvider>
  );
};