import React, { useState } from 'react';
import { useWarehouse, type WarehouseItem, type DucaHeader } from '@app/modules/warehouse/ui/pages/warehouse-managua-index/wareouse-context';

interface DucaDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: WarehouseItem;
}

export const DucaDetailModal: React.FC<DucaDetailModalProps> = ({ isOpen, onClose, vehicle }) => {
  const { ducaList, updateDucaStatus, addDucaDetail } = useWarehouse();
  
  // Buscar si el registro ya cuenta con cabecera DUCA
  const ducaAsociada = ducaList.find(d => d.osNumber === vehicle.osNumber);

  // Estados locales para los formularios requeridos por las entidades
  const [ducaNumero, setDucaNumero] = useState(ducaAsociada?.ducaNumero || '');
  const [regimen, setRegimen] = useState<DucaHeader['regimen']>(ducaAsociada?.regimen || 'FISCAL_A');
  const [aduanaProcedencia, setAduanaProcedencia] = useState(ducaAsociada?.aduanaProcedencia || '');
  
  // Estado para añadir renglones físicos
  const [newLinea, setNewLinea] = useState({ descripcion: '', bultos: 0, pesoKg: 0 });

  if (!isOpen) return null;

  const handleGuardarCabecera = (e: React.FormEvent) => {
    e.preventDefault();
    if (ducaAsociada) {
      updateDucaStatus(ducaAsociada.id, ducaAsociada.estado);
    } else {
      // Si no existe, empujamos la nueva estructura respetando el tipado nativo de ducaList
      ducaList.push({
        id: `duca-${Date.now()}`,
        osNumber: vehicle.osNumber,
        ducaNumero,
        regimen,
        aduanaProcedencia,
        estado: 'PENDIENTE',
        detalles: []
      });
      updateDucaStatus(vehicle.id, 'PENDIENTE'); // Forzar renderizado
    }
  };

  const handleAddLinea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ducaAsociada) return;

    // Inyección segura del correlativo para cumplir con la firma estricta de DucaDetail
    const nextLineNumber = ducaAsociada.detalles.length + 1;
    addDucaDetail(ducaAsociada.id, {
      linea: nextLineNumber,
      descripcion: newLinea.descripcion,
      bultos: Number(newLinea.bultos),
      pesoKg: Number(newLinea.pesoKg)
    });

    setNewLinea({ descripcion: '', bultos: 0, pesoKg: 0 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 font-sans">
      <div className="w-full max-w-4xl bg-[#121726] border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Cabecera del Modal */}
        <div className="bg-[#161c2e] px-5 py-4 border-b border-slate-800 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded tracking-wider uppercase">
              {vehicle.osNumber}
            </span>
            <h3 className="text-base font-bold text-slate-100 mt-1">
              Detalle y Declaración Única de Aduanas — {vehicle.conductor}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl transition-colors">&times;</button>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-6 overflow-y-auto space-y-6 bg-[#121726]">
          
          {/* Fila 1: Datos de Entrada Generales del Portón (ReadOnly) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[#0b0f19]/60 rounded-lg border border-slate-800/80 text-xs">
            <div>
              <span className="text-slate-500 block uppercase font-semibold text-[10px] tracking-wider">Cabezal / Rastra</span>
              <span className="text-slate-200 font-mono font-bold">{vehicle.placaCabezal} {vehicle.placaRastra ? `/ ${vehicle.placaRastra}` : ''}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-semibold text-[10px] tracking-wider">Consignatario</span>
              <span className="text-slate-200 font-medium">{vehicle.consignatario}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-semibold text-[10px] tracking-wider">Marchamo</span>
              <span className="text-slate-200 font-mono">{vehicle.marchamo}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-semibold text-[10px] tracking-wider">Estado Portón</span>
              <span className="text-amber-400 font-bold font-mono">{vehicle.estado}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Columna Izquierda: Formulario de la DUCA (Header) */}
            <form onSubmit={handleGuardarCabecera} className="space-y-4 text-xs bg-[#0b0f19]/30 p-4 rounded-xl border border-slate-800">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                Encabezado Arancelario
              </h4>
              <div>
                <label className="block text-slate-400 font-medium mb-1 uppercase text-[10px]">No. Documento DUCA</label>
                <input 
                  required
                  type="text"
                  placeholder="Ej. DUCA-T-2026-9921"
                  value={ducaNumero}
                  onChange={e => setDucaNumero(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-800 text-slate-100 px-3 py-2 rounded-lg outline-none focus:border-cyan-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-medium mb-1 uppercase text-[10px]">Aduana Procedencia</label>
                <input 
                  required
                  type="text"
                  placeholder="Ej. Peñas Blancas"
                  value={aduanaProcedencia}
                  onChange={e => setAduanaProcedencia(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-800 text-slate-100 px-3 py-2 rounded-lg outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-medium mb-1 uppercase text-[10px]">Régimen</label>
                <select 
                  value={regimen}
                  onChange={e => setRegimen(e.target.value as any)}
                  className="w-full bg-[#0b0f19] border border-slate-800 text-slate-100 px-3 py-2 rounded-lg outline-none focus:border-cyan-500"
                >
                  <option value="FISCAL_A">Régimen Fiscal A</option>
                  <option value="GENERAL_B">Régimen General B</option>
                  <option value="PATIO">Tránsito / Patio</option>
                </select>
              </div>
              {!ducaAsociada && (
                <button type="submit" className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all uppercase tracking-wider text-[10px]">
                  Vincular Cabecera DUCA
                </button>
              )}
            </form>

            {/* Columna Derecha: Desglose físico y digitador de líneas */}
            <div className="md:col-span-2 space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">
                Líneas de Mercancía Asociadas
              </h4>

              {ducaAsociada ? (
                <>
                  {/* Tabla interna de renglones */}
                  <div className="overflow-x-auto border border-slate-800 rounded-lg max-h-40 overflow-y-auto font-mono text-[11px]">
                    <table className="w-full text-left">
                      <thead className="bg-[#0f1422] text-slate-400 uppercase text-[9px] border-b border-slate-800 sticky top-0">
                        <tr>
                          <th className="p-2.5 w-12 text-center">Línea</th>
                          <th className="p-2.5">Descripción</th>
                          <th className="p-2.5 text-right">Bultos</th>
                          <th className="p-2.5 text-right">Peso (Kg)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40 text-slate-300 bg-[#0b0f19]/20">
                        {ducaAsociada.detalles.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="p-3 text-center text-slate-500 font-sans">Sin renglones registrados en andén.</td>
                          </tr>
                        ) : (
                          ducaAsociada.detalles.map((det) => (
                            <tr key={det.id}>
                              <td className="p-2.5 text-center text-slate-500 font-bold">{det.linea}</td>
                              <td className="p-2.5 font-sans text-slate-200">{det.descripcion}</td>
                              <td className="p-2.5 text-right">{det.bultos}</td>
                              <td className="p-2.5 text-right text-cyan-400 font-bold">{det.pesoKg.toLocaleString()}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Formulario rápido insertor en línea */}
                  <form onSubmit={handleAddLinea} className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-xs">
                    <input 
                      required
                      type="text"
                      placeholder="Descripción ítem"
                      value={newLinea.descripcion}
                      onChange={e => setNewLinea({...newLinea, descripcion: e.target.value})}
                      className="bg-[#0b0f19] border border-slate-800 text-slate-100 px-2.5 py-1.5 rounded-md outline-none focus:border-cyan-500"
                    />
                    <input 
                      required
                      type="number"
                      placeholder="Bultos"
                      value={newLinea.bultos || ''}
                      onChange={e => setNewLinea({...newLinea, bultos: Number(e.target.value)})}
                      className="bg-[#0b0f19] border border-slate-800 text-slate-100 px-2.5 py-1.5 rounded-md outline-none focus:border-cyan-500 font-mono"
                    />
                    <div className="flex gap-1">
                      <input 
                        required
                        type="number"
                        step="0.01"
                        placeholder="Peso"
                        value={newLinea.pesoKg || ''}
                        onChange={e => setNewLinea({...newLinea, pesoKg: Number(e.target.value)})}
                        className="bg-[#0b0f19] border border-slate-800 text-slate-100 px-2.5 py-1.5 rounded-md outline-none focus:border-cyan-500 font-mono w-full"
                      />
                      <button type="submit" className="bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-400 border border-cyan-500/30 px-3 rounded-md font-bold">
                        ＋
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="p-6 text-center text-slate-500 italic border border-dashed border-slate-800 rounded-lg text-xs">
                  Por favor complete y vincule el encabezado arancelario a la izquierda para poder desglosar las líneas físicas.
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Footer del Modal */}
        <div className="bg-[#161c2e] px-5 py-3 border-t border-slate-800 flex justify-end gap-2 text-xs">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg transition-all"
          >
            Cerrar Ventana
          </button>
        </div>

      </div>
    </div>
  );
};