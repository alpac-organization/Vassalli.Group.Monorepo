import {
  Boxes,
  Building2,
  Compass,
  Eye,
  Grid3X3,
  Layers,
  Package,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useBodegaViewerStore } from "../stores/use-bodega-viewer-store";
import type { CameraProps, LayerFilterMode, ViewerLayer } from "../types/warehouse-3d.types";

export function WarehouseToolbar( ) {
  const {
    showWarehouse,
    showSections,
    showRacks,
    showTramos,
    showCargo,
    layerFilterMode,
    toggleLayer,
    isolateLayer,
    requestCameraPreset,
    triggerZoom,
  } = useBodegaViewerStore();

  const handleIsolate = (mode: LayerFilterMode) => {
    isolateLayer(mode);
  };

  const handleToggle = (layer: ViewerLayer) => {
    toggleLayer(layer);
  };

  const handlePreset = (preset: CameraProps) => {
    requestCameraPreset(preset);
  };

  return (
    <aside
      aria-label="Controles del visor 3D"
      className="pointer-events-none absolute inset-x-2 sm:inset-x-3 top-2 sm:top-3 z-30 flex items-center justify-between gap-2"
    >
      {/* Botonera de Filtros Rápidos de Capas */}
      <div className="pointer-events-auto flex items-center gap-1 sm:gap-1.5 rounded-xl border border-slate-700/60 bg-slate-900/85 p-1 sm:p-1.5 shadow-2xl backdrop-blur-md overflow-x-auto no-scrollbar max-w-[calc(100%-140px)] sm:max-w-none">
        <div className="flex items-center gap-1 px-1 sm:px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
          <Eye size={12} className="text-sky-400" />
          <span className="hidden sm:inline">Capas:</span>
        </div>

        {/* Filtro: Todo */}
        <button
          type="button"
          onClick={() => handleIsolate("all")}
          title="Mostrar todo"
          className={`flex items-center gap-1 rounded-lg px-2 sm:px-2.5 py-1 text-xs font-medium transition shrink-0 ${
            layerFilterMode === "all"
              ? "border border-sky-500/50 bg-sky-500/20 font-semibold text-sky-300"
              : "border border-slate-700/40 bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 hover:text-white"
          }`}
        >
          Todo
        </button>

        {/* Filtro: Solo Warehouse */}
        <button
          type="button"
          onClick={() => handleIsolate("warehouse")}
          title="Aislar y ver solo la estructura y cotas de la nave"
          className={`flex items-center gap-1 sm:gap-1.5 rounded-lg px-2 sm:px-2.5 py-1 text-xs font-medium transition shrink-0 ${
            layerFilterMode === "warehouse"
              ? "border border-sky-500/50 bg-sky-500/20 font-semibold text-sky-300"
              : "border border-slate-700/40 bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 hover:text-white"
          }`}
        >
          <Building2 size={13} className="text-amber-400" />
          <span className="hidden md:inline">Solo </span>
          <span>Nave</span>
        </button>

        {/* Filtro: Solo Secciones */}
        <button
          type="button"
          onClick={() => handleIsolate("sections")}
          title="Aislar y ver solo las secciones y sus dimensiones"
          className={`flex items-center gap-1 sm:gap-1.5 rounded-lg px-2 sm:px-2.5 py-1 text-xs font-medium transition shrink-0 ${
            layerFilterMode === "sections"
              ? "border border-sky-500/50 bg-sky-500/20 font-semibold text-sky-300"
              : "border border-slate-700/40 bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 hover:text-white"
          }`}
        >
          <Grid3X3 size={13} className="text-yellow-400" />
          <span className="hidden md:inline">Solo </span>
          <span>Secciones</span>
        </button>

        {/* Filtro: Solo Racks */}
        <button
          type="button"
          onClick={() => handleIsolate("racks")}
          title="Aislar y ver solo las estructuras de racks"
          className={`flex items-center gap-1 sm:gap-1.5 rounded-lg px-2 sm:px-2.5 py-1 text-xs font-medium transition shrink-0 ${
            layerFilterMode === "racks"
              ? "border border-sky-500/50 bg-sky-500/20 font-semibold text-sky-300"
              : "border border-slate-700/40 bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 hover:text-white"
          }`}
        >
          <Layers size={13} className="text-orange-400" />
          <span className="hidden md:inline">Solo </span>
          <span>Racks</span>
        </button>

        {/* Filtro: Solo Tramos (con carga/polines) */}
        <button
          type="button"
          onClick={() => handleIsolate("tramos")}
          title="Ver racks con sus tramos y polines de mercancía"
          className={`flex items-center gap-1 sm:gap-1.5 rounded-lg px-2 sm:px-2.5 py-1 text-xs font-medium transition shrink-0 ${
            layerFilterMode === "tramos"
              ? "border border-sky-500/50 bg-sky-500/20 font-semibold text-sky-300"
              : "border border-slate-700/40 bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 hover:text-white"
          }`}
        >
          <Boxes size={13} className="text-emerald-400" />
          <span className="hidden md:inline">Solo </span>
          <span>Tramos</span>
        </button>

        {/* Separador vertical */}
        <div className="hidden lg:block mx-1 h-4 w-px bg-slate-700/60 shrink-0" />

        {/* Toggles individuales finos */}
        <div className="hidden lg:flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => handleToggle("warehouse")}
            title={showWarehouse ? "Ocultar nave/edificio" : "Mostrar nave/edificio"}
            className={`rounded-md p-1 transition ${
              showWarehouse
                ? "bg-slate-800 text-amber-400 hover:bg-slate-700"
                : "text-slate-600 line-through hover:text-slate-400"
            }`}
          >
            <Building2 size={13} />
          </button>
          <button
            type="button"
            onClick={() => handleToggle("sections")}
            title={showSections ? "Ocultar secciones" : "Mostrar secciones"}
            className={`rounded-md p-1 transition ${
              showSections
                ? "bg-slate-800 text-yellow-400 hover:bg-slate-700"
                : "text-slate-600 line-through hover:text-slate-400"
            }`}
          >
            <Grid3X3 size={13} />
          </button>
          <button
            type="button"
            onClick={() => handleToggle("racks")}
            title={showRacks ? "Ocultar racks" : "Mostrar racks"}
            className={`rounded-md p-1 transition ${
              showRacks
                ? "bg-slate-800 text-orange-400 hover:bg-slate-700"
                : "text-slate-600 line-through hover:text-slate-400"
            }`}
          >
            <Layers size={13} />
          </button>
          <button
            type="button"
            onClick={() => handleToggle("tramos")}
            title={showTramos ? "Ocultar tramos" : "Mostrar tramos"}
            className={`rounded-md p-1 transition ${
              showTramos
                ? "bg-slate-800 text-amber-400 hover:bg-slate-700"
                : "text-slate-600 line-through hover:text-slate-400"
            }`}
          >
            <Boxes size={13} />
          </button>
          <button
            type="button"
            onClick={() => handleToggle("cargo")}
            title={showCargo ? "Ocultar carga/polines" : "Mostrar carga/polines"}
            className={`rounded-md p-1 transition ${
              showCargo
                ? "bg-slate-800 text-emerald-400 hover:bg-slate-700"
                : "text-slate-600 line-through hover:text-slate-400"
            }`}
          >
            <Package size={13} />
          </button>
        </div>
      </div>

      {/* Botonera de Cámara, Navegación y Pantalla Completa */}
      <div className="pointer-events-auto flex items-center gap-1 sm:gap-1.5 rounded-xl border border-slate-700/60 bg-slate-900/85 p-1 sm:p-1.5 shadow-2xl backdrop-blur-md shrink-0">
        <div className="flex items-center gap-1 px-1 sm:px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <Compass size={12} className="text-sky-400" />
          <span className="hidden md:inline">Vistas:</span>
        </div>

        {/* Vista Isométrica 3D */}
        <button
          type="button"
          onClick={() => handlePreset("isometric")}
          title="Vista 3D Isométrica"
          className="rounded-lg border border-slate-700/40 bg-slate-800/60 px-2 py-1 text-xs font-medium text-slate-300 transition hover:bg-slate-700/60 hover:text-white"
        >
          3D
        </button>

        {/* Vista Cenital / Planta 2D */}
        <button
          type="button"
          onClick={() => handlePreset("top")}
          title="Vista de Planta Superior (Cenital 2D)"
          className="rounded-lg border border-slate-700/40 bg-slate-800/60 px-2 py-1 text-xs font-medium text-slate-300 transition hover:bg-slate-700/60 hover:text-white"
        >
          <span className="hidden sm:inline">Planta </span>2D
        </button>

        {/* Vista Frontal */}
        <button
          type="button"
          onClick={() => handlePreset("front")}
          title="Vista Frontal"
          className="rounded-lg border border-slate-700/40 bg-slate-800/60 px-2 py-1 text-xs font-medium text-slate-300 transition hover:bg-slate-700/60 hover:text-white"
        >
          Frente
        </button>

        {/* Vista Lateral */}
        <button
          type="button"
          onClick={() => handlePreset("side")}
          title="Vista Lateral"
          className="rounded-lg border border-slate-700/40 bg-slate-800/60 px-2 py-1 text-xs font-medium text-slate-300 transition hover:bg-slate-700/60 hover:text-white"
        >
          Lado
        </button>

        {/* Separador */}
        <div className="mx-0.5 sm:mx-1 h-4 w-px bg-slate-700/60" />

        {/* Zoom In */}
        <button
          type="button"
          onClick={() => triggerZoom("in")}
          title="Acercar cámara (Zoom In)"
          className="rounded-lg border border-slate-700/40 bg-slate-800/60 p-1 sm:p-1.5 text-slate-300 transition hover:bg-slate-700/60 hover:text-white"
        >
          <ZoomIn size={14} />
        </button>

        {/* Zoom Out */}
        <button
          type="button"
          onClick={() => triggerZoom("out")}
          title="Alejar cámara (Zoom Out)"
          className="rounded-lg border border-slate-700/40 bg-slate-800/60 p-1 sm:p-1.5 text-slate-300 transition hover:bg-slate-700/60 hover:text-white"
        >
          <ZoomOut size={14} />
        </button>
      </div>
    </aside>
  );
}
