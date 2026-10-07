import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { SelectBodegaModal } from "./components/select-bodega-modal";
import { LocationDetailPanel } from "./components/location-detail-panel";
import { useBodegaViewerStore } from "./stores/use-bodega-viewer-store";
import { useWarehouse3DData } from "./hooks/use-warehouse-3d-data";
import { getDynamicOverviewFlyTo } from "./utils/camera-fly";
import { useWarehouse } from "@app/modules/warehouse/ui/hooks/useWarehouse";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { Button } from "@alpac/design-system";
import { ArrowLeft, Building2, Maximize2, Minimize2, RotateCcw } from "lucide-react";

const WarehouseCanvas = lazy(
  () =>
    import(
      "./components/warehouse-scene/warehouse-canvas"
    ),
);

export default function Bodega() {
  const {
    selectedBodegaId,
    selectedBodegaName,
    focusedRack,
    focusedTramo,
    setBodega,
    requestCameraPreset,
    exitTramoFocus,
    isFullscreen,
    toggleFullscreen,
    setIsFullscreen,
  } = useBodegaViewerStore();

  const [modalOpen, setModalOpen] = useState(!selectedBodegaId);
  const containerRef = useRef<HTMLDivElement>(null);
  const { companyId, moduleCode } = useUserStore();

  // Lista de bodegas activas de la empresa
  const { GetWarehouses } = useWarehouse({
    getWarehousesPayload:
      companyId && moduleCode
        ? {
            company_id: companyId,
            module_code: moduleCode,
            page_number: 1,
            page_size: 10,
            is_active: true,
          }
        : undefined,
  });

  const warehousesList = GetWarehouses.data?.data ?? [];

  // Datos 3D de la bodega seleccionada (edificio, secciones, racks reales, tramos)
  const { building, sections, racks, tramos } = useWarehouse3DData(selectedBodegaId);

  const handleExitZoom = () => {
    const overviewFly = getDynamicOverviewFlyTo(building);
    exitTramoFocus(overviewFly);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {});
      }
      toggleFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Sincronizar el estado con el evento nativo del navegador al salir con Escape
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [setIsFullscreen]);

  return (
    <div
      ref={containerRef}
      className={
        isFullscreen
          ? "fixed inset-0 z-50 flex h-screen w-screen flex-col bg-[#0b1220] p-3"
          : "relative flex h-[calc(100vh-7rem)] min-h-[520px] flex-col gap-3"
      }
    >
      {/* Barra Superior de Control */}
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-[#121726] px-4 py-2.5">
        <div>
          <p className="m-0 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            INSPECCIÓN 3D
          </p>
          <h1 className="m-0 text-base sm:text-lg font-semibold text-slate-100 flex items-center gap-4">
            <span className="truncate">{selectedBodegaName ?? "Selecciona una bodega"}</span>
            {focusedRack ? (
              <span className="text-xs sm:text-sm font-semibold text-sky-400 shrink-0">
                · {focusedRack.code}
              </span>
            ) : focusedTramo ? (
              <span className="text-xs sm:text-sm font-semibold text-amber-400 shrink-0">
                · {focusedTramo.code}
              </span>
            ) : null}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {selectedBodegaId && (focusedRack || focusedTramo) && (
            <Button
              type="button"
              label="Volver"
              onClick={handleExitZoom}
              icon={<ArrowLeft size={14} />}
              className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-500"
            />
          )}

          {selectedBodegaId && (
            <Button
              type="button"
              label="Reset"
              onClick={() => requestCameraPreset("reset")}
              icon={<RotateCcw size={14} />}
              className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-500"
            />
          )}

          <Button
            type="button"
            label={isFullscreen ? "Reducir" : "Pantalla Grande"}
            onClick={handleToggleFullscreen}
            icon={isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            className="rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-600"
          />

          <Button
            type="button"
            label={selectedBodegaId ? "Cambiar bodega" : "Seleccionar bodega"}
            onClick={() => setModalOpen(true)}
            icon={<Building2 size={14} />}
            className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-500"
          />
        </div>
      </header>

      {/* Visor 3D y Panel Lateral */}
      <main className="relative flex-1 min-h-[400px]">
        {selectedBodegaId ? (
          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center rounded-xl border border-slate-800 bg-[#0b1220] text-slate-400">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
                  <p className="text-sm">Cargando visualización 3D...</p>
                </div>
              </div>
            }
          >
            <WarehouseCanvas
              building={building}
              sections={sections}
              racks={racks}
              tramos={tramos}
              onToggleFullscreen={handleToggleFullscreen}
              isFullscreen={isFullscreen}
            />
          </Suspense>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-800 bg-[#0b1220] text-slate-400">
            <Building2 size={40} className="text-slate-600" />
            <p className="text-sm">Selecciona una bodega para comenzar la inspección 3D.</p>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-200 transition hover:bg-slate-700"
            >
              Seleccionar bodega
            </button>
          </div>
        )}

        <LocationDetailPanel />
      </main>

      {/* Modal de Selección */}
      <SelectBodegaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        allowDismiss={Boolean(selectedBodegaId)}
        initialBodegaId={selectedBodegaId}
        warehouses={warehousesList}
        isLoadingWarehouses={GetWarehouses.isLoading}
        onSelect={(bodega) => {
          setBodega(bodega.id, bodega.name);
          setModalOpen(false);
        }}
      />
    </div>
  );
}
