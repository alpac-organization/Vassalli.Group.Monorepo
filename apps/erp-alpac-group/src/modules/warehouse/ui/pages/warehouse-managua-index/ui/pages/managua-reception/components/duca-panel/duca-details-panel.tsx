import { Breadcrumb } from '@alpac/design-system';
import { WarehouseManaguaRoutes } from '@app/routers/warehouse-managua-routes';
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

export const DucaDetailsPanel: React.FC = () => {
  // Datos simulados (Mock Data) para lucir la operación en la demo
  const [ducas, setDucas] = useState([
    { id: 'D1', noDuca: 'M546214', proveedor: 'Joaquín Zavala', bultosManifestados: '08:36', bultosRecibidos: 450, estado: 'CUADRADO', tipo: '03/07/2026' },
    { id: 'D2', noDuca: 'CS91246', proveedor: 'Camilo Fiesta', bultosManifestados: '14:03', bultosRecibidos: 198, estado: 'DISCREPANCIA', tipo: '02/07/2026' },
    { id: 'D3', noDuca: 'CAL-48654', proveedor: 'Juan Montreal', bultosManifestados: '16:20', bultosRecibidos: 600, estado: 'PENDIENTE', tipo: '02/07/2026' }
  ]);

  return (
    <div className="space-y-4">
      {/* Resumen Superior */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#161c2e] p-4 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Total Vehículos Ingresados</p>
          <p className="text-xl font-bold text-white mt-1">{ducas.length} Vehículos</p>
        </div>
        <div className="bg-[#161c2e] p-4 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Total vehiculos dentro de Plantel</p>
          <p className="text-xl font-bold text-cyan-400 mt-1">25 Vehículos</p>
        </div>
        <div className="bg-[#161c2e] p-4 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Total Vehículos dspachados</p>
          <p className="text-xl font-bold text-amber-400 mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            6 Vehículos
          </p>
        </div>
      </div>

      {/* Tabla Estilizada de DUCAs */}
      <div className="bg-[#131929] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 bg-[#161c2e]/50 flex justify-between items-center">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Detalle de seguimiento</h4>
          <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20 font-mono">Modo Demo Activo</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f1422] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">No. Placa</th>
                <th className="p-3">Nombre Conductor</th>
                <th className="p-3">Fecha ingrso</th>
                <th className="p-3 text-center">Hora ingreso</th>
                <th className="p-3 text-center">Transportista</th>
                <th className="p-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {ducas.map((duca) => (
                <tr key={duca.id} className="hover:bg-[#161c2e]/30 transition-colors">
                  <td className="p-2 font-bold text-white">{duca.noDuca}</td>
                  <td className="p-3 text-slate-300 font-sans">{duca.proveedor}</td>
                  <td className="p-3 text-slate-400">{duca.tipo}</td>
                  <td className="p-3 text-center text-slate-300 font-bold">{duca.bultosManifestados}</td>
                  <td className="p-3 text-center text-slate-300 font-bold">{"Zepeda"}</td>
                  
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold uppercase ${
                      duca.estado === 'CUADRADO' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      duca.estado === 'DISCREPANCIA' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {"En Parqueo"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <div className="flex justify-start">
          <Breadcrumb
            items={[
              {
                label: "Detalles",
                url: `/${WarehouseManaguaRoutes}/dashboard/Warehouse/duca-panel/${DucaDetailsPanel}`,
                onClick: () => {},
              },
            ]}
          />
        </div>
          </table>
        </div>
      </div>
    </div>
  );
};