import { Button, Modal } from "@alpac/design-system";
import { Boxes, Layers, MapPin, Ruler, X } from "lucide-react";
import type { LotDetailModalProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/tramos/lot-detail-modal/types/lot-detail-modal.types";
import { getLotPositionMap } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/tramos/utils/map-lot-positions";
import { RackStatusBadge } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/layout-warehouses-badges";

const positionCellClassName =
  "flex flex-col items-center justify-center gap-0.5 rounded-md border px-2 py-2 text-center text-[11px]";

export const LotDetailModal = ({
  isOpen,
  lot,
  isLoading,
  onClose,
}: LotDetailModalProps) => {
  const positionsByRowColumn = getLotPositionMap(lot?.positions ?? []);

  const renderPosition = (rowNumber: number, columnNumber: number) => {
    const position = positionsByRowColumn.get(`${rowNumber}-${columnNumber}`);

    if (!position) {
      return (
        <div
          key={`${rowNumber}-${columnNumber}`}
          className={`${positionCellClassName} border-dashed border-slate-700 bg-slate-900/40 text-slate-600`}
        >
          <span>
            {rowNumber}-{columnNumber}
          </span>
        </div>
      );
    }

    return (
      <div
        key={position.position_id}
        title={position.position_code}
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
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={lot ? `Tramo ${lot.code}` : "Detalle del tramo"}
      variant="default"
      size="5xl"
      description="Ubicación de posiciones dentro del tramo"
    >
      {isLoading && (
        <div className="flex justify-center py-10">
          <span className="loader" />
        </div>
      )}

      {!isLoading && lot && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-lg border border-[#2a2d3d] bg-[#1b1e27] p-3">
              <div className="flex items-center gap-2 text-slate-400">
                <Ruler size={14} />
                <span className="text-xs">Dimensiones</span>
              </div>
              <p className="mt-1 text-sm font-medium text-white">
                {lot.width_metres} x {lot.length_metres} m
              </p>
            </div>

            <div className="rounded-lg border border-[#2a2d3d] bg-[#1b1e27] p-3">
              <div className="flex items-center gap-2 text-slate-400">
                <Layers size={14} />
                <span className="text-xs">Filas x Columnas</span>
              </div>
              <p className="mt-1 text-sm font-medium text-white">
                {lot.nominal_rows} x {lot.nominal_columns}
              </p>
            </div>

            <div className="rounded-lg border border-[#2a2d3d] bg-[#1b1e27] p-3">
              <div className="flex items-center gap-2 text-slate-400">
                <Boxes size={14} />
                <span className="text-xs">Posiciones</span>
              </div>
              <p className="mt-1 text-sm font-medium text-white">
                {lot.occupied_positions} / {lot.total_positions}
              </p>
            </div>

            <div className="rounded-lg border border-[#2a2d3d] bg-[#1b1e27] p-3">
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin size={14} />
                <span className="text-xs">Estado</span>
              </div>
              <div className="mt-1">
                <RackStatusBadge value={lot.status ?? ""} />
              </div>
            </div>
          </div>

          {lot.unavailable_reason && (
            <div className="rounded-lg border border-[#3a2c0a] bg-[#33270a] p-3 text-sm text-[#fbbf24]">
              <strong>Motivo:</strong> {lot.unavailable_reason}
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

            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${lot.nominal_columns}, minmax(0, 1fr))`,
              }}
            >
              {Array.from(
                { length: lot.nominal_rows },
                (_, rowIndex) => rowIndex + 1,
              ).map((rowNumber) =>
                Array.from(
                  { length: lot.nominal_columns },
                  (_, columnIndex) => columnIndex + 1,
                ).map((columnNumber) =>
                  renderPosition(rowNumber, columnNumber),
                ),
              )}
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
