import { lazy, Suspense, useEffect, useState } from "react";
import { SelectBodegaModal } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/components/select-bodega-modal";
import { LocationDetailPanel } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/components/location-detail-panel";
import { useBodegaViewerStore } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/stores/use-bodega-viewer-store";
import { useWarehouseOccupancy } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/hooks/use-warehouse-occupancy";
import { getLayoutByBodegaId } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/data/bodega-2-fiscal.layout";
import { getOverviewFlyTo } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/utils/camera-fly";
import { Button } from "@alpac/design-system";
import { ArrowLeft, Building2, RotateCcw } from "lucide-react";

const WarehouseCanvas = lazy(
  () =>
    import("@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/components/warehouse-scene/warehouse-canvas"),
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
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="mr-2 hidden flex-wrap items-center gap-3 sm:flex">
            <span className="flex items-center gap-1.5 text-xs text-slate-300">
              <span
                className="h-2.5 w-4 rounded-sm"
                style={{ backgroundColor: "#e8d98a" }}
              />
              Tramo
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-300">
              <span
                className="h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: "#0a1628" }}
              />
              Slot libre
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-300">
              <span
                className="h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: "#c4a574" }}
              />
              Ocupado
            </span>
          </div>

          {selectedBodegaId && focusedTramoId && (
            <Button
              type="button"
              label="Volver"
              onClick={handleExitZoom}
              icon={<ArrowLeft size={14} />}
              className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-500"
            />
          )}

          {selectedBodegaId && (
            <>
              <Button
                type="button"
                label="Reset"
                onClick={() => requestCameraPreset("reset")}
                icon={<RotateCcw size={14} />}
                className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-500"
              />
            </>
          )}
          <Button
            type="button"
            label={selectedBodegaId ? "Cambiar bodega" : "Seleccionar bodega"}
            onClick={() => setModalOpen(true)}
            icon={<Building2 size={14} />}
            className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-500"
          />
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
              Selecciona una bodega para inspeccionar tramos, pasillos y racks
              en 360°.
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
