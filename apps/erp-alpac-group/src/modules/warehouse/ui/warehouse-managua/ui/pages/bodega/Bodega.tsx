import { lazy, Suspense, useEffect, useState } from "react";
import { ArrowLeft, Map, RotateCcw, View } from "lucide-react";
import { SelectBodegaModal } from "./components/select-bodega-modal";
import { LocationDetailPanel } from "./components/location-detail-panel";
import { useBodegaViewerStore } from "./stores/use-bodega-viewer-store";
import { useWarehouseOccupancy } from "./hooks/use-warehouse-occupancy";
import { STATUS_COLOR, STATUS_LABEL } from "./types/warehouse-3d.types";
import { getLayoutByBodegaId } from "./data/bodega-2-fiscal.layout";
import { getOverviewFlyTo } from "./utils/camera-fly";

const WarehouseCanvas = lazy(
  () => import("./components/warehouse-scene/warehouse-canvas"),
);

export default function Bodega() {
  const {
    selectedBodegaId,
    selectedBodegaName,
    focusedTramoId,
    setBodega,
    requestCameraPreset,
    exitTramoFocus,
  } = useBodegaViewerStore();

  const [modalOpen, setModalOpen] = useState(true);
  const { locations } = useWarehouseOccupancy(selectedBodegaId);

  useEffect(() => {
    setModalOpen(true);
  }, []);

  const handleExitZoom = () => {
    const layout = selectedBodegaId
      ? getLayoutByBodegaId(selectedBodegaId)
      : null;
    exitTramoFocus(layout ? getOverviewFlyTo(layout) : undefined);
  };

  return (
    <div className="relative flex h-[calc(100vh-7rem)] min-h-[520px] flex-col gap-3">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-[#121726] px-4 py-3">
        <div>
          <p className="m-0 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Inspección 3D
          </p>
          <h1 className="m-0 text-lg font-bold text-slate-100">
            {selectedBodegaName ?? "Selecciona una bodega"}
            {focusedTramoId ? (
              <span className="ml-2 text-sm font-semibold text-sky-400">
                · {focusedTramoId}
              </span>
            ) : null}
          </h1>
          {focusedTramoId ? (
            <p className="m-0 mt-0.5 text-xs text-slate-500">
              Click en un nivel (1 · 2 · 3) para ver el detalle de la ubicación
            </p>
          ) : (
            <p className="m-0 mt-0.5 text-xs text-slate-500">
              Click en un rack central para hacer zoom
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="mr-2 hidden items-center gap-3 sm:flex">
            {(
              Object.keys(STATUS_COLOR) as Array<keyof typeof STATUS_COLOR>
            ).map((key) => (
              <span
                key={key}
                className="flex items-center gap-1.5 text-xs text-slate-300"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: STATUS_COLOR[key] }}
                />
                {STATUS_LABEL[key]}
              </span>
            ))}
          </div>

          {selectedBodegaId && focusedTramoId && (
            <button
              type="button"
              onClick={handleExitZoom}
              className="inline-flex items-center gap-1.5 rounded-lg border border-sky-700/60 bg-sky-950/50 px-2.5 py-1.5 text-xs font-medium text-sky-300 transition hover:border-sky-500"
            >
              <ArrowLeft size={14} />
              Volver
            </button>
          )}

          {selectedBodegaId && (
            <>
              <button
                type="button"
                onClick={() => requestCameraPreset("top")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-200 transition hover:border-slate-500"
              >
                <Map size={14} />
                Planta
              </button>
              <button
                type="button"
                onClick={() => requestCameraPreset("isometric")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-200 transition hover:border-slate-500"
              >
                <View size={14} />
                Isométrica
              </button>
              <button
                type="button"
                onClick={() => requestCameraPreset("reset")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-200 transition hover:border-slate-500"
              >
                <RotateCcw size={14} />
                Reset
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-500"
          >
            {selectedBodegaId ? "Cambiar bodega" : "Seleccionar bodega"}
          </button>
        </div>
      </header>

      <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl border border-slate-800 bg-[#0b1220]">
        {selectedBodegaId ? (
          <>
            <Suspense
              fallback={
                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                  Cargando vista 3D…
                </div>
              }
            >
              <WarehouseCanvas bodegaId={selectedBodegaId} />
            </Suspense>
            <LocationDetailPanel occupancy={locations} />
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
            <p className="m-0 text-base font-medium text-slate-200">
              Ninguna bodega seleccionada
            </p>
            <p className="m-0 max-w-sm text-sm text-slate-500">
              Selecciona una bodega para inspeccionar tramos, pasillos y racks en
              360°.
            </p>
          </div>
        )}
      </div>

      <SelectBodegaModal
        isOpen={modalOpen}
        allowDismiss={Boolean(selectedBodegaId)}
        initialBodegaId={selectedBodegaId}
        onClose={() => setModalOpen(false)}
        onSelect={(bodega) => {
          setBodega(bodega.id, bodega.name);
          setModalOpen(false);
        }}
      />
    </div>
  );
}
