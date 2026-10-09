import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dropdown, InputText, Modal, type Option } from "@alpac/design-system";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { SelectBodegaModal } from "./components/select-bodega-modal";
import { LocationDetailPanel } from "./components/location-detail-panel";
import { useBodegaViewerStore } from "./stores/use-bodega-viewer-store";
import { useWarehouse3DData } from "./hooks/use-warehouse-3d-data";
import { getDynamicOverviewFlyTo } from "./utils/camera-fly";
import { buildAssignPositionsPayload } from "./utils/assignment-positions-builder";
import { useWarehouse } from "@app/modules/warehouse/ui/hooks/useWarehouse";
import { useWarehouseAssignment } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useAssignment";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import {
  dropdownClassName,
  inputClassName,
  labelClassName,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/utils/styles";
import {
  ArrowLeft,
  Building2,
  Check,
  Maximize2,
  Minimize2,
  PackageCheck,
  RotateCcw,
  Target,
  X,
} from "lucide-react";

const WarehouseCanvas = lazy(
  () =>
    import(
      "./components/warehouse-scene/warehouse-canvas"
    ),
);

const merchandiseTypeOptions: Option[] = [
  { value: "1", label: "Granel" },
  { value: "2", label: "Armada / empolinada" },
];

const palletTypeOptions: Option[] = [
  { value: "1", label: "Estándar" },
  { value: "2", label: "Sobredimensionado" },
];

