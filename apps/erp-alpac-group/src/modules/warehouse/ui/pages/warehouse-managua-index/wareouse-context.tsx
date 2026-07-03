import React, { createContext, useContext, useState } from "react";

// Declaramos la interfaz aquí mismo para que no dependa de ningún archivo externo vacío o mal enrutado
export interface WarehouseItemResponse {
  id: string;
  osNumber: string;
  placaCabezal: string;
  conductor: string;
  estado: 'EN_COLA' | 'ADUANA' | 'DESCARGANDO' | 'COMPLETADO';
  tiempoRestanteMinutos: number;
  duca: string;
  tipoRegimen: 'FISCAL_A' | 'GENERAL_B' | 'PATIO';
  bultosDeclarados: number;
  pesoKg: number;
  fechaIngreso: string;
}

export type WarehouseRole = "MASTER" | "GUARDA" | "RECEPTOR" | "BODEGUERO" | "JEFE";

interface WarehouseContextProps {
  itemsQueue: WarehouseItemResponse[];
  selectedItem: WarehouseItemResponse | null;
  selectedRole: WarehouseRole;
  setSelectedRole: React.Dispatch<React.SetStateAction<WarehouseRole>>;
  selectItemFromQueue: (id: string) => void;
  updateItemStatus: (id: string, nuevoEstado: WarehouseItemResponse['estado']) => void;
}

const WarehouseContext = createContext<WarehouseContextProps | undefined>(undefined);

export const WarehouseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Mocks robustos basados en la operación real de Managua
  const [itemsQueue, setItemsQueue] = useState<WarehouseItemResponse[]>([
    { id: '1', osNumber: 'OS-9942', placaCabezal: 'M 123-456', conductor: 'Juan Carlos Pérez', estado: 'ADUANA', tiempoRestanteMinutos: 14, duca: 'DUCA-T-2026-9921', tipoRegimen: 'FISCAL_A', bultosDeclarados: 450, pesoKg: 12400.5, fechaIngreso: new Date().toISOString() },
    { id: '2', osNumber: 'OS-NOV-2025', placaCabezal: 'LE 789-101', conductor: 'Marcos Antonio Gómez', estado: 'EN_COLA', tiempoRestanteMinutos: 45, duca: 'DUCA-C-2026-4412', tipoRegimen: 'GENERAL_B', bultosDeclarados: 200, pesoKg: 5000, fechaIngreso: new Date().toISOString() },
    { id: '3', osNumber: 'OS-1002', placaCabezal: 'CH 234-567', conductor: 'Silvio Duarte Rostrán', estado: 'DESCARGANDO', tiempoRestanteMinutos: 0, duca: 'DUCA-T-2026-1102', tipoRegimen: 'PATIO', bultosDeclarados: 600, pesoKg: 22000, fechaIngreso: new Date().toISOString() }
  ]);

  const [selectedItem, setSelectedItem] = useState<WarehouseItemResponse | null>(null);
  const [selectedRole, setSelectedRole] = useState<WarehouseRole>("MASTER");

  const selectItemFromQueue = (id: string) => {
    const item = itemsQueue.find(q => q.id === id) || null;
    setSelectedItem(item);
  };

  const updateItemStatus = (id: string, nuevoEstado: WarehouseItemResponse['estado']) => {
    setItemsQueue(prev => prev.map(item => item.id === id ? { ...item, estado: nuevoEstado } : item));
    if (selectedItem?.id === id) {
      setSelectedItem(prev => prev ? { ...prev, estado: nuevoEstado } : null);
    }
  };

  return (
    <WarehouseContext.Provider value={{ itemsQueue, selectedItem, selectedRole, setSelectedRole, selectItemFromQueue, updateItemStatus }}>
      {children}
    </WarehouseContext.Provider>
  );
};

export const useWarehouse = () => {
  const context = useContext(WarehouseContext);
  if (!context) throw new Error("useWarehouse debe usarse dentro de WarehouseProvider");
  return context;
};