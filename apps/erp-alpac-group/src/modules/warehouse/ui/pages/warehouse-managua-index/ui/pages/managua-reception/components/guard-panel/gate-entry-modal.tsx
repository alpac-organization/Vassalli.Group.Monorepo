import React, { useState } from 'react';
// Importación del sistema de diseño de packages
import { Modal } from '@alpac/design-system'; 
import { useWarehouse } from '@app/modules/warehouse/ui/pages/warehouse-managua-index/wareouse-context';

interface GuardEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuardEntryModal: React.FC<GuardEntryModalProps> = ({ isOpen, onClose }) => {
  const { addItemToQueue } = useWarehouse();
  const [form, setForm] = useState({
    paisDeOrigen: '',
    aduana: '',
    osNumber: '',
    horaEntrada: '',
    fechaEntrada: '',
    placaCabezal: '',
    placaRastra: '',
    conductor: '',
    licencia: '',
    transportista: '',
    medio: '',
    consignatario: '',
    marchamo: '',
    estado: 'PENDIENTE' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addItemToQueue(form);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Entrada de Transporte">
      <form onSubmit={handleSubmit} className="p-4 space-y-4 text-xs bg-[#111625]">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 font-medium mb-1 uppercase">Código de Orden / OS</label>
            <input required type="text" placeholder="OS-MGA-2026-X" value={form.osNumber} onChange={e => setForm({...form, osNumber: e.target.value})} className="w-full bg-[#0b0f19] border border-slate-800 text-white px-3 py-2 rounded-lg outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label className="block text-slate-400 font-medium mb-1 uppercase"># Fecha Entrada</label>
            <input required type="text" placeholder="Automatic" value={form.fechaEntrada} onChange={e => setForm({...form, fechaEntrada: e.target.value})} className="w-full bg-[#0b0f19] border border-slate-800 text-white px-3 py-2 rounded-lg outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label className="block text-slate-400 font-medium mb-1 uppercase"># Hora Entrada</label>
            <input required type="text" placeholder="Automatic" value={form.horaEntrada} onChange={e => setForm({...form, horaEntrada: e.target.value})} className="w-full bg-[#0b0f19] border border-slate-800 text-white px-3 py-2 rounded-lg outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label className="block text-slate-400 font-medium mb-1 uppercase">Nombre Conductor</label>
            <input required type="text" placeholder="Nombre completo" value={form.conductor} onChange={e => setForm({...form, conductor: e.target.value})} className="w-full bg-[#0b0f19] border border-slate-800 text-white px-3 py-2 rounded-lg outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label className="block text-slate-400 font-medium mb-1 uppercase">Placa Cabezal</label>
            <input required type="text" placeholder="M 123456" value={form.placaCabezal} onChange={e => setForm({...form, placaCabezal: e.target.value})} className="w-full bg-[#0b0f19] border border-slate-800 text-white px-3 py-2 rounded-lg outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label className="block text-slate-400 font-medium mb-1 uppercase">Placa Rastra</label>
            <input type="text" placeholder="RE 1234" value={form.placaRastra} onChange={e => setForm({...form, placaRastra: e.target.value})} className="w-full bg-[#0b0f19] border border-slate-800 text-white px-3 py-2 rounded-lg outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label className="block text-slate-400 font-medium mb-1 uppercase"># Pais de Origen</label>
            <input required type="text" placeholder="Mexico" value={form.paisDeOrigen} onChange={e => setForm({...form, paisDeOrigen: e.target.value})} className="w-full bg-[#0b0f19] border border-slate-800 text-white px-3 py-2 rounded-lg outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label className="block text-slate-400 font-medium mb-1 uppercase"># Licencia</label>
            <input required type="text" placeholder="AASF843 " value={form.licencia} onChange={e => setForm({...form, licencia: e.target.value})} className="w-full bg-[#0b0f19] border border-slate-800 text-white px-3 py-2 rounded-lg outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label className="block text-slate-400 font-medium mb-1 uppercase"># Aduana</label>
            <input required type="text" placeholder="Las Manos " value={form.aduana} onChange={e => setForm({...form, aduana: e.target.value})} className="w-full bg-[#0b0f19] border border-slate-800 text-white px-3 py-2 rounded-lg outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label className="block text-slate-400 font-medium mb-1 uppercase">Transportista</label>
            <input required type="text" placeholder="Velazquez" value={form.transportista} onChange={e => setForm({...form, transportista: e.target.value})} className="w-full bg-[#0b0f19] border border-slate-800 text-white px-3 py-2 rounded-lg outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label className="block text-slate-400 font-medium mb-1 uppercase"># Medio</label>
            <input required type="text" placeholder="Furgón" value={form.medio} onChange={e => setForm({...form, medio: e.target.value})} className="w-full bg-[#0b0f19] border border-slate-800 text-white px-3 py-2 rounded-lg outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label className="block text-slate-400 font-medium mb-1 uppercase">Consignatario</label>
            <input required type="text" placeholder="Compañía Destino" value={form.consignatario} onChange={e => setForm({...form, consignatario: e.target.value})} className="w-full bg-[#0b0f19] border border-slate-800 text-white px-3 py-2 rounded-lg outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label className="block text-slate-400 font-medium mb-1 uppercase"># Marchamo</label>
            <input required type="text" placeholder="FFDS54568" value={form.marchamo} onChange={e => setForm({...form, marchamo: e.target.value})} className="w-full bg-[#0b0f19] border border-slate-800 text-white px-3 py-2 rounded-lg outline-none focus:border-cyan-500" />
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg text-white">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-xs rounded-lg text-white font-medium">Registrar Entrada</button>
        </div>
      </form>
    </Modal>
  );
};