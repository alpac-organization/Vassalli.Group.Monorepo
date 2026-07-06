import React from "react";

export const Step3DucatRegistry: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="border-b border-slate-700/50 pb-2">
        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">Paso 3 — Declaraciones</span>
        <h4 className="text-base font-bold text-slate-100">Auditoría del Documento Único Centroamericano</h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">No. de DUCAT / Tránsito</label>
          <input type="text" placeholder="E-00029382" className="rounded border border-slate-700/60 bg-[#1a1d24] p-2 text-xs font-mono text-slate-200 focus:outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Bultos Declarados</label>
            <input type="number" placeholder="450" className="rounded border border-slate-700/60 bg-[#1a1d24] p-2 text-xs text-slate-200 focus:outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Peso Total (Kg)</label>
            <input type="number" placeholder="12400.50" className="rounded border border-slate-700/60 bg-[#1a1d24] p-2 text-xs text-slate-200 focus:outline-none" />
          </div>
        </div>
      </div>
    </div>
  );
};