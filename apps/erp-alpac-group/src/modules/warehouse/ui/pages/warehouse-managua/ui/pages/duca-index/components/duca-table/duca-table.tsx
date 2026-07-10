import React, { useState, useMemo } from 'react';
import type { WarehouseItem } from '@app/modules/warehouse/ui/pages/warehouse-managua/context/wareouse-context';

interface DucaTableProps {
  itemsQueue: WarehouseItem[];
  ducaList: any[];
  onSelect: (vehicle: WarehouseItem) => void;
}

export const DucaTable: React.FC<DucaTableProps> = ({ itemsQueue = [], ducaList = [], onSelect }) => {
  // 1. Estado local para el filtro
  const [filter, setFilter] = useState<'ALL' | 'PENDIENTE' | 'COMPLETADO'>('ALL');

  // 2. Filtramos la lista basándonos en el estado local
  const filteredItems = useMemo(() => {
    if (filter === 'ALL') return itemsQueue;
    return itemsQueue.filter((item) => item.estado === filter);
  }, [itemsQueue, filter]);

  if (!itemsQueue || itemsQueue.length === 0) {
    return (
      <div className="flex justify-center items-center p-8 bg-[#0b0f19]/40 border border-slate-800/80 rounded-xl">
        <span className="text-slate-500 font-semibold tracking-wide">No hay vehículos en cola de espera.</span>
      </div>
    );
  }

  return (
    <div>
      {/* 3. Cabecera integrada con el filtro */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">
            Detalle de Mercancías
          </h2>
        </div>

        {/* Controles de Filtro */}
        <div className="flex bg-[#0b0f19] p-1 rounded-lg border border-slate-800">
          {(['ALL', 'PENDIENTE', 'COMPLETADO'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-1 text-xs font-bold rounded-md transition-all ${
                filter === status 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {status === 'ALL' ? 'Todos' : status}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Renderizamos filteredItems en lugar de itemsQueue original */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 animate-in fade-in duration-300">
        {filteredItems.map((item) => {
          const ducaVinculada = ducaList.find((d: any) => d.osNumber === item.osNumber);
          const isCompleted = item.estado === 'COMPLETADO';

          return (
            <div 
              key={item.id} 
              className="relative bg-[#0b0f19]/80 border border-slate-800/80 hover:border-cyan-500/50 rounded-xl p-5 transition-all duration-300 group flex flex-col gap-3 shadow-lg hover:shadow-[0_0_15px_rgba(34,211,238,0.05)] hover:-translate-y-1 overflow-hidden"
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors ${
                isCompleted ? 'bg-emerald-500' : 'bg-amber-500'
              }`} />
              
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#121726] border border-slate-700/50 rounded-lg text-slate-400 group-hover:text-cyan-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-slate-100 font-bold tracking-tight text-sm capitalize">{item.conductor.toLowerCase()}</h3>
                    <p className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider mt-0.5">Conductor</p>
                  </div>
                </div>
                <div className="bg-[#121726] px-2.5 py-1 rounded border border-slate-700/50 shadow-inner">
                  <span className="text-slate-300 font-mono text-xs font-bold">{item.placaCabezal}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#121726]/60 rounded-lg border border-slate-800/50">
                <div className="flex flex-col gap-1">
                  <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Orden Servicio</span>
                  <span className="text-slate-200 font-mono text-xs font-semibold">{item.osNumber}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Consignatario</span>
                  <span className="text-slate-200 text-xs font-medium truncate" title={item.consignatario}>
                    {item.consignatario}
                  </span>
                </div>
                <div className="col-span-2 flex items-center justify-between mt-1 pt-3 border-t border-slate-800/60">
                   <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Nº DUCA</span>
                   {ducaVinculada ? (
                      <span className="text-emerald-400 font-mono text-xs bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                        {ducaVinculada.ducaNumero}
                      </span>
                   ) : (
                      <span className="text-slate-600 italic text-[11px] font-medium">Pendiente de vinculación</span>
                   )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wide border shadow-sm ${
                  isCompleted 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {item.estado}
                </span>
                
                <button 
                  onClick={() => onSelect(item)}
                  className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 text-[11px] font-bold transition-all bg-cyan-400/5 hover:bg-cyan-400/15 border border-cyan-400/10 hover:border-cyan-400/30 px-3 py-1.5 rounded-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  GESTIONAR
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};