import { useEffect, useMemo, useState } from "react";
import { Badges, Button, Modal, type DatePickerValue, type TimePickerValue } from "@alpac/design-system";
import { X } from "lucide-react";
import type { MerchandiseDucatDetailDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/merchandise/get-merchandise-detail";
import {
  getDucaStatusBadgeClass,
  getDucaStatusBadgeLabel,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-detail-modal/components/ducat-detail-modal/utils/duca-status";
import { ObservationDetailModal } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-detail-modal/components/observation-detail-modal/observation-detail-modal";
import { ReadOnlyField } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-detail-modal/components/read-only-field/read-only-field";
import { mapDucatToDisplay } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-detail-modal/utils/map-merchandise-detail";
import {
  fieldsGridClasses,
  mobileOnlyScrollClasses,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/variants/global-variants";
import { type ViewingTextField } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-detail-modal/components/ducat-detail-modal/utils/style.eye";
import { FieldWithEye } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-detail-modal/components/ducat-detail-modal/field-eye";
import { RegisterDucatDetailForm } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-detail-modal/components/register-ducat-detail-form/register-ducat-detail-form";

type DucatDetailModalProps = {
  isOpen: boolean;
  ducat: MerchandiseDucatDetailDto | null;
  receptionId: string;
  companyId: string;
  moduleCode: string;
  initialStartDate: DatePickerValue | null;
  initialStartTime: TimePickerValue | null;
  onClose: () => void;
};

export function DucatDetailModal({
  isOpen,
  ducat,
  receptionId,
  companyId,
  moduleCode,
  initialStartDate,
  initialStartTime,
  onClose,
}: DucatDetailModalProps) {
  const [viewingTextField, setViewingTextField] =
    useState<ViewingTextField>(null);

  const values = useMemo(
    () => (ducat ? mapDucatToDisplay(ducat) : null),
    [ducat],
  );

  const statusLabel = ducat ? getDucaStatusBadgeLabel(ducat.status ?? "") : "";
  const statusClass = ducat ? getDucaStatusBadgeClass(ducat.status ?? "") : "";

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (!isOpen) {
      setViewingTextField(null);
    }
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (viewingTextField) return;
      event.stopImmediatePropagation();
      onClose();
    };

    window.addEventListener("keydown", handleEscape, true);
    return () => window.removeEventListener("keydown", handleEscape, true);
  }, [isOpen, onClose, viewingTextField]);

  const viewingText =
    viewingTextField === "description"
      ? {
          title: "Descripción del producto",
          emptyMessage: "Descripción no registrada",
          value: values?.productDescription ?? "",
        }
      : viewingTextField === "destination"
        ? {
            title: "Observación área destino",
            emptyMessage: "Observación no registrada",
            value: values?.destinationAreaObservation ?? "",
          }
        : null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Detalle específico de Duca"
        variant="info"
        size="4xl"
        panelClassName="max-md:max-h-[min(92dvh,56rem)]! md:max-h-none! flex! flex-col! max-md:overflow-hidden! md:overflow-visible! p-4! sm:p-6!"
      >
        {!values ? null : (
          <div className="flex flex-col flex-1 min-h-0 gap-4 max-md:overflow-hidden md:overflow-visible">
            <div className={`flex-1 min-h-0 ${mobileOnlyScrollClasses}`}>
              <div className="flex w-full flex-wrap items-center justify-between gap-2 mb-4 sm:mb-5">
                <Badges
                  label={`DUCA: ${values.ducatNumber}`}
                  color="transparent"
                  className="bg-blue-50! dark:bg-blue-500/10! text-blue-700! dark:text-blue-300! border! border-blue-200! dark:border-blue-500/30!"
                />
                <Badges
                  label={statusLabel}
                  color="transparent"
                  className={statusClass}
                />
              </div>

              {ducat && !ducat.merchandise_id ? (
                <RegisterDucatDetailForm
                  reception_id={receptionId}
                  ducat_id={ducat.id}
                  company_id={companyId}
                  module_code={moduleCode}
                  ducatNumber={values.ducatNumber}
                  initialStartDate={initialStartDate}
                  initialStartTime={initialStartTime}
                />
              ) : (
              <div className={`min-w-0 pt-1 sm:pt-2 ${fieldsGridClasses}`}>
                <ReadOnlyField
                  label="Número DUCA"
                  value={values.ducatNumber}
                  missingMessage="DUCA no registrada"
                />
                <ReadOnlyField
                  label="Mercancía"
                  value={values.merchandiseName}
                  missingMessage="Mercancía no registrada"
                />
                <ReadOnlyField
                  label="Total bultos"
                  value={values.totalBultos}
                  missingMessage="Bultos no registrados"
                />
                <ReadOnlyField
                  label="Peso total"
                  value={values.totalWeight}
                  missingMessage="Peso no registrado"
                />
                <FieldWithEye
                  label="Descripción del producto"
                  value={values.productDescription}
                  missingMessage="Descripción no registrada"
                  ariaLabel="Ver descripción del producto"
                  onView={() => setViewingTextField("description")}
                />
                <ReadOnlyField
                  label="Remitente"
                  value={values.remitente}
                  missingMessage="Remitente no registrado"
                />
                <FieldWithEye
                  label="Observación área destino"
                  value={values.destinationAreaObservation}
                  missingMessage="Observación no registrada"
                  ariaLabel="Ver observación área destino"
                  onView={() => setViewingTextField("destination")}
                />
                <ReadOnlyField
                  label="Orden de servicio"
                  value={values.serviceOrderCode}
                  missingMessage="Orden no registrada"
                />
                <ReadOnlyField
                  label="Registrado por"
                  value={values.registeredByUserName}
                  missingMessage="Responsable no registrado"
                />
                <ReadOnlyField
                  label="Fecha inicio"
                  value={values.registeredStartDate}
                  missingMessage="Fecha no registrada"
                />
                <ReadOnlyField
                  label="Hora inicio"
                  value={values.registeredStartTime}
                  missingMessage="Hora no registrada"
                />
                <ReadOnlyField
                  label="Hora fin"
                  value={values.registeredEndTime}
                  missingMessage="Hora no registrada"
                />
                <ReadOnlyField
                  label="Duración"
                  value={values.durationFormatted}
                  missingMessage="Duración no registrada"
                />
                <ReadOnlyField
                  label="Actualizado por"
                  value={values.updatedByUserName}
                  missingMessage="No registrado"
                />
                <ReadOnlyField
                  label="Fecha de actualización"
                  value={values.updatedDate}
                  missingMessage="No registrado"
                />
                <ReadOnlyField
                  label="Hora de actualización"
                  value={values.updatedTime}
                  missingMessage="No registrado"
                />
              </div>
              )}
            </div>

            <div className="shrink-0 flex justify-end pt-3 border-t border-slate-200 dark:border-neutral-600">
              <Button
                type="button"
                size="medium"
                label="Cerrar"
                icon={<X size={16} />}
                ariaLabel="Cerrar detalle de DUCA"
                onClick={onClose}
                className="w-full sm:w-auto text-[13px]! text-white! bg-slate-500! dark:bg-slate-700! hover:bg-slate-600! dark:hover:bg-slate-600!"
              />
            </div>
          </div>
        )}
      </Modal>

      <ObservationDetailModal
        isOpen={Boolean(viewingText)}
        observation={viewingText?.value ?? ""}
        title={viewingText?.title}
        emptyMessage={viewingText?.emptyMessage}
        onClose={() => setViewingTextField(null)}
      />
    </>
  );
}

