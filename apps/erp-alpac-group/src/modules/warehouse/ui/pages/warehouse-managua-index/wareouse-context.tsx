// apps/erp-alpac-group/src/modules/warehouse-managua-index/warehouse-context.tsx
import React, { createContext, useContext, useState } from "react";

export type WarehouseStep = 
  | "EN_COLA" 
  | "DATOS_VEHICULO" 
  | "ESPERA_ADUANA" 
  | "REGISTRO_DUCAT" 
  | "ASIGNACION_BODEGA" 
  | "DESCARGA_ESTIBACION" 
  | "CANCELACION_MANIFIESTO" 
  | "RECIBO_BODEGA";

export type WarehouseRole = "MASTER" | "GUARDA" | "RECEPTOR" | "BODEGUERO" | "JEFE";

export interface WarehouseItem {
  id: string;
  osNumber: string;
  isTransit: boolean;
  status: WarehouseStep;
  createdAt: string;
  timestamps: {
    arrival?: string;
    completed?: string;
  };
}

interface WarehouseContextProps {
  itemsQueue: WarehouseItem[];
  selectedRole: WarehouseRole;
  setSelectedRole: React.Dispatch<React.SetStateAction<WarehouseRole>>;
  selectItemFromQueue: (id: string) => void;
}

const WarehouseContext = createContext<WarehouseContextProps | undefined>(undefined);

export const WarehouseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [itemsQueue] = useState<WarehouseItem[]>([
    { id: "os-9942", osNumber: "OS-CLIENTE-9942", isTransit: true, status: "REGISTRO_DUCAT", createdAt: new Date().toISOString(), timestamps: {} },
    { id: "os-nov", osNumber: "OS-NOV-2025", isTransit: false, status: "DESCARGA_ESTIBACION", createdAt: "2025-11-14T08:00:00.000Z", timestamps: {} }
  ]);

  const [selectedRole, setSelectedRole] = useState<WarehouseRole>("MASTER");

  const selectItemFromQueue = (id: string) => {
    console.log("Seleccionando orden operativa:", id);
  };

  return (
    <WarehouseContext.Provider value={{ itemsQueue, selectedRole, setSelectedRole, selectItemFromQueue }}>
      {children}
    </WarehouseContext.Provider>
  );
};

export const useWarehouse = () => {
  const context = useContext(WarehouseContext);
  if (!context) throw new Error("useWarehouse debe usarse dentro de WarehouseProvider");
  return context;
};