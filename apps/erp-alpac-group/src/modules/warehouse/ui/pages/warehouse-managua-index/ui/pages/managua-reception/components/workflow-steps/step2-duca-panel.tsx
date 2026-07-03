import React from 'react';

export const DucaValidationPanel: React.FC = () => {
  return (
    <div className="w-full bg-[#121622] text-slate-100 p-6 rounded-xl border border-slate-800 shadow-2xl mt-6">
      <div className="border-b border-slate-800 pb-4 mb-4">
        <h3 className="text-lg font-bold text-white">Paso 2: Validación de Manifiesto Aduanero (DUCA)</h3>
        <p className="text-xs text-slate-400">Verifique las líneas declaradas frente al inventario físico ingresado en Managua.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna Izquierda: Datos Declarados */}
        <div className="bg-[#181d2e] p-4 rounded-lg border border-slate-800">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold uppercase text-amber-400 tracking-wider">Declarado en DUCA</span>
            <span className="text-[10px] bg-slate-900 px-2 py-0.5 text-slate-400 rounded">Origen: Aduana Central</span>
          </div>
          
          <div className="space-y-3 font-mono text-xs text-slate-300">
            <div className="bg-[#111422] p-2.5 rounded border border-slate-800/60 flex justify-between">
              <span className="text-slate-400">No. Documento:</span>
              <span className="text-white font-bold">DUCA-T-2026-9921</span>
            </div>
            <div className="bg-[#111422] p-2.5 rounded border border-slate-800/60 flex justify-between">
              <span className="text-slate-400">Total Bultos:</span>
              <span className="text-cyan-400 font-bold">450 Bultos</span>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Conteo Físico */}
        <div className="bg-[#181d2e] p-4 rounded-lg border border-slate-800">
          <span className="text-xs font-bold uppercase text-cyan-400 tracking-wider block mb-3">Conteo Físico Reclutado</span>
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1">Bultos Buenos Recibidos</label>
              <input 
                type="number" 
                defaultValue={450} 
                className="w-full bg-[#111422] border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded outline-none focus:border-cyan-500"
              />
            </div>
            <button type="button" className="w-full bg-cyan-600 hover:bg-cyan-500 text-xs font-medium py-2 rounded text-white shadow transition-colors">
              Aprobar y Cuadrar DUCA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};