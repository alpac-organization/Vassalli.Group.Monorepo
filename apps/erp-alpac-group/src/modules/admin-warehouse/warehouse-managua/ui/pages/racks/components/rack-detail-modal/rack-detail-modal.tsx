import { Button, Modal } from "@alpac/design-system";
import { Boxes, Layers, MapPin, X } from "lucide-react";
import type { RackDetailModalProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/components/rack-detail-modal/types/rack-detail-modal.types";
import type { Positions } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-rack-res";
import { sortRackPositions } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/utils/sort-rack-positions";
import { RackStatusBadge } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/layout-warehouses-badges";

const positionCellClassName =
  "flex flex-col items-center justify-center gap-0.5 rounded-md border px-2 py-2 text-center text-[11px]";

function getPositionVisual(position: Positions) {
  if (position.is_blocked) {
    return {
      label: "Bloqueada",
      className: "border-red-700/60 bg-[#3a1d1d] text-red-300",
    };
  }

  if (position.is_occupied) {
    return {
      label: "Ocupada",
      className: "border-amber-600/50 bg-[#3a2e14] text-amber-300",
    };
  }

  return {
    label: "Disponible",
    className: "border-[#1b3b30] bg-[#132a22] text-[#4ade80]",
  };
}

export const RackDetailModal = ({
  isOpen,
  rack,
  onClose,
}: RackDetailModalProps) => {
  const positions = sortRackPositions(rack?.positions ?? []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={rack ? `Posiciones — Rack ${rack.code}` : "Posiciones del rack"}
      variant="default"
      size="5xl"
      description="Distribución y estado de cada posición del rack"
    >
      {rack && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <div className="rounded-lg border border-[#2a2d3d] bg-[#1b1e27] p-3">
              <div className="flex items-center gap-2 text-slate-400">
                <Layers size={14} />
                <span className="text-xs">Nivel / Fila</span>
              </div>
              <p className="mt-1 text-sm font-medium text-white">
                {rack.level_number} / {rack.row_number}
              </p>
            </div>

            <div className="rounded-lg border border-[#2a2d3d] bg-[#1b1e27] p-3">
              <div className="flex items-center gap-2 text-slate-400">
                <Boxes size={14} />
                <span className="text-xs">Posiciones</span>
              </div>
              <p className="mt-1 text-sm font-medium text-white">
                {rack.occupied_positions} / {rack.total_positions}
              </p>
            </div>

            <div className="rounded-lg border border-[#2a2d3d] bg-[#1b1e27] p-3">
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin size={14} />
                <span className="text-xs">Estado del rack</span>
              </div>
              <div className="mt-1">
                <RackStatusBadge value={rack.status ?? ""} />
              </div>
            </div>
          </div>

          <div>
            <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-slate-300">
                Distribución de posiciones
              </p>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 rounded-md border border-emerald-500/4 bg-emerald-500/15" />
                  Disponible
                </span>

                <span className="flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 rounded-md border border-[#2F6FB2]! bg-[#123C69]" />
                  Ocupada
                </span>

                <span className="flex items-center gap-1">
                  <span className=" inline-block h-2.5 w-2.5 rounded-md border border-[#5c2424]! bg-[#3a1d1d]!" />
                  Bloqueada
                </span>
              </div>
            </div>

            {positions.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">
                Este rack no tiene posiciones registradas.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                {positions.map((position) => {
                  const visual = getPositionVisual(position);
                  const reason = position.block_reason?.trim();

                  return (
                    <div
                      key={position.position_id}
                      title={
                        reason
                          ? reason
                          : `${position.position_code} — ${visual.label}`
                      }
                      className={`${positionCellClassName} ${visual.className}`}
                    >
                      <span className="font-medium">
                        {position.position_code}
                      </span>
                      <span className="text-[10px] opacity-80">
                        #{position.position_number}
                      </span>
                      <span className="text-[10px] opacity-80">
                        {visual.label}
                      </span>
                      {reason && (
                        <span className="mt-0.5 line-clamp-2 text-[9px] opacity-70">
                          {reason}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex min-w-0 justify-end">
            <Button
              type="button"
              size="giant"
              label="Cerrar"
              icon={<X size={18} />}
              onClick={onClose}
              className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-white! dark:bg-transparent! text-slate-700! dark:text-slate-300! border! border-slate-300! dark:border-slate-600! hover:bg-slate-50! dark:hover:bg-slate-700/30! sm:w-auto!"
            />
          </div>
        </div>
      )}
    </Modal>
  );
};
