import { Button, Modal } from "@alpac/design-system";
import { Boxes, Layers, MapPin, Ruler, Workflow, X } from "lucide-react";
import type { RackDetailModalProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/rack-detail-modal.types";
import { getUsageProfileLabel } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/utils/get-usage-profile-label";
import { sortRackPositions } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/utils/sort-rack-positions";
import { RackStatusBadge } from "@app/modules/warehouse/ui/warehouse-admin/utils/layout-badges";

const positionCellClassName =
  "flex flex-col items-center justify-center gap-0.5 rounded-md border px-2 py-2 text-center text-[11px]";

export const RackDetailModal = ({
  isOpen,
  rack,
  isLoading,
  onClose,
}: RackDetailModalProps) => {
  const positions = sortRackPositions(rack?.positions ?? []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={rack ? `Rack ${rack.code ?? ""}` : "Detalle del rack"}
      variant="default"
      size="5xl"
      description="Ubicación de posiciones dentro del rack"
    >
      {isLoading && (
        <div className="flex justify-center py-10">
          <span className="loader" />
        </div>
      )}

      {!isLoading && rack && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            <div className="rounded-lg border border-[#2a2d3d] bg-[#1b1e27] p-3">
              <div className="flex items-center gap-2 text-slate-400">
                <Ruler size={14} />
                <span className="text-xs">Dimensiones</span>
              </div>
              <p className="mt-1 text-sm font-medium text-white">
                {rack.width_metres} x {rack.length_metres} m
              </p>
            </div>

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
                <Workflow size={14} />
                <span className="text-xs">Perfil de uso</span>
              </div>
              <p className="mt-1 text-sm font-medium text-white">
                {getUsageProfileLabel(rack.usage_profile)}
              </p>
            </div>

            <div className="rounded-lg border border-[#2a2d3d] bg-[#1b1e27] p-3">
              <div className="flex items-center gap-2 text-slate-400">
                <Boxes size={14} />
                <span className="text-xs">Posiciones</span>
              </div>
              <p className="mt-1 text-sm font-medium text-white">
                {rack.ocupied_positions} / {rack.total_positions}
              </p>
            </div>

            <div className="rounded-lg border border-[#2a2d3d] bg-[#1b1e27] p-3">
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin size={14} />
                <span className="text-xs">Estado</span>
              </div>
              <div className="mt-1">
                <RackStatusBadge value={rack.status ?? null} />
              </div>
            </div>
          </div>

          {rack.unvailable_reason && (
            <div className="rounded-lg border border-[#3a2c0a] bg-[#33270a] p-3 text-sm text-[#fbbf24]">
              <strong>Motivo:</strong> {rack.unvailable_reason}
            </div>
          )}

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-300">
                Distribución de posiciones
              </p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm border border-[#1b3b30] bg-[#132a22]" />
                  Disponible
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm border border-red-700/60 bg-[#3a1d1d]" />
                  Bloqueada
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
              {positions.map((position) => (
                <div
                  key={position.position_id}
                  title={position.blocked_reason || position.position_code}
                  className={`${positionCellClassName} ${
                    position.is_blocked
                      ? "border-red-700/60 bg-[#3a1d1d] text-red-300"
                      : "border-[#1b3b30] bg-[#132a22] text-[#4ade80]"
                  }`}
                >
                  <span className="font-medium">{position.position_code}</span>
                  <span className="text-[10px] opacity-80">
                    {position.is_blocked ? "Bloqueada" : "Disponible"}
                  </span>
                </div>
              ))}
            </div>
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
