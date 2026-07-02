import React from "react";

export const Step5UnloadingDiscrepancy: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="border-b border-slate-700/50 pb-2">
        <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest block">Paso 5 — Operación de Patio</span>
        <h4 className="text-base font-bold text-slate-100">Desconsolidación y Conteo Físico (Auditoría)</h4>
      </div>
      <div className="bg-[#1a1d24] border border-slate-700/50 p-4 rounded-lg flex justify-between items-center">
        <div>
          <span className="text-[10px] text-slate-500 uppercase block font-mono">Control de Tiempos Operacionales</span>
          <span className="text-xs font-bold text-orange-400">Descargando Pallets en Andén...</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 block">Eficiencia</span>
          <span className="text-xs font-mono font-bold text-slate-200">14.5 Pallets / Hora</span>
        </div>
      </div>
    </div>
  );
};