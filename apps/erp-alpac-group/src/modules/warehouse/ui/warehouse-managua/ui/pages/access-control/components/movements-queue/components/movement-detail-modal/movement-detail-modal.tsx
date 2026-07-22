import { Badges, Button, Modal } from "@alpac/design-system";
import { DetailField } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/components/detail-field/detail-field";
import { DetailSection } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/components/detail-section/detail-section";
import type { MovementDetailModalProps } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/types/movement-detail.types";
import { getStatusBadgeClass } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/utils/movements.utils";

export function MovementDetailModal({
  isOpen,
  movement,
  onClose,
}: MovementDetailModalProps) {
  const ducaNumbers =
    movement?.ducat_numbers?.filter(Boolean).join(", ") || "—";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle del movimiento"
      variant="info"
      size="2xl"
    >
      {movement ? (
        <div className="flex flex-col gap-4 sm:gap-5">
          <div className="max-h-[70vh] overflow-y-auto overflow-x-hidden p-1 sm:p-2 flex flex-col gap-4 sm:gap-5">
            <DetailSection
              title="Resumen"
              description="Estado actual y hora de ingreso del movimiento"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                <div className="flex  gap-3 sm:items-end sm:shrink-0">
                  <div className="min-w-0">
                    <p className="m-0! mb-1.5! text-xs capitalize tracking-wide text-slate-500 dark:text-slate-400">
                      Estado
                    </p>
                    <Badges
                      label={movement.status}
                      color="transparent"
                      className={getStatusBadgeClass(movement.status)}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="m-0! mb-1.5! text-xs capitalize tracking-wide text-slate-500 dark:text-slate-400">
                      Hora de ingreso
                    </p>
                    <p className="m-0! wrap-break-word text-sm font-medium text-slate-900 dark:text-white">
                      {movement.reception_start_time || "—"}
                    </p>
                  </div>
                </div>
              </div>
            </DetailSection>

            <DetailSection
              title="Identificación"
              description="Documentos y datos del vehículo"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailField label="Número DUCAT" value={ducaNumbers} />
                <DetailField
                  label="Placa cabezal"
                  value={movement.plate_number || "—"}
                />
              </div>
            </DetailSection>

            <DetailSection
              title="Personas / empresa"
              description="Conductor responsable y transportista"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailField
                  label="Conductor"
                  value={movement.driver_name || "—"}
                />
                <DetailField
                  label="Transportista"
                  value={movement.transportista || "—"}
                />
              </div>
            </DetailSection>
          </div>

          <div className="shrink-0 sticky bottom-0 z-10 bg-white dark:bg-[#272b34] flex justify-end pt-3 sm:pt-4 border-t border-slate-200 dark:border-neutral-600 -mx-1 px-1 sm:-mx-2 sm:px-2">
            <Button
              type="button"
              size="medium"
              label="Cerrar"
              ariaLabel="Cerrar detalle"
              onClick={onClose}
              className="w-full sm:w-auto text-[13px]! text-white! bg-slate-500! dark:bg-slate-700! hover:bg-slate-600! dark:hover:bg-slate-600!"
            />
          </div>
        </div>
      ) : (
        <div className="min-h-120px" />
      )}
    </Modal>
  );
}
