import React, { useState } from 'react';
import { useWarehouse, type WarehouseItem } from '@app/modules/warehouse/ui/pages/warehouse-managua-index/context/wareouse-context';
import { DucaDetailModal } from './duca-detail-modal';

export const DucaPanel: React.FC = () => {
  const { itemsQueue, ducaList } = useWarehouse();
  
  // Estado para rastrear a qué vehículo exacto se le está gestionando la DUCA en el modal
  const [selectedVehicle, setSelectedVehicle] = useState<WarehouseItem | null>(null);

  return (
    <div className="space-y-6">
      {/* breadcrumb y cabeceras emulando el diseño corporativo */}
      <div className="text-xs text-slate-400 font-sans space-x-1">
        <span>Módulos Corporativos</span>
        <span>/</span>
        <span>Warehouse</span>
        <span>/</span>
        <span className="text-cyan-400 font-medium">Registro de Mercancías (Sede Managua)</span>
      </div>

      <div className="bg-[#121726] p-6 rounded-xl border border-slate-800 shadow-2xl space-y-5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">Cola de Espera - Registro de Mercancías</h2>
        </div>
        
        <div className="overflow-x-auto border border-slate-800 rounded-lg bg-[#0b0f19]/40">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#0f1422] text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4 font-mono">Orden Servicio</th>
                <th className="p-4">Conductor</th>
                <th className="p-4 font-mono">Placas</th>
                <th className="p-4">Consignatario</th>
                <th className="p-4 text-center">Estado Portón</th>
                <th className="p-4 text-right">No. DUCA Asignada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 font-sans text-slate-300">
              {itemsQueue.map((vehicle) => {
                const ducaVinculada = ducaList.find(d => d.osNumber === vehicle.osNumber);

                return (
                  <tr 
                    key={vehicle.id}
                    onClick={() => setSelectedVehicle(vehicle)}
                    className="hover:bg-[#161c2e]/40 transition-all cursor-pointer group"
                  >
                    <td className="p-4 font-mono font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
                      {vehicle.osNumber}
                    </td>
                    <td className="p-4 text-slate-200">{vehicle.conductor}</td>
                    <td className="p-4 font-mono text-slate-400">{vehicle.placaCabezal}</td>
                    <td className="p-4 text-slate-400">{vehicle.consignatario}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded text-[10px] font-bold tracking-wide border ${
                        vehicle.estado === 'COMPLETADO' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {vehicle.estado}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono font-bold">
                      {ducaVinculada ? (
                        <span className="text-emerald-400 bg-emerald-500/5 px-2 py-1 rounded border border-emerald-500/10">
                          {ducaVinculada.ducaNumero}
                        </span>
                      ) : (
                        <span className="text-slate-500 group-hover:text-cyan-400/80 transition-colors italic font-sans font-normal text-xs">
                          Pendiente Vincular ➔
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE DETALLE COMPLETO DESPLIEGUE SOBRE EL REGISTRO SELECCIONADO */}
      {selectedVehicle && (
        <DucaDetailModal 
          isOpen={true} 
          onClose={() => setSelectedVehicle(null)} 
          vehicle={selectedVehicle} 
        />
      )}
    </div>
  );
};