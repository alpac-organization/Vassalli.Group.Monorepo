import { Avatar, Badges, Button, Modal } from "@alpac/design-system";
import {
  getAbsenceSourceLabel,
  getAbsenceStatusLabel,
} from "@app/modules/payroll/domain/enums/absence-enums/absence.enum";
import type { AbsenceDetailsModalProps } from "@app/modules/payroll/ui/pages/disciplinary-management/components/absence-details-modal/absence-details-modal.types";
import {
  disciplinaryApproveButtonClassName,
  disciplinaryRejectButtonClassName,
} from "@app/modules/payroll/ui/pages/disciplinary-management/utils/disciplinary-form.constants";
import {
  getAbsenceSourceBadgeClass,
  getAbsenceStatusBadgeClass,
} from "@app/modules/payroll/ui/pages/disciplinary-management/utils/disciplinary-labels.utils";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import { Loader } from "@app/shared/components/loaders/loader";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import {
  BanIcon,
  Building2Icon,
  CalendarIcon,
  CheckIcon,
  DollarSignIcon,
  HashIcon,
  IdCardIcon,
  NotebookTextIcon,
} from "lucide-react";

const sectionTitleClassName =
  "m-0 pb-2 text-xs font-bold tracking-wider text-slate-500 dark:text-slate-200 border-b border-slate-200 dark:border-neutral-600";

export const AbsenceDetailsModal = ({
  isOpen,
  onClose,
  summary,
  detail,
  isDetailLoading = false,
  canWrite = false,
  onApply,
  onCancel,
}: AbsenceDetailsModalProps) => {
  const view = detail ?? summary;
  const isPending =
    view?.status === "Pending" ||
    String(view?.status) === "1" ||
    view?.status === 1;

  const isCancelled =
    view?.status === "Cancelled" ||
    String(view?.status) === "3" ||
    view?.status === 3;

  const showFooter = Boolean(canWrite && !isCancelled);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      variant="default"
      title="Detalle de la inasistencia"
      size="6xl"
      panelClassName={[
        "flex max-h-[min(94dvh,50rem)] flex-col overflow-hidden",
        "!mx-2 !my-2 sm:!mx-4 sm:!my-6",
        "rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
      ].join(" ")}
      contentClassName="flex min-h-0 flex-1 flex-col"
    >
      {isDetailLoading && <Loader title="Cargando detalle de la inasistencia..." />}

      {!view ? (
        <p className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Selecciona una inasistencia para ver el detalle.
        </p>
      ) : (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="scrollbar-dashboard min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
            <div className="flex flex-col gap-5 pb-2">
              <section className="flex flex-col gap-3">
                <h4 className={sectionTitleClassName}>Colaborador</h4>
                <div className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-2 lg:grid-cols-4">
                  <DetailField
                    label="Nombre"
                    value={view.fullname ?? ""}
                    icon={
                      <Avatar
                        label={view.fullname ?? ""}
                        hasLabel={false}
                      />
                    }
                  />
                  <DetailField
                    label="Identificación"
                    value={view.identification_number ?? ""}
                    icon={<IdCardIcon size={18} />}
                  />
                  <DetailField
                    label="Código de empleado"
                    value={detail?.collaborator_code || "—"}
                    icon={<HashIcon size={18} />}
                  />
                  <DetailField
                    label="Sucursal"
                    value={view.branch_name || "—"}
                    icon={<Building2Icon size={18} />}
                  />
                </div>
              </section>

              <section className="flex flex-col gap-3">
                <h4 className={sectionTitleClassName}>
                  Información de la inasistencia
                </h4>
                <div className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-2 lg:grid-cols-3">
                  <DetailField
                    label="Estado"
                    value={
                      <Badges
                        label={getAbsenceStatusLabel(view.status)}
                        color="transparent"
                        className={getAbsenceStatusBadgeClass(view.status)}
                      />
                    }
                  />
                  <DetailField
                    label="Origen"
                    value={
                      <Badges
                        label={getAbsenceSourceLabel(view.source)}
                        color="transparent"
                        className={getAbsenceSourceBadgeClass(view.source)}
                      />
                    }
                  />
                  <DetailField
                    label="Fecha de inasistencia"
                    value={formatDateToSpanishWords(view.date ?? "")}
                    icon={<CalendarIcon size={18} />}
                  />
                  {detail?.created_at && (
                    <DetailField
                      label="Fecha de registro"
                      value={formatDateToSpanishWords(detail.created_at)}
                      icon={<CalendarIcon size={18} />}
                    />
                  )}
                  <div className="sm:col-span-2 lg:col-span-3">
                    <DetailField
                      label="Motivo"
                      value={detail?.reason || "Sin motivo registrado."}
                      icon={<NotebookTextIcon size={18} />}
                    />
                  </div>
                </div>
              </section>

              <section className="flex flex-col gap-3">
                <h4 className={sectionTitleClassName}>
                  Deducciones de Nómina
                </h4>
                <div className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-2 lg:grid-cols-4">
                  <DetailField
                    label="Salario Ordinario Diario"
                    value={`C$ ${(detail?.salary_deduction ?? 0).toFixed(2)}`}
                    icon={<DollarSignIcon size={18} />}
                  />
                  <DetailField
                    label="Deducción Séptimo Día"
                    value={`C$ ${(detail?.seventh_day_deduction ?? 0).toFixed(2)}`}
                    icon={<DollarSignIcon size={18} />}
                  />
                  <DetailField
                    label="Deducción Viáticos Diarios"
                    value={`C$ ${(detail?.travel_expenses_deduction ?? 0).toFixed(2)}`}
                    icon={<DollarSignIcon size={18} />}
                  />
                  <DetailField
                    label="Total a Descontar"
                    value={`C$ ${(detail?.total_deduction ?? 0).toFixed(2)}`}
                    icon={<DollarSignIcon size={18} className="text-emerald-500" />}
                  />
                </div>
              </section>

              <section className="flex flex-col gap-3">
                <h4 className={sectionTitleClassName}>
                  Auditoria y seguimiento de la inasistencia
                </h4>
                <div className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-2 lg:grid-cols-3">
                  <DetailField
                    label="Fecha de revisión"
                    value={
                      detail?.reviewed_at
                        ? formatDateToSpanishWords(detail.reviewed_at)
                        : "Pendiente"
                    }
                    icon={<CalendarIcon size={18} />}
                  />
                  {detail?.cancellation_reason && (
                    <div className="sm:col-span-2 lg:col-span-3">
                      <DetailField
                        label="Motivo de cancelación"
                        value={detail.cancellation_reason}
                        icon={<BanIcon size={18} className="text-rose-500" />}
                      />
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>

          {showFooter && (
            <div className="-mx-4 -mb-4 mt-0 shrink-0 border-t border-t-slate-300 bg-white px-4 py-4 dark:border-t-neutral-600 dark:bg-[#272b34] sm:-mx-6 sm:-mb-6 sm:px-6 rounded-b-xl">
              <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end sm:gap-3">
                <Button
                  type="button"
                  label="Cancelar inasistencia"
                  className={`${disciplinaryRejectButtonClassName} w-full min-w-0 sm:w-auto`}
                  icon={<BanIcon size={20} />}
                  onClick={onCancel}
                />
                {isPending && (
                  <Button
                    type="button"
                    label="Aplicar inasistencia"
                    className={`${disciplinaryApproveButtonClassName} w-full min-w-0 sm:w-auto`}
                    icon={<CheckIcon size={20} />}
                    onClick={onApply}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};
