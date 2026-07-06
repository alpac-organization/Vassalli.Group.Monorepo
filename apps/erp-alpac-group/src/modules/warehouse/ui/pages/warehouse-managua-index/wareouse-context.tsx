import React, { createContext, useContext, useState } from "react";

// === INTERFACES DE ENTIDADES DEL MÓDULO ===

export interface WarehouseItem {
  id: string;
  osNumber: string;
  placaCabezal: string;
  placaRastra?: string;
  conductor: string;
  consignatario: string;
  marchamo: string;
  estado: 'PENDIENTE' | 'ADUANA' | 'DESCARGANDO' | 'COMPLETADO';
  fechaIngreso: string;
}

export interface DucaDetail {
  id: string;
  linea: number;
  descripcion: string;
  bultos: number;
  pesoKg: number;
}

export interface DucaHeader {
  id: string;
  osNumber: string;
  ducaNumero: string;
  regimen: 'FISCAL_A' | 'GENERAL_B' | 'PATIO';
  aduanaProcedencia: string;
  estado: 'PENDIENTE' | 'VERIFICANDO' | 'COMPLETADO';
  detalles: DucaDetail[];
}

interface WarehouseContextProps {
  itemsQueue: WarehouseItem[];
  addItemToQueue: (item: Omit<WarehouseItem, 'id' | 'fechaIngreso'>) => void;
  ducaList: DucaHeader[];
  updateDucaStatus: (id: string, nuevoEstado: DucaHeader['estado']) => void;
  addDucaDetail: (ducaId: string, detail: Omit<DucaDetail, 'id'>) => void;
  createDucaHeader: (header: Omit<DucaHeader, 'id' | 'estado' | 'detalles'>) => void;
}

const WarehouseContext = createContext<WarehouseContextProps | undefined>(undefined);

