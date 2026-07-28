import { X } from "lucide-react";
import {
  STATUS_COLOR,
  STATUS_LABEL,
  occupancyOf,
  resolvePolines,
  resolveStatus,
  type OccupancyMap,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/types/warehouse-3d.types";
import {
  parseRackBase,
  rackLevelIndex,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/utils/location-codes";
import { useBodegaViewerStore } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/stores/use-bodega-viewer-store";
import { getLayoutByBodegaId } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/data/bodega-2-fiscal.layout";
import { Button } from "@alpac/design-system";

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
  const clearLevelSelection = useBodegaViewerStore(
    (s) => s.clearLevelSelection,
  );
  if (!code) return null;

  const occ = occupancyOf(occupancy, code);
  const status = resolveStatus(occ);
  const polines = resolvePolines(occ);
  const base = parseRackBase(code);
  const layout = bodegaId ? getLayoutByBodegaId(bodegaId) : null;
  const rack = layout?.rackTramos.find(
    (t) => t.id === base || t.baseCode === base,
  );
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
        <Button
          type="button"
          aria-label="Cerrar detalle"
          onClick={() => clearLevelSelection()}
          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-slate-100"
          icon={<X size={16} />}
        />
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
          <dt className="text-slate-400">Estado:</dt>
          <dd className="m-0 flex items-center gap-1.5 font-semibold text-white">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: STATUS_COLOR[status] }}
            />
            {STATUS_LABEL[status]}
          </dd>
        </div>

        {isRackLevel && (
          <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-2.5">
            <dt className="text-slate-400">Polines</dt>
            <dd className="m-0 flex items-center gap-2 font-semibold text-white">
              <span className="flex items-center gap-1">
                {[0, 1].map((i) => (
                  <span
                    key={i}
                    className="inline-block h-2.5 w-2.5 rounded-sm"
                    title={i < polines ? "Ocupado" : "Libre"}
                    style={{
                      backgroundColor:
                        i < polines ? STATUS_COLOR.occupied : STATUS_COLOR.free,
                    }}
                  />
                ))}
              </span>
              <span>
                {polines} / 2{polines === 0 ? " · ambos libres" : ""}
                {polines === 1 ? " · 1 ocupado, 1 libre" : ""}
                {polines === 2 ? " · ambos ocupados" : ""}
              </span>
            </dd>
          </div>
        )}

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
                Niveles del tramo:
              </p>
              <ul className="m-0 list-none space-y-1 p-0">
                {rack.levels.map((levelCode) => {
                  const levelOcc = occupancyOf(occupancy, levelCode);
                  const levelPolines = resolvePolines(levelOcc);
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
                          active ? "font-semibold text-white" : "text-slate-300"
                        }
                      >
                        {levelCode}
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <span className="tabular-nums">{levelPolines}/2</span>
                        <span className="flex items-center gap-0.5">
                          {[0, 1].map((i) => (
                            <span
                              key={i}
                              className="inline-block h-2 w-2 rounded-sm"
                              style={{
                                backgroundColor:
                                  i < levelPolines
                                    ? STATUS_COLOR.occupied
                                    : STATUS_COLOR.free,
                              }}
                            />
                          ))}
                        </span>
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
      </dl>
    </aside>
  );
}
