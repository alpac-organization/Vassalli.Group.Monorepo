// apps/erp-alpac-group/src/modules/warehouse-managua-index/components/step1-vehicle-form.tsx
import React from "react";

interface Step1Props {
  onComplete: () => void;
}

export const Step1VehicleForm: React.FC<Step1Props> = ({ onComplete }) => {
  return (
    <div className="space-y-4 flex flex-col h-full justify-between">
      <div>
        <div className="border-b border-slate-700/50 pb-2 mb-3">
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">MIS TAREAS — GUARDAS</span>
          <h4 className="text-sm font-bold text-slate-100">[Registrar entrada vehículo]</h4>
        </div>
        
        {/* Grid de captura de los 12 parámetros requeridos en la base de datos */}
        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <div className="flex flex-col gap-0.5">
            <label className="text-[10px] text-slate-400 uppercase font-medium">País de Procedencia</label>
            <input type="text" placeholder="Nicaragua" className="rounded border border-slate-700 bg-[#1a1d24] p-1.5 text-slate-200 focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-[10px] text-slate-400 uppercase font-medium">Aduana de Ingreso</label>
            <input type="text" placeholder="Managua" className="rounded border border-slate-700 bg-[#1a1d24] p-1.5 text-slate-200 focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-[10px] text-slate-400 uppercase font-medium">DucaT #</label>
            <input type="text" placeholder="T-102938" className="rounded border border-slate-700 bg-[#1a1d24] p-1.5 font-mono text-slate-200 focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-[10px] text-slate-400 uppercase font-medium">Placa Cabezal</label>
            <input type="text" placeholder="M 49521" className="rounded border border-slate-700 bg-[#1a1d24] p-1.5 text-slate-200 focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-[10px] text-slate-400 uppercase font-medium">Remolque (Chasis)</label>
            <input type="text" placeholder="CH-9941" className="rounded border border-slate-700 bg-[#1a1d24] p-1.5 text-slate-200 focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-[10px] text-slate-400 uppercase font-medium">Licencia Conductor</label>
            <input type="text" placeholder="001-091100-0002A" className="rounded border border-slate-700 bg-[#1a1d24] p-1.5 text-slate-200 focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-[10px] text-slate-400 uppercase font-medium">Transportista</label>
            <input type="text" placeholder="Cargo Express" className="rounded border border-slate-700 bg-[#1a1d24] p-1.5 text-slate-200 focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-[10px] text-slate-400 uppercase font-medium">Medio</label>
            <input type="text" placeholder="Terrestre" className="rounded border border-slate-700 bg-[#1a1d24] p-1.5 text-slate-200 focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex flex-col gap-0.5 col-span-2">
            <label className="text-[10px] text-slate-400 uppercase font-medium">Nombre del Conductor</label>
            <input type="text" placeholder="Juan Carlos Cortés" className="rounded border border-slate-700 bg-[#1a1d24] p-1.5 text-slate-200 focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-[10px] text-slate-400 uppercase font-medium">Consignatario</label>
            <input type="text" placeholder="Almacén Central" className="rounded border border-slate-700 bg-[#1a1d24] p-1.5 text-slate-200 focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-[10px] text-slate-400 uppercase font-medium">Precinto / Marchamo #</label>
            <input type="text" placeholder="MC-88512" className="rounded border border-slate-700 bg-[#1a1d24] p-1.5 text-slate-200 focus:outline-none focus:border-blue-500" />
          </div>
        </div>
      </div>

      <button onClick={onComplete} className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider rounded-lg transition-colors text-xs">
        Guardar Entrada e Iniciar Cronómetro →
      </button>
    </div>
  );
};