export const WarehouseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  // 1. ESTADO DE LA COLA DE ESPERA (INGRESOS DE PORTÓN)
  const [itemsQueue, setItemsQueue] = useState<WarehouseItem[]>([
    {
      id: "1",
      osNumber: "OS-CLIENTE-9942",
      placaCabezal: "M 123-456",
      placaRastra: "RE-8821",
      conductor: "Juan Carlos Pérez",
      consignatario: "Asia Logistic S.A.",
      marchamo: "02/07/2026",
      estado: "PENDIENTE",
      fechaIngreso: new Date().toISOString()
    },
    {
      id: "2",
      osNumber: "OS-CLIENTE-9943",
      placaCabezal: "M 284-915",
      placaRastra: "RE-4412",
      conductor: "Marcos Antonio Solís",
      consignatario: "Distribuidora del Pacífico S.A.",
      marchamo: "02/07/2026",
      estado: "PENDIENTE",
      fechaIngreso: new Date().toISOString()
    },
    {
      id: "3",
      osNumber: "OS-CLIENTE-9944",
      placaCabezal: "CH 195-234",
      placaRastra: "RE-7751",
      conductor: "Danilo Blandón",
      consignatario: "Comercializadora Internacional",
      marchamo: "02/07/2026",
      estado: "PENDIENTE",
      fechaIngreso: new Date().toISOString()
    },
    {
      id: "4",
      osNumber: "OS-CLIENTE-9945",
      placaCabezal: "M 311-502",
      placaRastra: "RE-9903",
      conductor: "Carlos Alberto Mendoza",
      consignatario: "Asia Logistic S.A.",
      marchamo: "03/07/2026",
      estado: "COMPLETADO",
      fechaIngreso: new Date().toISOString()
    },
    {
      id: "5",
      osNumber: "OS-CLIENTE-9946",
      placaCabezal: "LE 12-485",
      placaRastra: "RE-1124",
      conductor: "José Luis Jirón",
      consignatario: "Corporación Textilera S.A.",
      marchamo: "03/07/2026",
      estado: "PENDIENTE",
      fechaIngreso: new Date().toISOString()
    },
    {
      id: "6",
      osNumber: "OS-CLIENTE-9947",
      placaCabezal: "M 105-764",
      placaRastra: "RE-3358",
      conductor: "Ramiro Gutiérrez",
      consignatario: "Almacenadora Central",
      marchamo: "03/07/2026",
      estado: "PENDIENTE",
      fechaIngreso: new Date().toISOString()
    },
    {
      id: "7",
      osNumber: "OS-CLIENTE-9948",
      placaCabezal: "CH 224-819",
      placaRastra: "RE-6610",
      conductor: "Félix Pedro Pastora",
      consignatario: "Asia Logistic S.A.",
      marchamo: "03/07/2026",
      estado: "PENDIENTE",
      fechaIngreso: new Date().toISOString()
    },
    {
      id: "8",
      osNumber: "OS-CLIENTE-9949",
      placaCabezal: "M 189-432",
      placaRastra: "RE-5591",
      conductor: "Wilmer Javier Rocha",
      consignatario: "Importaciones y Más S.A.",
      marchamo: "03/07/2026",
      estado: "COMPLETADO",
      fechaIngreso: new Date().toISOString()
    },
    {
      id: "9",
      osNumber: "OS-CLIENTE-9950",
      placaCabezal: "LE 33-107",
      placaRastra: "RE-2284",
      conductor: "Álvaro Ruiz Martínez",
      consignatario: "Logística Integrada S.A.",
      marchamo: "03/07/2026",
      estado: "PENDIENTE",
      fechaIngreso: new Date().toISOString()
    }
  ]);

  // 2. ESTADO DE LOS ENCABEZADOS ARANCELARIOS (DUCA)
  const [ducaList, setDucaList] = useState<DucaHeader[]>([
    {
      id: "duca-1",
      osNumber: "OS-CLIENTE-9942",
      ducaNumero: "DUCA-T-2026-9921",
      regimen: "FISCAL_A",
      aduanaProcedencia: "Peñas Blancas",
      estado: "PENDIENTE",
      detalles: [
        { id: "det-1", linea: 1, descripcion: "Repuestos Automotrices", bultos: 150, pesoKg: 4500 },
        { id: "det-2", linea: 2, descripcion: "Llantas Radiales R16", bultos: 300, pesoKg: 7900.5 }
      ]
    }
  ]);

  // === OPERACIONES TRANSACCIONALES (MÉTODOS MUTADORES) ===

  const addItemToQueue = (newItem: Omit<WarehouseItem, 'id' | 'fechaIngreso'>) => {
    const itemWithId: WarehouseItem = {
      ...newItem,
      id: `os-${Date.now()}`,
      fechaIngreso: new Date().toISOString()
    };
    setItemsQueue((prev) => [itemWithId, ...prev]);
  };

  const createDucaHeader = (header: Omit<DucaHeader, 'id' | 'estado' | 'detalles'>) => {
    const nuevoHeader: DucaHeader = {
      ...header,
      id: `duca-${Date.now()}`,
      estado: 'PENDIENTE',
      detalles: []
    };
    setDucaList(prev => [...prev, nuevoHeader]);
  };

  const updateDucaStatus = (id: string, nuevoEstado: DucaHeader['estado']) => {
    setDucaList(prev => prev.map(d => d.id === id ? { ...d, estado: nuevoEstado } : d));
  };

  const addDucaDetail = (ducaId: string, detail: Omit<DucaDetail, 'id'>) => {
    setDucaList(prev => prev.map(d => {
      if (d.id !== ducaId) return d;
      const nuevoDetalle: DucaDetail = {
        ...detail,
        id: `det-${Date.now()}`
      };
      return { ...d, detalles: [...d.detalles, nuevoDetalle] };
    }));
  };

  return (
    <WarehouseContext.Provider value={{ 
      itemsQueue, 
      addItemToQueue, 
      ducaList, 
      updateDucaStatus, 
      addDucaDetail, 
      createDucaHeader 
    }}>
      {children}
    </WarehouseContext.Provider>
  );
};

export const useWarehouse = () => {
  const context = useContext(WarehouseContext);
  if (!context) throw new Error("useWarehouse debe usarse dentro de WarehouseProvider");
  return context;
};