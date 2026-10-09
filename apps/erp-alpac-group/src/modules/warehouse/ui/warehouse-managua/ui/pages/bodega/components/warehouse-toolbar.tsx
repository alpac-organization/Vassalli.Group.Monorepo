import { useState, useRef, useEffect } from "react";
import {
  Boxes,
  Building2,
  CheckSquare,
  ChevronDown,
  Compass,
  Eye,
  Grid3X3,
  Hand,
  Layers,
  Package,
  Rotate3d,
  Target,
  ZoomIn,
  ZoomOut,
  X,
} from "lucide-react";
import { useBodegaViewerStore } from "../stores/use-bodega-viewer-store";
import type { CameraProps, LayerFilterMode, ViewerLayer } from "../types/warehouse-3d.types";

interface WarehouseToolbarProps {
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
}

export function WarehouseToolbar(WarehouseToolbarProps: WarehouseToolbarProps) {
  const {
    showWarehouse,
    showSections,
    showRacks,
    showTramos,
    showPositions,
    showCargo,
    layerFilterMode,
    navigationMode,
    isPreselectionMode,
    preselectedPositions,
    toggleLayer,
    isolateLayer,
    resetLayers,
    setNavigationMode,
    togglePanMode,
    togglePreselectionMode,
    requestCameraPreset,
    triggerZoom,
  } = useBodegaViewerStore();

  const [openAccordion, setOpenAccordion] = useState<"layers" | "views" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cerrar menú al hacer clic o tocar fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenAccordion(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleIsolate = (mode: LayerFilterMode) => {
    isolateLayer(mode);
  };

  const handleToggle = (layer: ViewerLayer) => {
    toggleLayer(layer);
  };

  const handlePreset = (preset: CameraProps) => {
    requestCameraPreset(preset);
  };

  const activeLayersCount = [
    showWarehouse,
    showSections,
    showRacks,
    showTramos,
    showPositions,
    showCargo,
  ].filter(Boolean).length;

  const layersList = [
    {
      key: "warehouse" as ViewerLayer,
      label: "Paredes",
      icon: Building2,
      active: showWarehouse,
      color: "text-amber-400",
    },
    {
      key: "sections" as ViewerLayer,
      label: "Secciones",
      icon: Grid3X3,
      active: showSections,
      color: "text-yellow-400",
    },
    {
      key: "racks" as ViewerLayer,
      label: "Estructuras Racks",
      icon: Layers,
      active: showRacks,
      color: "text-orange-400",
    },
    {
      key: "tramos" as ViewerLayer,
      label: "Tramos de Piso",
      icon: Boxes,
      active: showTramos,
      color: "text-emerald-400",
    },
    {
      key: "positions" as ViewerLayer,
      label: "Cuadrícula de Posiciones",
      icon: Target,
      active: showPositions,
      color: "text-cyan-400",
    },
    {
      key: "cargo" as ViewerLayer,
      label: "Carga y Pallets",
      icon: Package,
      active: showCargo,
      color: "text-sky-400",
    },
  ];

  return (
    <aside
      ref={containerRef}
      aria-label="Controles del visor 3D"
      className="pointer-events-none absolute inset-x-2 sm:inset-x-3 top-2 sm:top-3 z-30 flex items-start justify-between gap-1 sm:gap-2"
    >
      {/* ========================================================= */}
      {/* LADO IZQUIERDO: MENÚ DE CAPAS                             */}
      {/* ========================================================= */}
      <div className="pointer-events-auto relative flex flex-col items-start">
        {/* Botón Píldora de Capas */}
        <button
          type="button"
          onClick={() =>
            setOpenAccordion((prev) => (prev === "layers" ? null : "layers"))
          }
          title={openAccordion === "layers" ? "Cerrar menú de capas" : "Abrir capas del visor"}
          className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-semibold shadow-xl backdrop-blur-md transition-all select-none cursor-pointer ${
            openAccordion === "layers"
              ? "border-sky-500/80 bg-slate-900 text-white ring-1 ring-sky-500/40"
              : "border-slate-700/60 bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800/90"
          }`}
        >
          <Eye size={13} className="text-sky-400 shrink-0" />
          <span>Capas</span>
          <span className="rounded-full bg-sky-500/20 px-1.5 py-0.2 text-[10px] font-bold text-sky-300">
            {activeLayersCount}/6
          </span>
          <ChevronDown
            size={13}
            className={`text-slate-400 transition-transform duration-200 ${
              openAccordion === "layers" ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Panel Desplegable Flotante de Capas (Limpio, vertical y táctil) */}
        {openAccordion === "layers" && (
          <div className="absolute top-full left-0 mt-1.5 z-40 flex flex-col gap-2 rounded-xl border border-slate-700/80 bg-slate-900/95 p-2.5 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-1 w-72 sm:w-80 max-w-[calc(100vw-1.5rem)]">
            {/* Cabecera del panel */}
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[11px] font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Eye size={13} className="text-sky-400" />
                Capas de Visualización
              </span>
              <button
                type="button"
                onClick={() => setOpenAccordion(null)}
                className="text-slate-500 hover:text-white p-0.5 rounded cursor-pointer"
                title="Cerrar"
              >
                <X size={13} />
              </button>
            </div>

            {/* Presets rápidos en cuadrícula de 3 columnas (sin scroll horizontal) */}
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => handleIsolate("all")}
                className={`rounded-lg py-1 text-center text-xs font-medium transition cursor-pointer ${
                  layerFilterMode === "all"
                    ? "bg-sky-600 text-white font-semibold shadow-md"
                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-700/80"
                }`}
              >
                Todo
              </button>
              <button
                type="button"
                onClick={() => handleIsolate("racks")}
                className={`rounded-lg py-1 text-center text-xs font-medium transition cursor-pointer ${
                  layerFilterMode === "racks"
                    ? "bg-orange-600 text-white font-semibold shadow-md"
                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-700/80"
                }`}
              >
                Solo Racks
              </button>
              <button
                type="button"
                onClick={() => handleIsolate("tramos")}
                className={`rounded-lg py-1 text-center text-xs font-medium transition cursor-pointer ${
                  layerFilterMode === "tramos"
                    ? "bg-emerald-600 text-white font-semibold shadow-md"
                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-700/80"
                }`}
              >
                Solo Tramos
              </button>
            </div>

            {/* Lista vertical de capas con switch claro */}
            <div className="flex flex-col gap-0.5 py-0.5">
              {layersList.map((layer) => {
                const Icon = layer.icon;
                return (
                  <button
                    key={layer.key}
                    type="button"
                    onClick={() => handleToggle(layer.key)}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition hover:bg-slate-800/90 active:bg-slate-800 cursor-pointer select-none border border-transparent hover:border-slate-700/50"
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        size={14}
                        className={layer.active ? layer.color : "text-slate-500"}
                      />
                      <span
                        className={
                          layer.active
                            ? "text-slate-200 font-medium"
                            : "text-slate-400 line-through"
                        }
                      >
                        {layer.label}
                      </span>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold transition ${
                        layer.active
                          ? "bg-sky-500/20 text-sky-300 ring-1 ring-sky-500/40"
                          : "bg-slate-800 text-slate-500"
                      }`}
                    >
                      {layer.active ? "Visible" : "Oculto"}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Pie del panel con botón de restablecer */}
            <div className="flex items-center justify-between pt-1.5 border-t border-slate-800 text-[11px]">
              <button
                type="button"
                onClick={resetLayers}
                className="text-slate-400 hover:text-white transition text-[11px] underline cursor-pointer"
              >
                Restablecer todas
              </button>
              <span className="text-[10px] text-slate-500 font-mono">
                {activeLayersCount}/6 activas
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* LADO DERECHO: HERRAMIENTAS DIRECTAS Y VISTAS             */}
      {/* ========================================================= */}
      <div className="pointer-events-auto relative flex items-center gap-1 sm:gap-1.5">
        {/* BOTÓN RÁPIDO 1: HERRAMIENTA MANO (DESPLAZARSE CON 1 DEDO EN MÓVIL) */}
        <button
          type="button"
          onClick={togglePanMode}
          title={
            navigationMode === "pan"
              ? "Modo Mano activo: Arrastra con 1 dedo para moverte. Toca de nuevo para rotar."
              : "Activar modo Mano (desplazarse por la bodega con 1 dedo o clic)"
          }
          className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-semibold shadow-xl backdrop-blur-md transition-all select-none cursor-pointer ${
            navigationMode === "pan"
              ? "bg-emerald-600 text-white ring-1 ring-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
              : "border border-slate-700/60 bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800/90"
          }`}
        >
          <Hand
            size={13}
            className={navigationMode === "pan" ? "text-white" : "text-emerald-400"}
          />
          <span className="hidden sm:inline">Mano</span>
        </button>

        {/* BOTÓN RÁPIDO 2: MODO PRESELECCIÓN */}
        <button
          type="button"
          onClick={togglePreselectionMode}
          title={
            isPreselectionMode
              ? "Modo Preselección activo: Toca celdas para marcar. Clic para salir."
              : "Activar Preselección de posiciones múltiples"
          }
          className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-semibold shadow-xl backdrop-blur-md transition-all select-none cursor-pointer ${
            isPreselectionMode
              ? "border border-cyan-400/80 bg-cyan-500/25 text-cyan-200 ring-1 ring-cyan-400 shadow-[0_0_14px_rgba(6,182,212,0.4)]"
              : "border border-slate-700/60 bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800/90"
          }`}
        >
          <CheckSquare
            size={13}
            className={isPreselectionMode ? "text-cyan-300" : "text-cyan-400"}
          />
          <span className="hidden md:inline">Preselección</span>
          {preselectedPositions.length > 0 && (
            <span className="rounded-full bg-cyan-400 px-1.5 py-0.2 text-[9px] font-extrabold text-slate-950">
              {preselectedPositions.length}
            </span>
          )}
        </button>

        {/* BOTÓN ACORDEÓN 4: VISTAS Y CÁMARA */}
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setOpenAccordion((prev) => (prev === "views" ? null : "views"))
            }
            title={openAccordion === "views" ? "Cerrar menú de vistas" : "Abrir ángulos de cámara"}
            className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-semibold shadow-xl backdrop-blur-md transition-all select-none cursor-pointer ${
              openAccordion === "views"
                ? "border-sky-500/80 bg-slate-900 text-white ring-1 ring-sky-500/40"
                : "border-slate-700/60 bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800/90"
            }`}
          >
            <Compass size={13} className="text-sky-400 shrink-0" />
            <span className="hidden sm:inline">Vistas</span>
            <ChevronDown
              size={13}
              className={`text-slate-400 transition-transform duration-200 ${
                openAccordion === "views" ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Panel Desplegable Flotante de Vistas */}
          {openAccordion === "views" && (
            <div className="absolute top-full right-0 mt-1.5 z-40 flex flex-col gap-2 rounded-xl border border-slate-700/80 bg-slate-900/95 p-2.5 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-1 w-60 sm:w-64 max-w-[calc(100vw-1.5rem)]">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[11px] font-bold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Compass size={13} className="text-sky-400" />
                  Ángulos de Cámara
                </span>
                <button
                  type="button"
                  onClick={() => setOpenAccordion(null)}
                  className="text-slate-500 hover:text-white p-0.5 rounded cursor-pointer"
                  title="Cerrar"
                >
                  <X size={13} />
                </button>
              </div>

              {/* Botones de navegación en cuadrícula 2x2 */}
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setNavigationMode("orbit");
                    handlePreset("isometric");
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-700/50 bg-slate-800/70 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700/80 transition cursor-pointer"
                >
                  <Rotate3d size={13} className="text-sky-400" />
                  3D
                </button>
                <button
                  type="button"
                  onClick={() => handlePreset("top")}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-700/50 bg-slate-800/70 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700/80 transition cursor-pointer"
                >
                  <Grid3X3 size={13} className="text-amber-400" />
                  2D 
                </button>
                <button
                  type="button"
                  onClick={() => handlePreset("front")}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-700/50 bg-slate-800/70 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700/80 transition cursor-pointer"
                >
                  Frente
                </button>
                <button
                  type="button"
                  onClick={() => handlePreset("side")}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-700/50 bg-slate-800/70 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700/80 transition cursor-pointer"
                >
                  Lateral
                </button>
              </div>

              {/* Controles de Zoom y Pantalla completa */}
              <div className="flex items-center justify-between pt-1.5 border-t border-slate-800 gap-1.5">
                <button
                  type="button"
                  onClick={() => triggerZoom("in")}
                  title="Acercar cámara"
                  className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-slate-700/50 bg-slate-800/70 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
                >
                  <ZoomIn size={13} />
                  <span>Zoom +</span>
                </button>
                <button
                  type="button"
                  onClick={() => triggerZoom("out")}
                  title="Alejar cámara"
                  className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-slate-700/50 bg-slate-800/70 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
                >
                  <ZoomOut size={13} />
                  <span>Zoom -</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
