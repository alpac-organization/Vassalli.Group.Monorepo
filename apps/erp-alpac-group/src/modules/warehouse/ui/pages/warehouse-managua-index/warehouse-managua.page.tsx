// apps/erp-alpac-group/src/modules/warehouse-managua-index/warehouse-managua.page.tsx
import React, { useState } from "react";
import { WarehouseProvider, useWarehouse } from "../warehouse-managua-index/wareouse-context";
import type { WarehouseRole } from "../warehouse-managua-index/wareouse-context";

// Importación modular exacta según tu estructura de archivos
import { Step1VehicleForm } from "./components/step1-vehicle-form";
import { Step2CustomsWait } from "./components/step2-customs-wait";
import { Step3DucatRegistry } from "./components/step3-ducat-registry";
import { Step4WarehouseAssignment } from "./components/step4-warehouse-assignment";
import { Step5UnloadingDiscrepancy } from "./components/step5-unloading-discrepancy";
import { Step6ManifestCancellation } from "./components/step6-manifest-cancellation";
import { Step7WarehouseReceipt } from "./components/step7-warehouse-receipt";

const WarehouseControlCenterContent: React.FC = () => {
  const { selectedRole, setSelectedRole } = useWarehouse();
  
  // El paso activo del timeline (mapeado a WorkflowStepDefinition / CurrentStepId)
  const [activeTimelineStep, setActiveTimelineStep] = useState<string>("GUARDIA");

  // Estado para simulación del rack seleccionado en el WMS
  const [selectedRack, setSelectedRack] = useState<{ id: string; ocupacion: number; cliente: string; productos: string[] } | null>({
    id: "Rack A2",
    ocupacion: 87,
    cliente: "SIMAN Nicaragua",
    productos: ["Cascos de moto para niños", "Tela de alfombra industrial"]
  });

  // Datos de ocupación volumétrica (Warehouses)
  const mockWarehouses = [
    { name: "Bodega Fiscal A (Managua)", usage: 30, color: "bg-emerald-500" },
    { name: "Galerón Techado B", usage: 55, color: "bg-amber-500" },
    { name: "Patio de Contenedores C", usage: 30, color: "bg-emerald-500" },
  ];

  // Matriz de Racks (RacksManagua)
  const mockRacks = [
    { id: "A1", status: "lleno", pct: 100 },
    { id: "A2", status: "alerta", pct: 87 },
    { id: "A3", status: "libre", pct: 0 },
    { id: "A4", status: "lleno", pct: 95 },
    { id: "B1", status: "lleno", pct: 100 },
    { id: "B2", status: "libre", pct: 12 },
    { id: "B3", status: "alerta", pct: 74 },
    { id: "B4", status: "lleno", pct: 98 },
  ];

  // Renderizador dinámico del contenedor central usando tus componentes externos
  const renderActiveStep = () => {
    switch (activeTimelineStep) {
      case "GUARDIA": 
        return <Step1VehicleForm onComplete={() => setActiveTimelineStep("ADUANA")} />;
      case "ADUANA": 
        return <Step2CustomsWait onComplete={() => setActiveTimelineStep("REGISTRO_DUCAT")} />;
      case "REGISTRO_DUCAT": 
        return <Step3DucatRegistry />;
      case "BODEGA": 
        return <Step4WarehouseAssignment />;
      case "DESCARGA": 
        return <Step5UnloadingDiscrepancy />;
      case "MANIFIESTO": 
        return <Step6ManifestCancellation />;
      case "RECIBO": 
        return <Step7WarehouseReceipt />;
      default:
        return (
          <div className="text-center py-10 text-xs text-slate-500 uppercase tracking-widest font-mono">
            Selecciona una etapa en el timeline superior
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1d24] p-6 text-slate-100 font-sans antialiased selection:bg-emerald-500/30">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* ============================================================================
            1. HEADER PRINCIPAL (CENTRO DE OPERACIONES ALPAC)
            ============================================================================ */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-[#22262f] border border-slate-700/50 p-6 rounded-xl shadow-xl shadow-black/20">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Sistemas de Gestión de Almacenes (WMS)</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">WAREHOUSE CONTROL CENTER</h1>
            <p className="text-xs text-slate-400">Control en tiempo real del ciclo de mercancías, auditoría de discrepancias fiscales y flujos logísticos en vivo.</p>
          </div>
          
          <div className="mt-4 lg:mt-0 flex items-center gap-4 bg-[#1a1d24] p-3 rounded-xl border border-slate-700/60 shadow-inner">
            <div className="text-right">
              <span className="text-xs font-bold block text-slate-200">ALPAC Group</span>
              <span className="text-[10px] font-mono font-medium text-slate-400 block">Sucursal Managua — Bodega Fiscal</span>
            </div>
            <div className="h-8 w-[1px] bg-slate-700/60" />
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Perfil Operativo</span>
              <select 
                value={selectedRole} 
                onChange={(e) => setSelectedRole(e.target.value as WarehouseRole)}
                className="bg-[#22262f] text-xs font-bold text-emerald-400 rounded-md border border-slate-700/80 px-2.5 py-1 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="MASTER">Ventanilla Única (Master)</option>
                <option value="GUARDA">Seguridad / Garita (Guarda)</option>
                <option value="RECEPTOR">Recepción DUCAT</option>
                <option value="BODEGUERO">Operador de Bodega</option>
                <option value="JEFE">Jefatura de Operaciones</option>
              </select>
            </div>
          </div>
        </header>

        {/* ============================================================================
            2. KPIS SUPERIORES (ESTADOS DEL FLUJO LOGÍSTICO)
            ============================================================================ */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-[#22262f] border border-slate-700/40 p-4 rounded-xl shadow-md space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">📦 En Recepción</span>
            <div className="text-2xl font-black text-slate-100">12</div>
            <span className="text-[10px] text-slate-500 block">Vehículos en proceso de ingreso</span>
          </div>
          <div className="bg-[#22262f] border border-slate-700/40 p-4 rounded-xl shadow-md space-y-1">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">🚚 Descargando</span>
            <div className="text-2xl font-black text-blue-400">8</div>
            <span className="text-[10px] text-slate-500 block">Operaciones activas</span>
          </div>
          <div className="bg-[#22262f] border border-slate-700/40 p-4 rounded-xl shadow-md space-y-1">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">🏢 En Bodega</span>
            <div className="text-2xl font-black text-emerald-400">542</div>
            <span className="text-[10px] text-slate-500 block">Lotes almacenados</span>
          </div>
          <div className="bg-[#22262f] border border-slate-700/40 p-4 rounded-xl shadow-md space-y-1">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">📤 Pendientes Despacho</span>
            <div className="text-2xl font-black text-indigo-400">5</div>
            <span className="text-[10px] text-slate-500 block">Esperando salida</span>
          </div>
          <div className="bg-red-950/20 border border-red-500/30 p-4 rounded-xl shadow-md space-y-1 col-span-2 md:col-span-1">
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">⚠️ Incidencias</span>
            <div className="text-2xl font-black text-red-400">3</div>
            <span className="text-[10px] text-red-400/60 block">Discrepancias activas</span>
          </div>
        </section>

        {/* ============================================================================
            3. ALERTAS INTELIGENTES + OCUPACIÓN DE BODEGAS
            ============================================================================ */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#22262f] border border-slate-700/50 p-5 rounded-xl flex flex-col gap-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-700/50 pb-2 block">
              ALERTAS DEL SISTEMA
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-[#1a1d24] border-l-2 border-red-500 p-3 rounded-lg space-y-1">
                <div className="flex justify-between items-center"><span className="text-xs font-mono font-bold text-slate-200">⚠ DUCAT-5842</span></div>
                <p className="text-[11px] font-bold text-slate-300">18 días almacenado</p>
                <p className="text-[10px] text-slate-400">Próximo a abandono fiscal.</p>
              </div>
              <div className="bg-[#1a1d24] border-l-2 border-amber-500 p-3 rounded-lg space-y-1">
                <div className="flex justify-between items-center"><span className="text-xs font-mono font-bold text-slate-200">⚠ OS-1058</span></div>
                <p className="text-[11px] text-slate-400">Esperando verificación aduanera desde hace 2 días.</p>
              </div>
              <div className="bg-[#1a1d24] border-l-2 border-red-500 p-3 rounded-lg space-y-1">
                <div className="flex justify-between items-center"><span className="text-xs font-mono font-bold text-slate-200">⚠ DUCAT-8451</span></div>
                <p className="text-[11px] font-bold text-red-400">Diferencia detectada:</p>
                <p className="text-[10px] text-slate-400">5 bultos faltantes.</p>
              </div>
            </div>
          </div>

          <div className="bg-[#22262f] border border-slate-700/50 p-5 rounded-xl flex flex-col gap-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-700/50 pb-2 block">
              OCUPACIÓN DE BODEGAS
            </span>
            <div className="flex flex-col gap-3.5">
              {mockWarehouses.map((wh, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-semibold text-slate-300">{wh.name}</span>
                    <span className="font-mono font-bold text-slate-200">{wh.usage}%</span>
                  </div>
                  <div className="w-full bg-[#1a1d24] h-2 rounded-full overflow-hidden border border-slate-700/40">
                    <div className={`${wh.color} h-full transition-all duration-500`} style={{ width: `${wh.usage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================================
            4. TIMELINE OPERACIONAL EN TIEMPO REAL
            ============================================================================ */}
        <section className="bg-[#22262f] border border-slate-700/50 p-5 rounded-xl flex flex-col gap-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-700/50 pb-1 block">
            FLUJO OPERATIVO EN TIEMPO REAL
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { code: "GUARDIA", label: "GUARDAS", count: 12, border: "border-blue-500/40 text-blue-400 bg-blue-950/10" },
              { code: "ADUANA", label: "ESPERA ADUANA", count: 8, border: "border-amber-500/40 text-amber-400 bg-amber-950/10" },
              { code: "REGISTRO_DUCAT", label: "REGISTRO DUCAT", count: 20, border: "border-slate-700 text-slate-400 bg-[#1a1d24]" },
              { code: "BODEGA", label: "ASIGNACIÓN BODEGA", count: 15, border: "border-slate-700 text-slate-400 bg-[#1a1d24]" },
              { code: "DESCARGA", label: "DESCARGA", count: 7, border: "border-slate-700 text-slate-400 bg-[#1a1d24]" },
              { code: "MANIFIESTO", label: "MANIFIESTO", count: 5, border: "border-red-500/40 text-red-400 bg-red-950/10" },
              { code: "RECIBO", label: "RECIBO BODEGA", count: 3, border: "border-slate-700 text-slate-400 bg-[#1a1d24]" },
            ].map((step) => (
              <div 
                key={step.code}
                onClick={() => setActiveTimelineStep(step.code)}
                className={`p-3 rounded-xl border text-center cursor-pointer transition-all duration-200 group relative ${step.border} ${activeTimelineStep === step.code ? "ring-2 ring-emerald-500 ring-offset-2 ring-offset-[#22262f]" : "hover:border-slate-500"}`}
              >
                <span className="text-[10px] font-bold block uppercase tracking-wider opacity-80">{step.label}</span>
                <div className="text-xl font-black font-mono mt-1">{step.count}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================================
            5. ÁREA CENTRAL: FORMULARIO DINÁMICO (RENDER STEP) + MAPA DE RACKS
            ============================================================================ */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Contenedor del Paso Activo */}
          <div className="lg:col-span-2 bg-[#22262f] border border-slate-700/50 p-5 rounded-xl flex flex-col justify-between min-h-[340px]">
            {renderActiveStep()}
          </div>

          {/* Mapa Visual de Racks */}
          <div className="lg:col-span-3 bg-[#22262f] border border-slate-700/50 p-5 rounded-xl flex flex-col gap-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-700/50 pb-2 block">
              MAPA DE RACKS — BODEGA FISCAL A
            </span>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <div className="md:col-span-2 grid grid-cols-4 gap-2 bg-[#1a1d24] p-3 rounded-lg border border-slate-700/60 shadow-inner">
                {mockRacks.map((rack) => (
                  <button
                    key={rack.id}
                    onClick={() => setSelectedRack({
                      id: `Rack ${rack.id}`,
                      ocupacion: rack.pct,
                      cliente: rack.pct > 50 ? "Nike Logistics" : "Yamaha Motors",
                      productos: rack.pct > 0 ? ["Cascos infantiles", "Tela industrial", "Moldes"] : ["Ubicación Libre"]
                    })}
                    className={`h-11 rounded font-mono text-xs font-bold transition-all border flex flex-col items-center justify-center ${
                      rack.status === "lleno" ? "bg-red-950/40 border-red-500/40 text-red-400" :
                      rack.status === "alerta" ? "bg-amber-950/40 border-amber-500/40 text-amber-400" :
                      "bg-emerald-950/20 border-emerald-500/30 text-emerald-400"
                    } hover:scale-105`}
                  >
                    <span>{rack.id}</span>
                    <span className="text-[8px] opacity-60">{rack.pct}%</span>
                  </button>
                ))}
              </div>

              {/* Detalle del Slot */}
              <div className="md:col-span-1 bg-[#1a1d24] border border-slate-700/60 rounded-lg p-3 space-y-2.5 text-xs">
                {selectedRack ? (
                  <>
                    <h5 className="font-bold text-slate-200 border-b border-slate-700 pb-1">{selectedRack.id}</h5>
                    <p className={`font-mono font-bold ${selectedRack.ocupacion > 80 ? "text-red-400" : "text-emerald-400"}`}>{selectedRack.ocupacion}% Lleno</p>
                    <p className="text-slate-400"><strong className="text-slate-300">Cliente:</strong> {selectedRack.cliente}</p>
                    <div>
                      <span className="text-slate-400 font-semibold block mb-1">Productos:</span>
                      {selectedRack.productos.map((p, i) => (
                        <span key={i} className="block text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 mb-1 truncate">• {p}</span>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-slate-500 text-center py-8 font-mono uppercase tracking-widest">Selecciona un rack</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================================
            6. ACCESOS RÁPIDOS
            ============================================================================ */}
        <footer className="bg-[#22262f] border border-slate-700/50 p-4 rounded-xl flex flex-wrap gap-3 shadow-md">
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg shadow-sm transition-colors">
            + Nueva Orden de Servicio
          </button>
          <button className="bg-[#1a1d24] hover:bg-slate-800 text-slate-200 font-bold text-[11px] uppercase tracking-wider px-4 py-2.5 rounded-lg border border-slate-700/60 transition-colors">
            + Registrar DUCAT
          </button>
          <button className="bg-[#1a1d24] hover:bg-slate-800 text-slate-200 font-bold text-[11px] uppercase tracking-wider px-4 py-2.5 rounded-lg border border-slate-700/60 transition-colors">
            + Asignar Bodega
          </button>
          <button className="bg-[#1a1d24] hover:bg-slate-800 text-slate-200 font-bold text-[11px] uppercase tracking-wider px-4 py-2.5 rounded-lg border border-slate-700/60 transition-colors">
            + Crear Recibo
          </button>
          <button className="bg-[#1a1d24] hover:bg-slate-800 text-slate-200 font-bold text-[11px] uppercase tracking-wider px-4 py-2.5 rounded-lg border border-slate-700/60 transition-colors ml-auto">
            Consultar Racks
          </button>
        </footer>

      </div>
    </div>
  );
};

export const WarehouseManaguaPage: React.FC = () => (
  <WarehouseProvider>
    <WarehouseControlCenterContent />
  </WarehouseProvider>
);