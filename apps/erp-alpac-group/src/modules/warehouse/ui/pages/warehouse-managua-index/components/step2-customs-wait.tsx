// apps/erp-alpac-group/src/modules/warehouse-managua-index/components/step2-customs-wait.tsx
import React from "react";

interface Step2Props {
  onComplete: () => void;
}

export const Step2CustomsWait: React.FC<Step2Props> = ({ onComplete }) => {
  return (
    <div className="space-y-4 flex flex-col h-full justify-between text-center py-2">
      <div>
        <div className="border-b border-slate-700/50 pb-2 mb-4 text-left">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">MONITOREO — RECEPCIÓN</span>
          <h4 className="text-sm font-bold text-slate-100">[Verificación de Aduana]</h4>
        </div>

        <div className="flex flex-col items-center justify-center space-y-3 my-4">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 animate-pulse">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <div className="space-y-1">
            <span className="text-xs font-mono font-black text-amber-400 block bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20 max-w-fit mx-auto">
              TIEMPO EN ESPERA: 14 MIN
            </span>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto mt-2">
              El vehículo se encuentra retenido en la bahía de control. Esperando asignación de selectividad de Aduana.
            </p>
          </div>
        </div>
      </div>

      <button onClick={onComplete} className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold uppercase tracking-wider rounded-lg transition-colors text-xs">
        Selectividad Liberada (Pasar a DUCAT) →
      </button>
    </div>
  );
};