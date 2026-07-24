import { X } from "lucide-react";
import {
  STATUS_COLOR,
  STATUS_LABEL,
  type OccupancyMap,
} from "../types/warehouse-3d.types";
import { parseRackBase, rackLevelIndex } from "../utils/location-codes";
import { useBodegaViewerStore } from "../stores/use-bodega-viewer-store";
import { getLayoutByBodegaId } from "../data/bodega-2-fiscal.layout";

interface LocationDetailPanelProps {
  occupancy: OccupancyMap;
}

function levelDescription(code: string): string {
  const level = rackLevelIndex(code);
  if (level === 0) return "Nivel 1 · Piso";
  if (level === 1) return "Nivel 2 · Rack";
  return "Nivel 3 · Rack";
}

export function LocationDetailPanel({ occupancy }: LocationDetailPanelProps) {
  const code = useBodegaViewerStore((s) => s.selectedLocationCode);
  const bodegaId = useBodegaViewerStore((s) => s.selectedBodegaId);
  const focusedTramoId = useBodegaViewerStore((s) => s.focusedTramoId);
  const clearLevelSelection = useBodegaViewerStore(
    (s) => s.clearLevelSelection,
  );

  if (!code) return null;

  const status = occupancy[code] ?? "free";
  const base = parseRackBase(code);
  const layout = bodegaId ? getLayoutByBodegaId(bodegaId) : null;
  const rack = layout?.rackTramos.find((t) => t.id === base || t.baseCode === base);
  const floor = layout?.floorTramos.find((t) => t.code === code);
  const isRackLevel = Boolean(rack);

  return (
    <aside className="absolute right-4 top-4 z-10 w-[280px] rounded-xl border border-slate-700/90 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-md">
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <p className="m-0 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Ubicación
          </p>
          <h3 className="m-0 mt-0.5 text-2xl font-bold tracking-tight text-white">
            {code}
          </h3>
        </div>
        <button
          type="button"
          aria-label="Cerrar detalle"
          onClick={() => clearLevelSelection()}
          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-slate-100"
        >
          <X size={16} />
        </button>
      </div>

      <dl className="m-0 space-y-2.5 text-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-2.5">
          <dt className="text-slate-400">Tramo base</dt>
          <dd className="m-0 font-semibold text-white">{base}</dd>
        </div>
        <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-2.5">
          <dt className="text-slate-400">Nivel</dt>
          <dd className="m-0 font-semibold text-white">
            {isRackLevel ? levelDescription(code) : "Piso (sin rack)"}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-2.5">
          <dt className="text-slate-400">Estado</dt>
          <dd className="m-0 flex items-center gap-1.5 font-semibold text-white">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: STATUS_COLOR[status] }}
            />
            {STATUS_LABEL[status]}
          </dd>
        </div>

        {rack && (
          <>
            <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-2.5">
              <dt className="text-slate-400">Columna</dt>
              <dd className="m-0 font-medium text-slate-100">
                {rack.column === "centerLeft"
                  ? "Centro izquierda"
                  : "Centro derecha"}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-2.5">
              <dt className="text-slate-400">Medidas</dt>
              <dd className="m-0 font-medium text-slate-100">
                {rack.size.width.toFixed(2)} × {rack.size.depth.toFixed(2)} m
              </dd>
            </div>
            <div className="pt-1">
              <p className="m-0 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Niveles del tramo
              </p>
              <ul className="m-0 space-y-1 p-0 list-none">
                {rack.levels.map((levelCode) => {
                  const levelStatus = occupancy[levelCode] ?? "free";
                  const active = levelCode === code;
                  return (
                    <li
                      key={levelCode}
                      className={`flex items-center justify-between rounded-md px-2 py-1.5 text-xs ${
                        active
                          ? "bg-slate-800/90 ring-1 ring-sky-500/50"
                          : "bg-slate-900/50"
                      }`}
                    >
                      <span
                        className={
                          active
                            ? "font-semibold text-white"
                            : "text-slate-300"
                        }
                      >
                        {levelCode}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <span
                          className="inline-block h-2 w-2 rounded-full"
                          style={{
                            backgroundColor: STATUS_COLOR[levelStatus],
                          }}
                        />
                        {STATUS_LABEL[levelStatus]}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        )}

        {floor && (
          <div className="flex items-center justify-between gap-3">
            <dt className="text-slate-400">Medidas</dt>
            <dd className="m-0 font-medium text-slate-100">
              {floor.size.width.toFixed(2)} × {floor.size.depth.toFixed(2)} m
            </dd>
          </div>
        )}

        {focusedTramoId && isRackLevel && (
          <p className="m-0 pt-1 text-[11px] leading-relaxed text-slate-500">
            Haz click en otro nivel del rack para cambiar la ubicación, o
            usa Volver para salir del zoom.
          </p>
        )}
      </dl>
    </aside>
  );
}
