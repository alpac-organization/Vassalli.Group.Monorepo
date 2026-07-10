import React, { useState, useMemo } from 'react';
import { Button, DataTable } from '@alpac/design-system';
import { Plus } from 'lucide-react';
import { SearchInput } from '../searh-imput';
import { useWarehouse, type WarehouseItem } from '@app/modules/warehouse/ui/warehouse-managua/context/wareouse-context';
import { WarehouseStats } from './warehouse-stats';
import { GateEntryModal } from './gate-entry-modal';

export const GuardPanel: React.FC = () => {
  const [isEntryModalOpen, setEntryModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { itemsQueue } = useWarehouse(); 

  // Mapeo corregido según las llaves reales declaradas en wareouse-context.tsx
  const columns = [
    { key: "osNumber", label: "Orden Servicio" },
    { key: "placaCabezal", label: "Placa Cabezal" },
    { key: "conductor", label: "Conductor" },
    { key: "consignatario", label: "Consignatario" },
    { 
      key: "fechaIngreso", 
      label: "Ingreso",
      render: (row: WarehouseItem) => new Date(row.fechaIngreso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    { key: "estado", label: "Estado" },
    { 
      key: "actions", 
      label: "Acciones",
      render: (row: WarehouseItem) => ( 
        <Button 
          label="Detalle" 
          size="small" 
          className="text-alpac-primary-600! bg-transparent!" 
          onClick={() => console.log("Abriendo detalle de: ", row.osNumber)}
        />
      ) 
    },
  ];

  // Filtro reactivo en memoria para sorprender en la presentación
  const filteredItems = useMemo(() => {
    return itemsQueue.filter(item => 
      item.placaCabezal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.conductor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.osNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [itemsQueue, searchQuery]);

  return (
    <div className="flex flex-col gap-6 p-4 bg-[#121726] rounded-xl border border-slate-800">
      <WarehouseStats />
      
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-100">Cola de Movimientos</h2>
        <Button 
          label="Dar Entrada" 
          onClick={() => setEntryModalOpen(true)} 
          className="bg-alpac-primary-500 text-white" 
          icon={<Plus size={20} />} 
        />
      </div>

      {/* Buscador conectado al estado funcional */}
      <SearchInput 
        value={searchQuery} 
        onChange={(value: string) => setSearchQuery(value)} 
        placeholder="Buscar por placa, conductor u orden..."
      />
      
      <DataTable
        title=""
        data={filteredItems} 
        columns={columns}
      />

      <GateEntryModal isOpen={isEntryModalOpen} onClose={() => setEntryModalOpen(false)} />
    </div>
  );
};