import React from "react";

export const Step7WarehouseReceipt: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center space-y-4 bg-emerald-950/10 border border-emerald-500/20 rounded-xl p-6">
      <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
      </div>
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">Paso 7 — Ciclo Completado</span>
        <h4 className="text-base font-bold text-slate-100">Recibo de Almacenamiento Emitido</h4>
        <p className="text-[11px] text-slate-400 max-w-md mx-auto">La mercancía ya cuenta con un número RESA asignado y se encuentra custodiada en los racks.</p>
      </div>
    </div>
  );
};