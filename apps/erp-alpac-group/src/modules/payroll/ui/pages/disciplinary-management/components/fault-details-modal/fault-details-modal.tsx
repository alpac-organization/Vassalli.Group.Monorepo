import { Badges, Button, Modal, Spinner } from "@alpac/design-system";
import {
  getFaultSeverityLabel,
  getFaultSourceLabel,
  getFaultStatusBadgeClass,
  getFaultStatusLabel,
} from "@app/modules/payroll/ui/pages/disciplinary-management/utils/disciplinary-labels.utils";
import type { FaultDetailsModalProps } from "@app/modules/payroll/ui/pages/disciplinary-management/components/fault-details-modal/fault-details-modal.types";

export const FaultDetailsModal = ({
  isOpen,
  onClose,
  summary,
  detail,
  isDetailLoading = false,
  canWrite = false,
  onCancelFault,
  onApplySanction,
}: FaultDetailsModalProps) => {
  const view = detail ?? summary;
  const isOpenStatus =
    view?.status === "Open" || String(view?.status) === "1";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      variant="default"
      title="Detalle de la falta"
      panelClassName={[
        "!max-w-2xl w-[min(calc(100vw-1rem),42rem)] min-w-0",
        "max-h-[min(94dvh,46rem)] overflow-y-auto overflow-x-hidden overscroll-contain scrollbar-dashboard",
        "!mx-2 !my-2 sm:!mx-4 sm:!my-6",
        "rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
      ].join(" ")}
    >
      {!view ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Selecciona una falta para ver el detalle.
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {isDetailLoading && (
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Spinner />
              Cargando detalle...
            </div>
          )}

          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="wrap-break-word text-xl font-bold leading-snug text-slate-900 dark:text-white">
                {view.collaborator_name || "—"}
              </p>
              <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">
                {view.fault_catalog?.code
                  ? `${view.fault_catalog.code} — ${view.fault_catalog.name}`
                  : "Sin catálogo"}
              </p>
              {"identification_number" in view && view.identification_number && (
                <p className="mt-0.5 text-[13px] text-slate-500 dark:text-slate-400">
                  Identificación: {view.identification_number}
                </p>
              )}
            </div>
            <Badges
              label={getFaultStatusLabel(view.status)}
              color="transparent"
              className={`shrink-0 ${getFaultStatusBadgeClass(view.status)}`}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DetailField label="Fecha" value={view.occurrence_date || "—"} />
            <DetailField
              label="Severidad"
              value={getFaultSeverityLabel(view.severity)}
            />
            <DetailField
              label="Origen"
              value={getFaultSourceLabel(view.source)}
            />
            <DetailField label="ID falta" value={view.fault_id || "—"} />
          </div>

          {detail?.parent_fault && (
            <div className="rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-neutral-700 dark:bg-[#1e2229]">
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Falta padre (reincidencia)
              </p>
              <p className="m-0 text-sm text-slate-800 dark:text-slate-200">
                {detail.parent_fault.fault_id} —{" "}
                {getFaultSeverityLabel(detail.parent_fault.severity)} —{" "}
                {getFaultStatusLabel(detail.parent_fault.status)}
              </p>
            </div>
          )}

          {detail?.registered_by && (
            <DetailField
              label="Registrado por"
              value={
                detail.registered_by.full_name ||
                detail.registered_by.email ||
                detail.registered_by.user_id
              }
            />
          )}

          <div className="rounded-lg border border-slate-200 px-4 py-3 dark:border-neutral-700">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Evidencias
            </p>
            {detail?.evidences && detail.evidences.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {detail.evidences.map((evidence, index) =>
                  evidence.image_url ? (
                    <a
                      key={`${evidence.file_name}-${index}`}
                      href={evidence.image_url}
                      target="_blank"
                      rel="noreferrer"
                      className="block overflow-hidden rounded-md border border-slate-200 dark:border-neutral-600"
                    >
                      <img
                        src={evidence.image_url}
                        alt={evidence.file_name ?? `evidencia-${index}`}
                        className="h-24 w-24 object-cover"
                      />
                    </a>
                  ) : (
                    <span
                      key={`${evidence.file_name}-${index}`}
                      className="text-sm text-slate-500"
                    >
                      {evidence.file_name ?? "Sin URL"}
                    </span>
                  ),
                )}
              </div>
            ) : (
              <p className="m-0 text-sm text-slate-500 dark:text-slate-400">
                Sin evidencias
              </p>
            )}
          </div>

          {canWrite && isOpenStatus && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button
                type="button"
                size="giant"
                label="Anular falta"
                className="w-full! rounded-md! bg-rose-600! text-[15px]! text-white! dark:bg-rose-700!"
                onClick={onCancelFault}
              />
              <Button
                type="button"
                size="giant"
                label="Aplicar sanción"
                className="w-full! rounded-md! bg-alpac-primary-500! text-[15px]! text-white! dark:bg-alpac-primary-700!"
                onClick={onApplySanction}
              />
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

const DetailField = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2 dark:border-neutral-700 dark:bg-[#1e2229]">
    <p className="mb-0.5 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
      {label}
    </p>
    <p className="m-0 text-sm text-slate-800 dark:text-slate-200">{value}</p>
  </div>
);
