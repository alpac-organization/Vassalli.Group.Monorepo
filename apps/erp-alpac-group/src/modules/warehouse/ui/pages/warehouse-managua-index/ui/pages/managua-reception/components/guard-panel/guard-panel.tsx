import React from 'react';
import { useWarehouse } from '@app/modules/warehouse/ui/pages/warehouse-managua-index/wareouse-context';
import { GuardMetrics } from './guard-metrics'; // Importamos las nuevas métricas

export const GuardPanel: React.FC = () => {
  const { itemsQueue } = useWarehouse();

  return (
    <div className="space-y-6">
      {/* 1. Bloque superior de contadores visuales */}
      <GuardMetrics />

      {/* 2. Bloque de la Tabla */}
      <div className="bg-[#121726] p-6 rounded-xl border border-slate-800/80 space-y-4 shadow-xl">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          Seguimiento de vehículos
        </h3>

        <div className="overflow-x-auto border border-slate-800 rounded-lg">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0f1422] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Código OS</th>
                <th className="p-3">Conductor</th>
                <th className="p-3">Placas (Cabezal/Rastra)</th>
                <th className="p-3">Consignatario</th>
                <th className="p-3">Fecha Entrada</th>
                <th className="p-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {itemsQueue.map((item) => (
                <tr key={item.id} className="hover:bg-[#161c2e]/30 transition-colors">
                  <td className="p-3 font-bold text-white">{item.osNumber}</td>
                  <td className="p-3 text-slate-300 font-sans">{item.conductor}</td>
                  <td className="p-3 text-slate-300">
                    {item.placaCabezal} {item.placaRastra && `/ ${item.placaRastra}`}
                  </td>
                  <td className="p-3 text-slate-400 font-sans">{item.consignatario}</td>
                  <td className="p-3 text-slate-400">{item.marchamo}</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-sans font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
                      {item.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};