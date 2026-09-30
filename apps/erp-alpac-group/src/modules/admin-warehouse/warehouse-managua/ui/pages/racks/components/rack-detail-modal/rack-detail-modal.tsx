import { Button, Card, MetricCard, Modal } from "@alpac/design-system";
import { Boxes, Calendar, CheckCircle2, Layers, Package, Ruler } from "lucide-react";
import type { RackDetailModalProps } from "./types/rack-detail-modal.types";
import {RackStatusBadge,RackUsageProfileBadge} from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/layout-warehouses-badges";
import { useRack } from "@app/modules/admin-warehouse/warehouse-managua/ui/hooks/useRack";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { Loader } from "@app/shared/components/loaders/loader";
import { cancelButtonClass } from "../../utils/style.racks";

export const RackDetailModal = ({
  isOpen,
  warehouseId,
  sectionId,
  rackId,
  rackSummary,
  onClose,
}: RackDetailModalProps) => {
  const { companyId, moduleCode } = useUserStore();

  const { GetRackDetails } = useRack({
    getRackDetailsPayload:
      isOpen && rackId
        ? {
            company_id: companyId,
            module_code: moduleCode,
            warehouse_id: warehouseId,
            section_id: sectionId,
            rack_id: rackId,
          }
        : undefined,
  });

  const rack = GetRackDetails.data;
  const positions = rack?.positions ?? [];
  const occupiedCount = positions.filter((p) => p.current_stock != null).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        rack || rackSummary
          ? `Rack ${(rack ?? rackSummary)?.code}`
          : "Posiciones del rack"
      }
      variant="default"
      size="4xl"
      description="Distribución de polines y posiciones de almacenamiento"
    >
      {GetRackDetails.isLoading ? (
        <div className="py-8">
          <Loader title="Cargando información del rack..." />
        </div>
      ) : rack ? (
        <div className="flex flex-col gap-4 mt-2">
          {/* Bagdes */}
          <div className="flex items-center gap-2">
            <RackStatusBadge value={rack.status} />
            <RackUsageProfileBadge value={rack.usage_profile} />
          </div>

          {/* Cards*/}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MetricCard
              size="compact"
              title="Ubicación"
              value={`Nivel ${rack.level_number} · Hilera ${rack.row_number}`}
              icon={<Layers size={14} />}
              themeClass="bg-blue-400"
            />

            <MetricCard
              size="compact"
              title="Capacidad"
              value={`${rack.max_pulleys} polines por nivel`}
              icon={<Boxes size={14} />}
              themeClass="bg-amber-400"
            />

            <MetricCard
              size="compact"
              title="Dimensiones (L × A × H)"
              value={`${rack.capacity?.length ?? 0}m × ${rack.capacity?.width ?? 0}m × ${rack.capacity?.height ?? 0}m`}
              icon={<Ruler size={14} />}
              themeClass="bg-purple-400"
            />

            <MetricCard
              size="compact"
              title="Ocupación Actual"
              value={`${occupiedCount} de ${positions.length} ocupadas`}
              icon={<CheckCircle2 size={14} />}
              themeClass="bg-emerald-400"
            />
          </div>


          {/* Distribución de Polines del Rack (Nivel único) */}
          <div className="rounded-lg border border-slate-700/60 bg-slate-800/30 p-3">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-700/40 text-xs">
              <span className="font-semibold text-slate-200">
                Polines de almacenamiento
              </span>
            </div>

            <div
              className="grid gap-3"
              style={{
                gridTemplateColumns: `repeat(${rack.max_pulleys || positions.length || 1}, minmax(0, 1fr))`,
              }}
            >
              {positions.map((pos) => {
                const isBlocked = pos.status === "Blocked" || !pos.allows_stocking;
                const isOccupied = Boolean(pos.current_stock);

                return (
                  <Card
                    key={pos.position_id}
                    className={`p-3 transition-all flex flex-col justify-between gap-3 border ${
                      isBlocked
                        ? "border-red-700/60 bg-red-950/20"
                        : isOccupied
                          ? "border-amber-600/50 bg-amber-950/20"
                          : "border-emerald-700/40 bg-emerald-950/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-white">
                          Polín {pos.column}
                        </span>
                        <span className="font-mono text-[11px] text-slate-400 bg-black/40 px-1.5 py-0.5 rounded border border-slate-700/50">
                          {pos.position_code}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                          isBlocked
                            ? "border-red-600/60 text-red-300 bg-red-500/10"
                            : isOccupied
                              ? "border-amber-500/60 text-amber-300 bg-amber-500/10"
                              : "border-emerald-500/60 text-emerald-300 bg-emerald-500/10"
                        }`}
                      >
                        {isBlocked ? "Bloqueada" : isOccupied ? "Ocupada" : "Disponible"}
                      </span>
                    </div>

                    {pos.current_stock ? (
                      <div className="flex flex-col gap-1.5 text-xs bg-black/30 p-2.5 rounded-md border border-slate-700/40">
                        <div className="flex items-center gap-1.5 font-medium text-slate-100">
                          <Package size={13} className="shrink-0 text-amber-400" />
                          <span className="truncate">
                            {pos.current_stock.product_name ?? "Producto sin nombre"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300 text-[11px]">
                          <span>{pos.current_stock.current_bultos} bultos</span>
                          <span>{pos.current_stock.current_weight_kg} kg</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 pt-1.5 border-t border-slate-700/50">
                          <Calendar size={11} />
                          <span>Estibado: {pos.current_stock.placed_at_date}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="py-2.5 text-center text-xs text-slate-400 italic">
                        Disponible para estibar
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="border-t border-t-slate-300 dark:border-t-neutral-600 -mx-6 my-1" />

          <div className="flex justify-end">
            <Button
              type="button"
              size="giant"
              label="Cerrar"
              className={cancelButtonClass}
              onClick={onClose}
            />
          </div>
        </div>
      ) : null}
    </Modal>
  );
};
