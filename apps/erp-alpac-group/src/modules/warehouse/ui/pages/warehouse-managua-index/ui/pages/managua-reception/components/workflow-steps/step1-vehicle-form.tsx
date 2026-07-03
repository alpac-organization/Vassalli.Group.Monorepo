import React, { useState } from 'react';

interface TruckQueueItem {
  id: string;
  placa: string;
  conductor: string;
  estado: 'En Espera' | 'En Aduana' | 'Descargando' | 'Completado';
  tiempoRestanteMinutos: number;
  duca: string;
}

export const ManaguaQueueTracker: React.FC = () => {
  // Datos simulados de la cola operativa para la demo de mañana
  const [queueData] = useState<TruckQueueItem[]>([
    { id: '1', placa: 'M 123-456', conductor: 'Juan Carlos Pérez', estado: 'En Aduana', tiempoRestanteMinutos: 14, duca: 'DUCA-T-2026-9921' },
    { id: '2', placa: 'LE 789-101', conductor: 'Marcos Antonio Gómez', estado: 'En Espera', tiempoRestanteMinutos: 45, duca: 'DUCA-C-2026-4412' },
    { id: '3', placa: 'CH 234-567', conductor: 'Silvio Duarte Rostrán', estado: 'Descargando', tiempoRestanteMinutos: 0, duca: 'DUCA-T-2026-1102' }
  ]);

  return (
    <div className="w-full bg-[#121622] text-slate-100 p-6 rounded-xl border border-slate-800 shadow-2xl">
      {/* Encabezado Principal */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-5 mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Módulo de Almacén — Managua</h2>
          <p className="text-xs text-slate-400 mt-1">Monitoreo de colas físicas, validación de DUCAs y flujos de descarga en plantel.</p>
        </div>
        
        {/* Micro-métricas de urgencia (Evitan penalizaciones en aduana) */}
        <div className="flex gap-3 w-full md:w-auto">
          <div className="bg-[#1a1f30] border border-emerald-500/30 px-4 py-2 rounded-lg flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">En Descarga</p>
              <p className="text-base font-bold text-emerald-400">3 Unidades</p>
            </div>
          </div>
          <div className="bg-[#1a1f30] border border-amber-500/30 px-4 py-2 rounded-lg flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Alerta Tiempo</p>
              <p className="text-base font-bold text-amber-400">1 Crítico</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Operativo: Izquierda Cola, Derecha Registro Rápido */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Listado de Cola Interactiva */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs font-semibold tracking-wide uppercase text-slate-400">Secuencia de Recepción Activa</h3>
            <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300">{queueData.length} Vehículos en tránsito</span>
          </div>

          <div className="space-y-3">
            {queueData.map((item) => (
              <div 
                key={item.id} 
                className={`p-4 rounded-xl border transition-all duration-200 hover:scale-[1.01] ${
                  item.tiempoRestanteMinutos > 0 && item.tiempoRestanteMinutos <= 15
                    ? 'bg-[#261920] border-red-900/60'
                    : 'bg-[#181d2e] border-slate-800'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-900 text-cyan-400 rounded border border-slate-700">
                        {item.placa}
                      </span>
                      <span className="text-xs font-medium text-slate-400">— {item.duca}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-200">{item.conductor}</h4>
                  </div>

                  <div className="text-right">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      item.estado === 'Descargando' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      item.estado === 'En Aduana' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {item.estado}
                    </span>
                    
                    {item.tiempoRestanteMinutos > 0 && (
                      <p className={`text-xs mt-1.5 font-mono font-medium ${
                        item.tiempoRestanteMinutos <= 15 ? 'text-red-400 animate-pulse' : 'text-slate-400'
                      }`}>
                        T. Límite: {item.tiempoRestanteMinutos}m
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex justify-between items-center">
                  <span className="text-xs text-slate-500">Ubicación: Bahía de Espera Externa</span>
                  <button className="text-xs bg-slate-800 hover:bg-cyan-600 hover:text-white text-slate-300 font-medium px-3 py-1.5 rounded-lg transition-colors border border-slate-700">
                    Gestionar Siguiente Paso
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Formulario Rápido de Captura Física en Entrada */}
        <div className="bg-[#181d2e] p-5 rounded-xl border border-slate-800">
          <h3 className="text-xs font-semibold tracking-wide uppercase text-slate-400 mb-4">Ingreso de Transporte Local</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">Código de DUCA Vinculado</label>
              <input 
                type="text" 
                placeholder="Ej: DUCA-T-2026..." 
                className="w-full bg-[#111422] border border-slate-800 focus:border-cyan-500 text-xs text-slate-200 px-3 py-2.5 rounded-lg outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">Placa Cabezal</label>
                <input 
                  type="text" 
                  placeholder="M 000-000" 
                  className="w-full bg-[#111422] border border-slate-800 focus:border-cyan-500 text-xs text-slate-200 px-3 py-2.5 rounded-lg outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">Placa Rastra</label>
                <input 
                  type="text" 
                  placeholder="RE 00-000" 
                  className="w-full bg-[#111422] border border-slate-800 focus:border-cyan-500 text-xs text-slate-200 px-3 py-2.5 rounded-lg outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">Conductor Asignado</label>
              <input 
                type="text" 
                placeholder="Nombre completo del transportista" 
                className="w-full bg-[#111422] border border-slate-800 focus:border-cyan-500 text-xs text-slate-200 px-3 py-2.5 rounded-lg outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">Observación de Marchamo / Sellos</label>
              <textarea 
                rows={2}
                placeholder="Estado físico de los sellos del contenedor..." 
                className="w-full bg-[#111422] border border-slate-800 focus:border-cyan-500 text-xs text-slate-200 px-3 py-2 rounded-lg outline-none transition-colors resize-none"
              />
            </div>

            <button 
              type="button"
              className="w-full mt-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs py-2.5 px-4 rounded-lg shadow-lg transition-all duration-200"
            >
              Registrar e Inyectar a Cola
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};