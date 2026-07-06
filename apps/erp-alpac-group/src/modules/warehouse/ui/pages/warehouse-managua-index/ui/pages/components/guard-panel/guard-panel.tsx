import React, { useState } from 'react';
import { Button, DataTable } from '@alpac/design-system';
import { Plus, LogOut } from 'lucide-react';
import { WarehouseStats } from './warehouse-stats'; 
import { GateEntryModal } from './gate-entry-modal';
import { useWarehouse, type WarehouseItem } from '@app/modules/warehouse/ui/pages/warehouse-managua-index/context/wareouse-context'; // Importación correcta del contexto

export const GuardPanel: React.FC = () => {
  const [isEntryModalOpen, setEntryModalOpen] = useState(false);
  const { itemsQueue } = useWarehouse(); // Consumiendo el estado real

  const columns = [
  { key: "plateNumber", label: "Placa Cabezal" },
  { key: "driverName", label: "Conductor" },
  { key: "transportista", label: "Transportista" },
  { key: "entryDate", label: "Ingreso" },
  { key: "status", label: "Estado" },
  { 
    key: "actions", 
    label: "Acciones",
    // Corregido: recibe solo 'row' (del tipo WarehouseItem)
    render: (row: WarehouseItem) => ( 
      <Button 
        label="Detalle" 
        size="small" 
        className="text-alpac-primary-600! bg-transparent!" 
      />
    ) 
  },
];

  return (
    <div className="flex flex-col gap-6 p-4 bg-[#121726] rounded-xl border border-slate-800">
      <WarehouseStats />
      
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-100">Cola de Movimientos</h2>
        <Button 
          label="Dar Entrada" 
          onClick={() => setEntryModalOpen(true)} 
          className="bg-alpac-primary-500 text-white" 
          icon={<Plus size={30} />} 
        />
      </div>

      <DataTable
        title=""
        data={itemsQueue} // Datos tipados provenientes del contexto
        columns={columns}
      />

      <GateEntryModal isOpen={isEntryModalOpen} onClose={() => setEntryModalOpen(false)} />
    </div>
  );
};