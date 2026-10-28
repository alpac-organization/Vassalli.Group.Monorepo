import { Badges, Modal, Spinner } from "@alpac/design-system";
import {
  getSanctionStatusBadgeClass,
  getSanctionStatusLabel,
  getSanctionTypeLabel,
} from "@app/modules/payroll/ui/pages/disciplinary-management/utils/disciplinary-labels.utils";
import type { SanctionDetailsModalProps } from "@app/modules/payroll/ui/pages/disciplinary-management/components/sanction-details-modal/sanction-details-modal.types";

export const SanctionDetailsModal = ({
  isOpen,
  onClose,
  summary,
  detail,
  isDetailLoading = false,
}: SanctionDetailsModalProps) => {
  const view = detail ?? summary;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      variant="default"
      title="Detalle de la sanción"
      panelClassName={[
        "!max-w-2xl w-[min(calc(100vw-1rem),42rem)] min-w-0",
        "max-h-[min(94dvh,46rem)] overflow-y-auto overflow-x-hidden overscroll-contain scrollbar-dashboard",
        "!mx-2 !my-2 sm:!mx-4 sm:!my-6",
        "rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
      ].join(" ")}
    >
      {!view ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Selecciona una sanción para ver el detalle.
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
                {getSanctionTypeLabel(view.sanction_type)}
              </p>
              {"identification_number" in view && view.identification_number && (
                <p className="mt-0.5 text-[13px] text-slate-500 dark:text-slate-400">
                  Identificación: {view.identification_number}
                </p>
              )}
            </div>
            <Badges
              label={getSanctionStatusLabel(view.sanction_status)}
              color="transparent"
              className={`shrink-0 ${getSanctionStatusBadgeClass(view.sanction_status)}`}
            />
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-neutral-700 dark:bg-[#1e2229]">
            <p className="mb-0.5 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Motivo
            </p>
            <p className="m-0 text-sm text-slate-800 dark:text-slate-200">
              {view.reason?.trim() || "—"}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DetailField
              label="Inicio suspensión"
              value={view.suspension_start_date || "—"}
            />
            <DetailField
              label="Fin suspensión"
              value={view.suspension_end_date || "—"}
            />
            <DetailField
              label="Registrada"
              value={view.created_at?.slice(0, 10) || "—"}
            />
            <DetailField label="ID sanción" value={view.sanction_id || "—"} />
            {detail?.payroll_id && (
              <DetailField label="Nómina" value={detail.payroll_id} />
            )}
            {detail?.issued_by_user && (
              <DetailField
                label="Emitida por"
                value={
                  detail.issued_by_user.full_name ||
                  detail.issued_by_user.email ||
                  detail.issued_by
                }
              />
            )}
          </div>

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
