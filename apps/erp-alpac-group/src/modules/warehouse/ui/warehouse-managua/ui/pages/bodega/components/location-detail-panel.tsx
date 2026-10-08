import {
  X,
  Box,
  Boxes,
  Layers,
  Weight,
  Calendar,
  ExternalLink,
  AlertTriangle,
  Ban,
  BookmarkCheck,
  CheckCircle2,
  Ruler,
} from "lucide-react";
import { useBodegaViewerStore } from "../stores/use-bodega-viewer-store";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { resolveRackStatus, RACK_STATUS_COLORS } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/rack-status-badge";
import { getUsageProfileLabel } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/utils/get-usage-profile-label";
import { useMemo } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { warehouseHttpHandler } from "@app/core/adapters";
import { RackService } from "@app/modules/admin-warehouse/warehouse-managua/infrastructure/services/RackService";
import { LotService } from "@app/modules/admin-warehouse/warehouse-managua/infrastructure/services/LotService";
import type { RackPositionDetailDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/racks/get-rack-details-res";
import type { ProcessedRack3D, ProcessedTramo3D } from "../hooks/use-warehouse-3d-data";
import { useNavigate } from "react-router-dom";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";

const rackService = new RackService(warehouseHttpHandler);
const lotService = new LotService(warehouseHttpHandler);

function TramoDetailView({ tramo }: { tramo: ProcessedTramo3D }) {
  const selectedBodegaId = useBodegaViewerStore((s) => s.selectedBodegaId);
  const clearTramoSelection = useBodegaViewerStore((s) => s.clearTramoSelection);
  const exitTramoFocus = useBodegaViewerStore((s) => s.exitTramoFocus);
  const { companyId, moduleCode } = useUserStore();
  const navigate = useNavigate();
  const { baseUrl } = useBaseUrl();

  const { data: capacities, isLoading: isLoadingCapacities } = useQuery({
    queryKey: [
      "lot-capacities",
      companyId,
      moduleCode,
      selectedBodegaId,
      tramo.sectionId,
      tramo.tramoId,
    ],
    queryFn: () =>
      lotService.GetLotCapacities({
        company_id: companyId!,
        module_code: moduleCode!,
        warehouse_id: selectedBodegaId!,
        section_id: tramo.sectionId,
        lot_id: tramo.tramoId,
      }),
    enabled: Boolean(
      tramo.tramoId &&
        selectedBodegaId &&
        companyId?.trim() &&
        moduleCode?.trim()
    ),
    staleTime: 30_000,
  });

  const resolved = resolveRackStatus(tramo.status);
  const statusKey = (resolved?.textValue ?? "Available") as keyof typeof RACK_STATUS_COLORS;
  const statusBadgeColor = RACK_STATUS_COLORS[statusKey] ?? "#22c55e";

  const handleClose = () => {
    clearTramoSelection();
    exitTramoFocus();
  };

  const handleNavigate2D = () => {
    if (selectedBodegaId && tramo.sectionId) {
      navigate(
        `${baseUrl}/warehouse-admin/management/sections/${selectedBodegaId}/lots/${tramo.sectionId}`
      );
    }
  };

  const totalArea = capacities?.total_area_m2 || tramo.area || tramo.width * tramo.length;
  const usedArea = capacities?.occupied_chargeable_area_m2 ?? 0;
  const availArea =
    capacities?.available_area_with_margin_m2 ?? Math.max(0, totalArea - usedArea);
  const pctOccupied =
    totalArea > 0 ? Math.min(100, Math.round((usedArea / totalArea) * 100)) : 0;

  return (
    <aside className="fixed sm:absolute inset-x-2 bottom-2 sm:bottom-3 sm:inset-x-auto sm:right-3 sm:top-16 sm:max-h-[calc(100%-4.75rem)] z-40 max-h-[75vh] w-auto sm:w-[350px] overflow-y-auto rounded-2xl border border-slate-700/80 bg-slate-950/95 p-3.5 sm:p-4 shadow-2xl backdrop-blur-md transition-all custom-scrollbar">
      {/* Handle indicator for mobile bottom sheet */}
      <div className="mx-auto -mt-1 mb-2.5 h-1 w-10 rounded-full bg-slate-700/80 sm:hidden" />

      {/* Encabezado */}
      <div className="mb-3 flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/60">
              {tramo.sectionCode || "Sección"}
            </span>
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold"
              style={{
                backgroundColor: `${statusBadgeColor}20`,
                color: statusBadgeColor,
                border: `1px solid ${statusBadgeColor}40`,
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: statusBadgeColor }}
              />
              {resolved?.label ?? tramo.status ?? "Disponible"}
            </span>
          </div>

          <h3 className="m-0 mt-1.5 text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2 truncate">
            <Boxes size={20} className="text-amber-400 shrink-0" />
            <span className="truncate">{tramo.code}</span>
          </h3>
        </div>

        <button
          type="button"
          aria-label="Cerrar detalle"
          onClick={handleClose}
          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-slate-100 shrink-0"
        >
          <X size={16} />
        </button>
      </div>

      {/* Métricas Generales */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
          <p className="text-slate-400 m-0">Dimensiones (m)</p>
          <p className="font-bold text-white m-0 text-sm">
            {tramo.width.toFixed(2)} × {tramo.length.toFixed(2)}
          </p>
        </div>
        <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
          <p className="text-slate-400 m-0">Área Total</p>
          <p className="font-bold text-white m-0 text-sm">
            {totalArea.toFixed(2)} m²
          </p>
        </div>
        <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
          <p className="text-slate-400 m-0">Estiba / Apilado</p>
          <p className="font-bold text-white m-0 text-sm">
            {tramo.allowsStacking ? "Permitido (Multinivel)" : "Solo Piso"}
          </p>
        </div>
        <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
          <p className="text-slate-400 m-0">Orientación</p>
          <p className="font-bold text-white m-0 text-sm">
            {tramo.isRotated90 ? "90° (Rotado)" : "0° (Normal)"}
          </p>
        </div>
      </div>

      {/* Capacidad y Ocupación */}
      <div className="mb-3 space-y-2 rounded-lg border border-slate-800 bg-slate-900/80 p-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300">Ocupación de Área</span>
          {isLoadingCapacities ? (
            <span className="text-[10px] text-slate-500 animate-pulse">Consultando...</span>
          ) : (
            <span className="font-bold text-amber-400">{pctOccupied}%</span>
          )}
        </div>

        {/* Barra de progreso */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${pctOccupied}%`,
              backgroundColor:
                pctOccupied > 85 ? "#ef4444" : pctOccupied > 50 ? "#f59e0b" : "#22c55e",
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-400">
          <div>
            <span>Ocupado: </span>
            <span className="font-semibold text-slate-200">{usedArea.toFixed(2)} m²</span>
          </div>
          <div>
            <span>Disponible: </span>
            <span className="font-semibold text-slate-200">{availArea.toFixed(2)} m²</span>
          </div>
        </div>

        {capacities?.unused_area_m2 ? (
          <p className="text-[10px] text-slate-500 m-0 pt-0.5">
            Margen / Pasillo: {capacities.unused_area_m2.toFixed(2)} m²
          </p>
        ) : null}
      </div>

      {/* Motivo de no disponibilidad si aplica */}
      {tramo.raw.unavailable_reason && (
        <div className="mb-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-200">
          <p className="font-bold m-0 mb-1">Motivo de Bloqueo:</p>
          <p className="m-0 text-[11px] text-amber-300">{tramo.raw.unavailable_reason}</p>
        </div>
      )}

      {/* Botón de acceso al editor 2D */}
      <button
        type="button"
        onClick={handleNavigate2D}
        className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-700 hover:text-white cursor-pointer"
      >
        <ExternalLink size={13} className="text-sky-400" />
        <span>Abrir Editor 2D de Tramos</span>
      </button>
    </aside>
  );
}

function RackDetailView({ rack }: { rack: ProcessedRack3D }) {
  const selectedBodegaId = useBodegaViewerStore((s) => s.selectedBodegaId);
  const clearRackSelection = useBodegaViewerStore((s) => s.clearRackSelection);
  const exitTramoFocus = useBodegaViewerStore((s) => s.exitTramoFocus);
  const selectedLevel = useBodegaViewerStore((s) => s.selectedLevel);
  const selectLevel = useBodegaViewerStore((s) => s.selectLevel);

  const { companyId, moduleCode } = useUserStore();
  const activeLevelFilter = selectedLevel;
  const setActiveLevelFilter = selectLevel;

  // Consultar en paralelo los detalles y posiciones de cada nivel de la bahía (Nivel 1, Nivel 2, etc.)
  const rackQueries = useQueries({
    queries: (rack.levels ?? []).map((lvl) => ({
      queryKey: [
        "rack-level-details",
        companyId,
        moduleCode,
        selectedBodegaId,
        rack.sectionId,
        lvl.rackId,
      ],
      queryFn: () =>
        rackService.GetRackDetails({
          company_id: companyId!,
          module_code: moduleCode!,
          warehouse_id: selectedBodegaId!,
          section_id: rack.sectionId,
          rack_id: lvl.rackId,
        }),
      enabled: Boolean(
        lvl.rackId &&
          selectedBodegaId &&
          companyId?.trim() &&
          moduleCode?.trim(),
      ),
      refetchOnWindowFocus: false,
      staleTime: 60_000,
    })),
  });

  const rackLevels = rack.levels;

  // Recopilar posiciones de todos los niveles, asignando con certeza su nivel respectivo
  const allPositions = useMemo(() => {
    if (!rackLevels) return [];
    const list: (RackPositionDetailDto & { effectiveLevel: number })[] = [];
    rackLevels.forEach((lvl, idx) => {
      const q = rackQueries[idx];
      const data = q?.data;
      if (data?.positions && data.positions.length > 0) {
        data.positions.forEach((pos) => {
          list.push({
            ...pos,
            effectiveLevel: lvl.levelNumber,
          });
        });
      }
    });
    return list;
  }, [rackLevels, rackQueries]);

  const isLoading = rackQueries.some((q) => q.isLoading);

  const currentQueryIndex = (rack.levels ?? []).findIndex(
    (l) => l.levelNumber === activeLevelFilter,
  );
  const currentQueryData =
    currentQueryIndex >= 0 ? rackQueries[currentQueryIndex]?.data : null;

  const currentLevelData = rack.levels?.find(
    (l) => l.levelNumber === activeLevelFilter,
  );
  const activeStatus =
    currentQueryData?.status ?? currentLevelData?.status ?? rack.status;
  const resolved = resolveRackStatus(activeStatus);
  const statusKey = (resolved?.textValue ?? "Available") as keyof typeof RACK_STATUS_COLORS;
  const statusBadgeColor = RACK_STATUS_COLORS[statusKey] ?? "#22c55e";
  const isWarningStatus =
    statusKey === "UnderMaintenance" || statusKey === "Blocked";

  const handleClose = () => {
    clearRackSelection();
    exitTramoFocus();
  };

  const filteredPositions =
    activeLevelFilter == null
      ? allPositions
      : allPositions.filter((p) => p.effectiveLevel === activeLevelFilter);

  const levelsList =
    rack.levels && rack.levels.length > 0
      ? rack.levels.map((l) => l.levelNumber)
      : [1, 2];

  const displayCode = currentLevelData?.code || rack.code;

  return (
    <aside className="fixed sm:absolute inset-x-2 bottom-2 sm:bottom-3 sm:inset-x-auto sm:right-3 sm:top-16 sm:max-h-[calc(100%-4.75rem)] z-40 max-h-[75vh] w-auto sm:w-[350px] overflow-y-auto rounded-2xl border border-slate-700/80 bg-slate-950/95 p-3.5 sm:p-4 shadow-2xl backdrop-blur-md transition-all custom-scrollbar">
      {/* Handle indicator for mobile bottom sheet */}
      <div className="mx-auto -mt-1 mb-2.5 h-1 w-10 rounded-full bg-slate-700/80 sm:hidden" />

      {/* Encabezado */}
      <div className="mb-3 flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/60">
              {rack.sectionCode || "Sección"}
            </span>
            <span
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold"
              style={{
                backgroundColor: `${statusBadgeColor}20`,
                color: statusBadgeColor,
                border: `1px solid ${statusBadgeColor}40`,
              }}
            >
              {isWarningStatus ? (
                <span className="relative flex h-1.5 w-1.5">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ backgroundColor: statusBadgeColor }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-1.5 w-1.5"
                    style={{ backgroundColor: statusBadgeColor }}
                  />
                </span>
              ) : (
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: statusBadgeColor }}
                />
              )}
              {resolved?.label ?? rack.status}
            </span>
          </div>

          <h3 className="m-0 mt-1.5 text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2 truncate">
            <Layers size={20} className="text-sky-400 shrink-0" />
            <span className="truncate">{displayCode}</span>
          </h3>
        </div>

        <button
          type="button"
          aria-label="Cerrar detalle"
          onClick={handleClose}
          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-slate-100 shrink-0"
        >
          <X size={16} />
        </button>
      </div>

      {/* Métricas Generales */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
          <p className="text-slate-400 m-0">Hilera / Nivel</p>
          <p className="font-bold text-white m-0 text-sm truncate" title={currentLevelData?.code}>
            H{currentLevelData?.raw?.row_number ?? rack.rowNumber} · {activeLevelFilter ? `N${activeLevelFilter}` : "Todos"}
          </p>
        </div>
        <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
          <p className="text-slate-400 m-0">Separación niveles</p>
          <p className="font-bold text-white m-0 text-sm flex items-center gap-1">
            <Ruler size={13} className="text-sky-400" />
            {rack.tierHeight.toFixed(2)} m
          </p>
        </div>
        <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
          <p className="text-slate-400 m-0">Polines por nivel</p>
          <p className="font-bold text-white m-0 text-sm">
            {rack.maxPulleys} polines
          </p>
        </div>
        <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
          <p className="text-slate-400 m-0">Medidas bahía (m)</p>
          <p className="font-bold text-white m-0 text-sm">
            {rack.raw?.width ?? 1.1} × {rack.raw?.length ?? 2.5} × {rack.raw?.height ?? 5}
          </p>
        </div>
        <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 col-span-2">
          <p className="text-slate-400 m-0">Perfil de uso</p>
          <p
            className="font-bold text-white m-0 text-xs truncate"
            title={getUsageProfileLabel(rack.usageProfile)}
          >
            {getUsageProfileLabel(rack.usageProfile)}
          </p>
        </div>
      </div>

      {/* Selector de nivel */}
      {levelsList.length > 1 && (
        <div className="mb-3">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Filtrar Nivel:
          </p>
          <div className="flex gap-1 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveLevelFilter(null)}
              className={`px-2 py-0.5 rounded text-xs font-semibold transition-all ${
                activeLevelFilter === null
                  ? "bg-sky-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              Todos ({allPositions.length})
            </button>
            {(rack.levels && rack.levels.length > 0
              ? rack.levels
              : levelsList.map((l) => ({ levelNumber: l, code: `Nivel ${l}` }))
            ).map((lvl) => {
              const qIndex = (rack.levels ?? []).findIndex(
                (l) => l.levelNumber === lvl.levelNumber,
              );
              const qData = qIndex >= 0 ? rackQueries[qIndex]?.data : null;
              const lvlStatus = qData?.status ?? ("status" in lvl ? lvl.status : "available");
              const resolvedLvl = resolveRackStatus(lvlStatus);
              const lvlKey = (resolvedLvl?.textValue ?? "Available") as keyof typeof RACK_STATUS_COLORS;
              const dotColor = RACK_STATUS_COLORS[lvlKey] ?? "#4ade80";

              return (
                <button
                  key={lvl.levelNumber}
                  type="button"
                  onClick={() => setActiveLevelFilter(lvl.levelNumber)}
                  className={`px-2 py-0.5 rounded text-xs font-semibold transition-all inline-flex items-center gap-1.5 ${
                    activeLevelFilter === lvl.levelNumber
                      ? "bg-sky-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: dotColor }}
                  />
                  <span>
                    N{lvl.levelNumber} · {lvl.code}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Detalle de Posiciones / Inventario */}
      <div className="space-y-2">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider m-0 flex items-center justify-between">
          <span>Posiciones ({filteredPositions.length})</span>
          {isLoading && (
            <span className="text-[10px] text-slate-500 animate-pulse">
              Actualizando...
            </span>
          )}
        </p>

        {filteredPositions.length > 0 ? (
          <div className="space-y-1.5 max-h-[240px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredPositions.map((pos) => {
              const stock = pos.current_stock;
              const hasStock = Boolean(
                stock && stock.product_name && stock.product_name.trim().length > 0,
              );

              const resolvedPos = resolveRackStatus(pos.status);
              const posKey = (resolvedPos?.textValue ?? (hasStock ? "Occupied" : "Available")) as keyof typeof RACK_STATUS_COLORS;
              const posColor = RACK_STATUS_COLORS[posKey] ?? "#4ade80";
              const posLabel = resolvedPos?.label ?? (hasStock ? "Ocupado" : "Disponible");
              const isWarningPos = posKey === "UnderMaintenance" || posKey === "Blocked";

              return (
                <div
                  key={pos.position_id}
                  className={`p-2.5 rounded-lg border text-xs transition-all ${
                    posKey === "Occupied" || hasStock
                      ? "bg-slate-900/90 border-sky-600/40 shadow-xs"
                      : posKey === "UnderMaintenance"
                        ? "bg-amber-950/20 border-amber-500/40 shadow-xs"
                        : posKey === "Blocked"
                          ? "bg-red-950/20 border-red-500/40 shadow-xs"
                          : posKey === "Reserved"
                            ? "bg-purple-950/20 border-purple-500/40 shadow-xs"
                            : "bg-slate-900/40 border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-slate-200 flex items-center gap-1">
                      <Layers size={12} className="text-sky-400" />
                      {pos.position_code || `P-N${pos.level}-C${pos.column}`}
                    </span>
                    <span
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold"
                      style={{
                        backgroundColor: `${posColor}20`,
                        color: posColor,
                        border: `1px solid ${posColor}40`,
                      }}
                    >
                      {isWarningPos ? (
                        <span className="relative flex h-1.5 w-1.5">
                          <span
                            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                            style={{ backgroundColor: posColor }}
                          />
                          <span
                            className="relative inline-flex rounded-full h-1.5 w-1.5"
                            style={{ backgroundColor: posColor }}
                          />
                        </span>
                      ) : (
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: posColor }}
                        />
                      )}
                      {posLabel}
                    </span>
                  </div>

                  {/* Detalle según estado de la posición */}
                  {hasStock && stock ? (
                    <div className="mt-1.5 space-y-1 text-slate-300">
                      <p
                        className="font-semibold text-white m-0 truncate"
                        title={stock.product_name ?? ""}
                      >
                        {stock.product_name || "Producto sin nombre"}
                      </p>
                      {stock.category_name && (
                        <p className="text-[10px] text-slate-400 m-0">
                          Cat: {stock.category_name}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                        <span className="flex items-center gap-1">
                          <Box size={11} className="text-sky-400" />
                          {stock.current_bultos} bultos
                        </span>
                        <span className="flex items-center gap-1">
                          <Weight size={11} className="text-emerald-400" />
                          {stock.current_weight_kg.toFixed(1)} kg
                        </span>
                      </div>
                      {stock.placed_at_date && (
                        <p className="text-[10px] text-slate-500 m-0 flex items-center gap-1 pt-0.5">
                          <Calendar size={10} />
                          Ingreso: {stock.placed_at_date} {stock.placed_at_time || ""}
                        </p>
                      )}
                    </div>
                  ) : posKey === "UnderMaintenance" ? (
                    <div className="mt-1.5 flex items-start gap-1.5 text-[11px] text-amber-300/90 bg-amber-950/40 p-1.5 rounded border border-amber-800/40">
                      <AlertTriangle size={13} className="shrink-0 mt-0.5 text-amber-400 animate-pulse" />
                      <span>
                        {pos.observations || "Posición inhabilitada por mantenimiento estructural o preventivo."}
                      </span>
                    </div>
                  ) : posKey === "Blocked" ? (
                    <div className="mt-1.5 flex items-start gap-1.5 text-[11px] text-red-300/90 bg-red-950/40 p-1.5 rounded border border-red-800/40">
                      <Ban size={13} className="shrink-0 mt-0.5 text-red-400 animate-pulse" />
                      <span>
                        {pos.observations || "Posición bloqueada por directiva operativa o cuarentena."}
                      </span>
                    </div>
                  ) : posKey === "Reserved" ? (
                    <div className="mt-1.5 flex items-start gap-1.5 text-[11px] text-purple-300/90 bg-purple-950/40 p-1.5 rounded border border-purple-800/40">
                      <BookmarkCheck size={13} className="shrink-0 mt-0.5 text-purple-400" />
                      <span>
                        {pos.observations || "Posición reservada para orden de ingreso o albarán."}
                      </span>
                    </div>
                  ) : (
                    <p className="text-[11px] text-emerald-400/80 m-0 pt-0.5 flex items-center gap-1">
                      <CheckCircle2 size={11} className="text-emerald-400" />
                      Disponible para ubicar mercancía
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-3 text-center text-xs text-slate-500 bg-slate-900/50 rounded-lg border border-slate-800">
            No hay posiciones registradas para este rack.
          </div>
        )}
      </div>
    </aside>
  );
}

export function LocationDetailPanel() {
  const focusedRack = useBodegaViewerStore((s) => s.focusedRack);
  const focusedTramo = useBodegaViewerStore((s) => s.focusedTramo);

  if (focusedTramo) {
    return <TramoDetailView tramo={focusedTramo} />;
  }

  if (focusedRack) {
    return <RackDetailView rack={focusedRack} />;
  }

  return null;
}