export default function Bodega() {
  const navigate = useNavigate();
  const { baseUrl } = useBaseUrl();

  const {
    selectedBodegaId,
    selectedBodegaName,
    focusedRack,
    focusedTramo,
    activeDescargueAssignment,
    preselectedPositions,
    setBodega,
    requestCameraPreset,
    exitTramoFocus,
    clearActiveDescargueAssignment,
    clearPreselectedPositions,
    isFullscreen,
    toggleFullscreen,
    setIsFullscreen,
  } = useBodegaViewerStore();

  const [selectBodegaModalOpen, setSelectBodegaModalOpen] = useState(!selectedBodegaId);
  const [isSubmittingPositions, setIsSubmittingPositions] = useState(false);
  const [positioningModalOpen, setPositioningModalOpen] = useState(false);
  const [merchandiseType, setMerchandiseType] = useState<1 | 2>(1);
  const [palletType, setPalletType] = useState<1 | 2>(1);
  const [palletCount, setPalletCount] = useState("1");
  const [bulksPerPallet, setBulksPerPallet] = useState("1");
  const [palletWidth, setPalletWidth] = useState("1");
  const [palletLength, setPalletLength] = useState("1.2");
  const [assignedCodes, setAssignedCodes] = useState<{
    code_qr?: string;
    code_bar?: string;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const { companyId, moduleCode } = useUserStore();
  const { AlertComponent, handleRequestSuccess, handleRequestError } =
    useAlertState();

  // Servicio de asignación para enviar las posiciones seleccionadas
  const { AssignPositions, StartTask } = useWarehouseAssignment();

  const getRequestErrorMessage = (error: unknown): string => {
    if (typeof error === "string") return error;
    if (!error || typeof error !== "object") {
      return "Error al procesar la asignación de posiciones.";
    }

    const response = error as {
      error?: { description?: string; typeError?: string };
      message?: string;
    };
    return (
      response.error?.description ||
      response.error?.typeError ||
      response.message ||
      "Error al procesar la asignación de posiciones."
    );
  };

  // Lista de bodegas activas de la empresa
  const { GetWarehouses } = useWarehouse({
    getWarehousesPayload:
      companyId && moduleCode
        ? {
            company_id: companyId,
            module_code: moduleCode,
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

  const handleCancelDescargue = () => {
    clearActiveDescargueAssignment();
    clearPreselectedPositions();
    navigate(`${baseUrl}/warehouse-mga/descargue`);
  };

  const handleCloseCodesModal = () => {
    clearActiveDescargueAssignment();
    clearPreselectedPositions();
    setAssignedCodes(null);
    navigate(`${baseUrl}/warehouse-mga/descargue`);
  };

  const handleOpenPositioningModal = () => {
    if (preselectedPositions.length === 0 || isSubmittingPositions) return;

    setPalletCount(String(preselectedPositions.length));

    if (document.fullscreenElement) {
      document
        .exitFullscreen()
        .catch(() => undefined)
        .finally(() => {
          setIsFullscreen(false);
          setPositioningModalOpen(true);
        });
      return;
    }

    setPositioningModalOpen(true);
  };

  // Confirmar y enviar las posiciones seleccionadas a la API
  const handleConfirmAssignmentPositions = async () => {
    if (!activeDescargueAssignment) return;
    if (preselectedPositions.length === 0) {
      handleRequestError("Debes seleccionar al menos una posición en la bodega.");
      return;
    }
    if (!companyId || !moduleCode) {
      handleRequestError("No se encontró información de empresa o módulo.");
      return;
    }

    try {
      setIsSubmittingPositions(true);

      // Si la asignación está en Pending, iniciamos la tarea para que pase a InProgress
      if (
        activeDescargueAssignment.status === 1 ||
        activeDescargueAssignment.status === "Pending"
      ) {
        try {
          await StartTask.mutateAsync({
            company_id: companyId,
            module_code: moduleCode,
            operational_order_id: activeDescargueAssignment.operationalOrderId,
            assignment_id: activeDescargueAssignment.assignmentId,
          });
        } catch {
          // Si ya estaba en proceso, continuamos al PATCH
        }
      }

      const payload = buildAssignPositionsPayload(preselectedPositions);
      const count = Number(palletCount);
      const bulks = Number(bulksPerPallet);
      const width = Number(palletWidth);
      const length = Number(palletLength);

      if (!Number.isInteger(count) || count <= 0) {
        handleRequestError("La cantidad de polines debe ser mayor que cero.");
        return;
      }
      if (merchandiseType === 1 && (!Number.isInteger(bulks) || bulks <= 0)) {
        handleRequestError("Los bultos por polín deben ser mayores que cero.");
        return;
      }
      if (palletType === 2 && (width <= 0 || length <= 0)) {
        handleRequestError("Las dimensiones del polín sobredimensionado deben ser mayores que cero.");
        return;
      }

      const res = await AssignPositions.mutateAsync({
        company_id: companyId,
        module_code: moduleCode,
        operational_order_id: activeDescargueAssignment.operationalOrderId,
        assignment_id: activeDescargueAssignment.assignmentId,
        sections: payload.sections,
        merchandise_type: merchandiseType,
        pallets: [
          {
            type: palletType,
            count_pallets: count,
            width: palletType === 2 ? width : undefined,
            length: palletType === 2 ? length : undefined,
            bulks_per_pallet: merchandiseType === 1 ? bulks : null,
          },
        ],
      });

      if (res?.code_qr || res?.code_bar) {
        setAssignedCodes({
          code_qr: res.code_qr,
          code_bar: res.code_bar,
        });
        setPositioningModalOpen(false);
        handleRequestSuccess(
          `¡Se asignaron exitosamente ${preselectedPositions.length} posición(es) y se generaron los códigos!`,
        );
      } else {
        handleRequestSuccess(
          `¡Se asignaron exitosamente ${preselectedPositions.length} posición(es) para el descargue!`,
        );
        clearActiveDescargueAssignment();
        clearPreselectedPositions();
        setPositioningModalOpen(false);
        navigate(`${baseUrl}/warehouse-mga/descargue`);
      }
    } catch (error: unknown) {
      handleRequestError(getRequestErrorMessage(error));
    } finally {
      setIsSubmittingPositions(false);
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
      <header className="flex items-center justify-between gap-2 rounded-xl border border-slate-800 bg-[#121726] px-3 py-2 sm:px-4 sm:py-2.5">
        <div className="min-w-0 flex-1">
          <p className="m-0 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            INSPECCIÓN 3D
          </p>
          <h1 className="m-0 text-sm sm:text-base md:text-lg font-semibold text-slate-100 flex items-center gap-2 sm:gap-4 truncate">
            {activeDescargueAssignment ? (
              <span className="flex items-center gap-1.5 text-amber-400 font-bold truncate">
                <PackageCheck size={17} className="text-amber-400 shrink-0" />
                <span className="truncate">
                  Descargue: {activeDescargueAssignment.merchandise || "Mercancía"}
                </span>
                <span className="hidden md:inline text-xs font-normal text-slate-400">
                  (OP: {activeDescargueAssignment.operationalOrderId.slice(0, 8)}...)
                </span>
              </span>
            ) : (
              <span className="truncate">{selectedBodegaName ?? "Selecciona una bodega"}</span>
            )}
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

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {selectedBodegaId && (focusedRack || focusedTramo) && (
            <button
              type="button"
              onClick={handleExitZoom}
              title="Volver"
              className="flex items-center gap-1 rounded-lg bg-sky-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-500 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Volver</span>
            </button>
          )}

          {selectedBodegaId && (
            <button
              type="button"
              onClick={() => requestCameraPreset("reset")}
              title="Restablecer cámara"
              className="flex items-center gap-1 rounded-lg bg-sky-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-500 cursor-pointer"
            >
              <RotateCcw size={14} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          {/* Botón de Pantalla Completa */}
          <button
            type="button"
            onClick={handleToggleFullscreen}
            title={isFullscreen ? "Reducir" : "Pantalla completa"}
            className="flex items-center gap-1 rounded-lg bg-slate-700 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-600 cursor-pointer"
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            <span className="hidden md:inline">{isFullscreen ? "Reducir" : "Pantalla Grande"}</span>
          </button>

          {/* Botón Secundario: Cambiar / Seleccionar Bodega */}
          <button
            type="button"
            onClick={() => setSelectBodegaModalOpen(true)}
            title={selectedBodegaId ? "Cambiar bodega" : "Seleccionar bodega"}
            className="flex items-center gap-1 rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-700 cursor-pointer"
          >
            <Building2 size={14} className="text-sky-400" />
            <span className="hidden sm:inline">{selectedBodegaId ? "Bodega" : "Seleccionar"}</span>
          </button>
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
              hidePositionLabels={positioningModalOpen}
            />
          </Suspense>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-800 bg-[#0b1220] text-slate-400">
            <Building2 size={44} className="text-sky-500/70" />
            <p className="text-sm text-slate-300 font-medium">
              Selecciona una bodega para comenzar la inspección 3D.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectBodegaModalOpen(true)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-200 transition hover:bg-slate-700 cursor-pointer"
              >
                Seleccionar bodega
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* BARRA FLOTANTE INFORMATIVA: MODO DESCARGUE ACTIVO          */}
        {/* ========================================================= */}
        {activeDescargueAssignment && (
          <div className="pointer-events-auto absolute top-14 left-1/2 -translate-x-1/2 z-30 flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-xl border border-amber-500/70 bg-slate-900/95 px-3.5 py-1.5 shadow-[0_0_20px_rgba(245,158,11,0.25)] backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping shrink-0" />
            <span className="text-xs font-semibold text-amber-300 truncate">
              Descargue activo:{" "}
              <span className="text-white font-bold">
                {activeDescargueAssignment.merchandise || "Mercancía"}
              </span>
              <span className="hidden sm:inline text-slate-400 font-normal">
                {" "}· OP: {activeDescargueAssignment.operationalOrderId.slice(0, 8)}...
              </span>
            </span>
            <button
              type="button"
              onClick={handleCancelDescargue}
              className="ml-2 flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Cancelar y volver a descargue"
            >
              <X size={12} />
              <span className="hidden sm:inline">Volver a Descargue</span>
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* HUD DE ACCIÓN FLOTANTE: CONFIRMACIÓN DE POSICIONES         */}
        {/* ========================================================= */}
        {activeDescargueAssignment && (
          <div className="pointer-events-auto absolute bottom-3 left-1/2 -translate-x-1/2 z-40 flex max-w-[calc(100vw-1.5rem)] flex-col sm:flex-row items-center gap-2 sm:gap-3 rounded-2xl border border-amber-500/80 bg-slate-900/95 px-3.5 py-2 sm:px-4 sm:py-2.5 shadow-[0_0_30px_rgba(245,158,11,0.35)] backdrop-blur-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <Target size={15} className="text-amber-400 shrink-0" />
              <span>
                {preselectedPositions.length === 0 ? (
                  <span className="text-slate-300 font-normal">
                    Toca posiciones en los racks o tramos para ubicarlas
                  </span>
                ) : (
                  <span>
                    {preselectedPositions.length} posición
                    {preselectedPositions.length > 1 ? "es" : ""} seleccionada
                    {preselectedPositions.length > 1 ? "s" : ""}
                  </span>
                )}
              </span>
            </div>

            {preselectedPositions.length > 0 && (
              <div className="hidden sm:flex items-center gap-1 max-w-[240px] overflow-hidden text-[11px] font-mono text-slate-300">
                {preselectedPositions.slice(0, 3).map((p) => (
                  <span
                    key={p.positionId}
                    className="rounded bg-slate-800 px-1.5 py-0.5 border border-slate-700 font-semibold text-amber-200 truncate max-w-[85px]"
                  >
                    {p.positionCode}
                  </span>
                ))}
                {preselectedPositions.length > 3 && (
                  <span className="text-slate-400 text-[10px]">
                    +{preselectedPositions.length - 3} más
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {preselectedPositions.length > 0 && (
                <button
                  type="button"
                  onClick={clearPreselectedPositions}
                  className="rounded px-2 py-1 text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-950/50 transition cursor-pointer"
                >
                  Limpiar
                </button>
              )}

              <button
                type="button"
                disabled={preselectedPositions.length === 0 || isSubmittingPositions}
                onClick={handleOpenPositioningModal}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-emerald-950/50 hover:bg-emerald-500 disabled:opacity-50 disabled:pointer-events-none transition cursor-pointer whitespace-nowrap"
              >
                {isSubmittingPositions ? (
                  <>
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    <span>Confirmar Asignación ({preselectedPositions.length})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        <LocationDetailPanel />
      </main>

      <Modal
        isOpen={positioningModalOpen}
        onClose={() => setPositioningModalOpen(false)}
        variant="form"
        size="md"
        title="Información de polines"
        description="Registra la información de la mercancía antes de confirmar la asignación de posiciones."
      >
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            void handleConfirmAssignmentPositions();
          }}
        >
          <Dropdown
            appearance="dark"
            label="Tipo de mercancía"
            labelClassName={labelClassName}
            options={merchandiseTypeOptions}
            value={String(merchandiseType)}
            onChange={(value) =>
              setMerchandiseType(Number(value) as 1 | 2)
            }
            className={dropdownClassName}
          />
          <Dropdown
            appearance="dark"
            label="Tipo de polín"
            labelClassName={labelClassName}
            options={palletTypeOptions}
            value={String(palletType)}
            onChange={(value) => setPalletType(Number(value) as 1 | 2)}
            className={dropdownClassName}
          />
          <InputText
            label="Cantidad de polines"
            labelClassName={labelClassName}
            value={palletCount}
            onChange={(event) => setPalletCount(event.target.value)}
            className={inputClassName}
          />
          {merchandiseType === 1 && (
            <InputText
              label="Bultos por polín"
              labelClassName={labelClassName}
              value={bulksPerPallet}
              onChange={(event) => setBulksPerPallet(event.target.value)}
              className={inputClassName}
            />
          )}
          {palletType === 2 && (
            <div className="grid grid-cols-2 gap-3">
              <InputText
                label="Ancho"
                labelClassName={labelClassName}
                value={palletWidth}
                onChange={(event) => setPalletWidth(event.target.value)}
                className={inputClassName}
              />
              <InputText
                label="Largo"
                labelClassName={labelClassName}
                value={palletLength}
                onChange={(event) => setPalletLength(event.target.value)}
                className={inputClassName}
              />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              label="Cancelar"
              onClick={() => setPositioningModalOpen(false)}
            />
            <Button
              type="submit"
              label="Guardar polines y asignar"
              isLoading={isSubmittingPositions}
              disabled={isSubmittingPositions}
            />
          </div>
        </form>
      </Modal>

      {/* Modal de Selección / Cambio de Bodega */}
      <SelectBodegaModal
        isOpen={selectBodegaModalOpen}
        onClose={() => setSelectBodegaModalOpen(false)}
        allowDismiss={Boolean(selectedBodegaId)}
        initialBodegaId={selectedBodegaId}
        warehouses={warehousesList}
        isLoadingWarehouses={GetWarehouses.isLoading}
        onSelect={(bodega) => {
          setBodega(bodega.id, bodega.name);
          setSelectBodegaModalOpen(false);
        }}
      />

      {/* Modal de Códigos Generados (QR y Barras) */}
      <Modal
        isOpen={Boolean(assignedCodes)}
        onClose={handleCloseCodesModal}
        title="Códigos Generados para la Asignación"
      >
        <div className="flex flex-col items-center gap-4 p-2 sm:p-4 text-center max-w-lg mx-auto">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Se asignaron las posiciones en bodega para la descarga. Puedes visualizar y escanear los códigos generados a continuación:
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full my-2">
            {assignedCodes?.code_qr && (
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                  Código QR
                </span>
                <img
                  src={assignedCodes.code_qr}
                  alt="Código QR"
                  className="h-36 w-36 object-contain rounded"
                />
              </div>
            )}

            {assignedCodes?.code_bar && (
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                  Código de Barras
                </span>
                <img
                  src={assignedCodes.code_bar}
                  alt="Código de Barras"
                  className="h-28 max-w-[240px] object-contain rounded"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end w-full pt-2">
            <Button
              type="button"
              label="Finalizar y Volver a Descargue"
              onClick={handleCloseCodesModal}
              className="rounded-lg! bg-emerald-600! hover:bg-emerald-500! text-white! font-semibold px-4 py-2 cursor-pointer"
            />
          </div>
        </div>
      </Modal>

      {AlertComponent}
    </div>
  );
}
