import React from "react";

export const Step6ManifestCancellation: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="border-b border-slate-700/50 pb-2">
        <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest block">Paso 6 — Cierre Legal</span>
        <h4 className="text-base font-bold text-slate-100">Liquidación y Cancelación del Manifiesto de Carga</h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#1a1d24] p-4 rounded-lg border border-slate-700/40">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">Firma Oficial de Aduana</label>
          <div className="h-16 border border-dashed border-slate-700 bg-[#22262f] rounded flex items-center justify-center text-[10px] text-slate-500 font-mono">[ Firma Biométrica Capturada ]</div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">Firma Jefatura Operaciones</label>
          <div className="h-16 border border-dashed border-slate-700 bg-[#22262f] rounded flex items-center justify-center text-[10px] text-slate-500 font-mono">[ Firma Tokenizada ]</div>
        </div>
      </div>
    </div>
  );
};