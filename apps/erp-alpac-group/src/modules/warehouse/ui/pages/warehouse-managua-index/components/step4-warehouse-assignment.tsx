import React from "react";

export const Step4WarehouseAssignment: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="border-b border-slate-700/50 pb-2">
        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">Paso 4 — Layout WMS</span>
        <h4 className="text-base font-bold text-slate-100">Direccionamiento de Slot e Infraestructura</h4>
      </div>
      <div className="p-4 bg-[#1a1d24] rounded-lg border border-slate-700/60 space-y-3">
        <p className="text-xs text-slate-400">Selecciona el Rack objetivo según el tipo de régimen fiscal de la mercancía:</p>
        <div className="grid grid-cols-3 gap-3">
          <button className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-left text-xs">
            <strong className="block text-slate-200">Bodega Fiscal A</strong>
            <span className="text-[10px] text-slate-400">Régimen Suspensivo</span>
          </button>
          <button className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-left text-xs">
            <strong className="block text-slate-200">Galerón B</strong>
            <span className="text-[10px] text-slate-400">Mercancía General</span>
          </button>
          <button className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-left text-xs">
            <strong className="block text-slate-200">Patio Abierto</strong>
            <span className="text-[10px] text-slate-400">Contenedores</span>
          </button>
        </div>
      </div>
    </div>
  );
};