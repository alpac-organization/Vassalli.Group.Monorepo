import React, { useState } from 'react';
import { useLocation } from 'react-router-dom'; // Para sincronizar con las pestañas del Nav Lateral
import { GuardPanel } from './components/guard-panel/guard-panel';
import { GuardEntryModal } from './components/guard-panel/gate-entry-modal';
import { DucaPanel } from './components/duca-panel/duca-panel'; // Tu panel para la pestaña de Duca

export const WarehouseManaguaPage: React.FC = () => {
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const location = useLocation();

  // Evaluamos de forma exacta basándonos en el path de tu SidebarLink corporativo
  const esVistaIngresoMercancia = location.pathname.includes('merchandise-registration');

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 p-6 space-y-6">
      {/* Encabezado Principal adaptado a la pestaña activa */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-slate-800/80 pb-5 gap-4">
        <div>
          <div className="text-xs text-slate-500 flex items-center gap-2 mb-2">
            <span>Módulos Corporativos</span>
            <span>/</span>
            <span>Warehouse</span>
            <span>/</span>
            <span className="text-cyan-400">
              {esVistaIngresoMercancia ? 'Ingreso Mercancía' : 'Control de Acceso (Sede Managua)'}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {esVistaIngresoMercancia ? 'Gestión de DUCAs y Carga' : 'Panel de Seguridad y Portón'}
          </h1>
        </div>

        {/* El botón de Portón solo se muestra si NO estás en la pestaña de ingreso de mercancía */}
        {!esVistaIngresoMercancia && (
          <button
            type="button"
            onClick={() => setIsEntryModalOpen(true)}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-sm px-5 py-2.5 rounded-lg shadow-lg transition-all flex items-center gap-2 border border-cyan-500/20"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Dar Entrada a Vehículo
          </button>
        )}
      </div>

      {/* Renderizado condicional que responde de forma nativa al clic del Nav Lateral */}
      {esVistaIngresoMercancia ? <DucaPanel /> : <GuardPanel />}

      {/* Tu modal desacoplado original */}
      <GuardEntryModal isOpen={isEntryModalOpen} onClose={() => setIsEntryModalOpen(false)} />
    </div>
  );
};

export default WarehouseManaguaPage;