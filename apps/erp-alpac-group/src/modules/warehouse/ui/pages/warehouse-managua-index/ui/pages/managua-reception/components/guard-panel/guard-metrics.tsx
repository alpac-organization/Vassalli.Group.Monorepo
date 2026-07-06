import React from 'react';
import { useWarehouse } from '@app/modules/warehouse/ui/pages/warehouse-managua-index/wareouse-context';

export const GuardMetrics: React.FC = () => {
  const { itemsQueue } = useWarehouse();

  // Cálculos dinámicos basados en el estado de las tablas/cola
  const totalIngresados = itemsQueue.length;
  const dentroInstalacion = itemsQueue.filter(item => item.estado !== 'COMPLETADO').length;
  const yaSalieron = itemsQueue.filter(item => item.estado === 'COMPLETADO').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Tarjeta 1: Total Ingresados */}
      <div className="bg-[#121726] p-4 rounded-xl border border-slate-800 shadow-md flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total Ingresados</p>
          <p className="text-2xl font-bold text-white font-mono">{totalIngresados}</p>
        </div>
        <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
      </div>

      {/* Tarjeta 2: Dentro de Instalación */}
      <div className="bg-[#121726] p-4 rounded-xl border border-slate-800 shadow-md flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Dentro en Patio/Cola</p>
          <p className="text-2xl font-bold text-cyan-400 font-mono">{dentroInstalacion}</p>
        </div>
        <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 012-2h10a2 2 0 012 2k2M5 12a2 2 0 002 2h10a2 2 0 002-2" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
          </svg>
        </div>
      </div>

      {/* Tarjeta 3: Ya Salieron */}
      <div className="bg-[#121726] p-4 rounded-xl border border-slate-800 shadow-md flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Despachados / Salieron</p>
          <p className="text-2xl font-bold text-emerald-400 font-mono">{yaSalieron}</p>
        </div>
        <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </div>
  );
};