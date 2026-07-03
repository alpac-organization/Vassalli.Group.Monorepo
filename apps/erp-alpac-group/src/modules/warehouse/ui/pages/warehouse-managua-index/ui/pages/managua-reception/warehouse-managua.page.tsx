import React, { useState } from 'react';
// IMPORTACIÓN EXACTA CORREGIDA
// import { DucaDetailsPanel } from './components/duca-panel/duca-details-panel';
import { ManaguaQueueTracker } from './components/workflow-steps/step1-vehicle-form';
import { DucaDetailsPanel } from './components/duca-panel/duca-details-panel';

type WorkflowStep = 'PORTON' | 'ADUANA' | 'DUCAT' | 'BODEGA' | 'DESPACHO';

export const WarehouseManaguaPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState<WorkflowStep>('PORTON');
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);

  const stepsConfig = [
    { id: 'PORTON' as WorkflowStep, label: '1. Control de Portón', sub: 'Registro inicial' },
    { id: 'ADUANA' as WorkflowStep, label: '2. Espera de Aduana', sub: 'Tiempos y semáforo' },
    { id: 'DUCAT' as WorkflowStep, label: '3. Registro DUCAT', sub: 'Validación de bultos' },
    { id: 'BODEGA' as WorkflowStep, label: '4. Asignación Bodega', sub: 'Andenes y estiba' },
    { id: 'DESPACHO' as WorkflowStep, label: '5. Fin de Proceso', sub: 'Cierre de OS' },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 p-6 space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-slate-800/80 pb-5 gap-4">
        <div>
          <div className="text-xs text-slate-500 flex items-center gap-2 mb-2">
            <span>Módulos Corporativos</span>
            <span>/</span>
            <span>Warehouse</span>
            <span>/</span>
            <span className="text-cyan-400">Sede Managua</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Centro de Operaciones Logísticas
          </h1>
        </div>

        {/* El Formulario transformado en un Botón Elegante de Acción */}
        <button
          type="button"
          onClick={() => setIsEntryModalOpen(true)}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-sm px-5 py-2.5 rounded-lg shadow-lg hover:shadow-cyan-500/10 transition-all duration-200 flex items-center gap-2 border border-cyan-500/20"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Dar Entrada a Transporte
        </button>
      </div>

      {/* Tabs / Pestañas */}
      <div className="bg-[#111625] p-2 rounded-xl border border-slate-800 flex flex-wrap gap-2 shadow-inner">
        {stepsConfig.map((step) => (
          <button
            key={step.id}
            type="button"
            onClick={() => setActiveStep(step.id)}
            className={`flex-1 min-w-[160px] text-left p-3 rounded-lg transition-all duration-200 ${
              activeStep === step.id
                ? 'bg-[#1b2336] border border-cyan-500/40 shadow-md shadow-cyan-950/50'
                : 'hover:bg-[#141b2d]/50 border border-transparent'
            }`}
          >
            <p className={`text-xs font-semibold ${activeStep === step.id ? 'text-cyan-400' : 'text-slate-300'}`}>
              {step.label}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">{step.sub}</p>
          </button>
        ))}
      </div>

      {/* Contenido dinámico por paso */}
      <div className="grid grid-cols-1 gap-6">
        {activeStep === 'PORTON' && (
          <div className="bg-[#121726] p-6 rounded-xl border border-slate-800/80 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800/60 pb-3">
              <h3 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Cola Activa de Vehículos en Portón
              </h3>
            </div>
            
            {/* Render seguro de nuestro panel con mock data */}
            <DucaDetailsPanel />
          </div>
        )}

        {/* Las demás pestañas con estados limpios simulados */}
        {activeStep !== 'PORTON' && (
          <div className="bg-[#121726] p-12 rounded-xl border border-slate-800/80 text-center text-slate-400">
            <p className="text-sm">Módulo interactivo para el paso de <span className="text-cyan-400 font-bold">{activeStep}</span> cargado correctamente.</p>
          </div>
        )}
      </div>

      {/* Modal interactivo de Entrada */}
      {isEntryModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-[#131929] border border-slate-800 w-full max-w-lg p-6 rounded-xl shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Registro de Entrada de Transporte</h3>
              <button type="button" onClick={() => setIsEntryModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1 uppercase">Procedencia</label>
                  <input type="text" placeholder="México" className="w-full bg-[#0b0f19] border border-slate-800 text-white px-3 py-2 rounded-lg outline-none" />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1 uppercase">Hora Entrada</label>
                  <input type="text" placeholder="09:41 am" className="w-full bg-[#0b0f19] border border-slate-800 text-white px-3 py-2 rounded-lg outline-none" />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1 uppercase">Placa Cabezal</label>
                  <input type="text" placeholder="M 123456" className="w-full bg-[#0b0f19] border border-slate-800 text-white px-3 py-2 rounded-lg outline-none" />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1 uppercase">Remolque / Chasis</label>
                  <input type="text" placeholder="FUG9942SDW55452SAD4" className="w-full bg-[#0b0f19] border border-slate-800 text-white px-3 py-2 rounded-lg outline-none" />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1 uppercase">Licencia Conductor</label>
                  <input type="text" placeholder="OF6522118" className="w-full bg-[#0b0f19] border border-slate-800 text-white px-3 py-2 rounded-lg outline-none" />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1 uppercase">Transportista</label>
                  <input type="text" placeholder="Zepeda" className="w-full bg-[#0b0f19] border border-slate-800 text-white px-3 py-2 rounded-lg outline-none" />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1 uppercase">Medio de transporte</label>
                  <input type="text" placeholder="Furgón" className="w-full bg-[#0b0f19] border border-slate-800 text-white px-3 py-2 rounded-lg outline-none" />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1 uppercase">Nombre Conductor</label>
                  <input type="text" placeholder="Ernesto Ezequiel López Arróliga" className="w-full bg-[#0b0f19] border border-slate-800 text-white px-3 py-2 rounded-lg outline-none" />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1 uppercase">Consignatario</label>
                  <input type="text" placeholder="Asia Logistic S.A." className="w-full bg-[#0b0f19] border border-slate-800 text-white px-3 py-2 rounded-lg outline-none" />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1 uppercase"># Marchamo</label>
                  <input type="text" placeholder="54684216DFS44" className="w-full bg-[#0b0f19] border border-slate-800 text-white px-3 py-2 rounded-lg outline-none" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-800 pt-3">
              <button type="button" onClick={() => setIsEntryModalOpen(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg">Cancelar</button>
              <button type="button" onClick={() => setIsEntryModalOpen(false)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-xs rounded-lg text-white">Registrar Entrada</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseManaguaPage;