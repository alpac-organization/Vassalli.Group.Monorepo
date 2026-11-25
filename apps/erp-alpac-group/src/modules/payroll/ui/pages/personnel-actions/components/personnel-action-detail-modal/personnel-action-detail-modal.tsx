import { Badges, Banner, Button, Modal } from "@alpac/design-system";
import { getPersonnelActionScopeLabel } from "@app/modules/payroll/domain/enums/personnel-action-enums/personnel-action-scope.enum";
import {
  getPersonnelActionStatusBadgeColor,
  getPersonnelActionStatusLabel,
  isPersonnelActionApplied,
} from "@app/modules/payroll/domain/enums/personnel-action-enums/personnel-action-status.enum";
import {
  formatIncreaseValueDisplay,
  getSalaryIncreaseTypeBadgeColor,
  getSalaryIncreaseTypeLabel,
} from "@app/modules/payroll/domain/enums/personnel-action-enums/salary-increase-type.enum";
import {
  formatCurrency,
  resolveCurrencyCode,
} from "@app/shared/utils/currency.utils";
import { usePersonnelAction } from "@app/modules/payroll/ui/hooks/personnel-action/usePersonnelAction";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import { Loader } from "@app/shared/components/loaders/loader";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import {
  formatDateToSpanishWords,
  formatIdentificationNumber,
} from "@app/shared/utils/string.utils";
import dayjs from "dayjs";
import {
  Building2Icon,
  CalendarIcon,
  CheckCircle2Icon,
  ExternalLinkIcon,
  FileTextIcon,
  LayersIcon,
  NotebookTextIcon,
  TrendingUpIcon,
  UserCheckIcon,
  UserIcon,
} from "lucide-react";
import {
  actionCancelOutlineClassName,
  actionModalContentClassName,
  actionModalPanelClassName,
  sectionTitleClassName,
} from "../../utils/personnel-actions.constants";
import type { PersonnelActionDetailModalProps } from "./personnel-action-detail-modal.types";

export const PersonnelActionDetailModal = ({
  isOpen,
  onClose,
  requestId,
}: PersonnelActionDetailModalProps) => {
  const { companyId, moduleCode } = useUserStore();
  const { getMappedError } = useMappedError();

  const { GetPersonnelActionDetail } = usePersonnelAction({
    requestDetailFilters: {
      company_id: companyId,
      module_code: moduleCode,
      request_id: requestId ?? "",
    },
  });

  const detail = GetPersonnelActionDetail.data;
  const isLoading =
    GetPersonnelActionDetail.isLoading || GetPersonnelActionDetail.isFetching;
  const detailErrorDescription =
    GetPersonnelActionDetail.isError && GetPersonnelActionDetail.error
      ? getMappedError(GetPersonnelActionDetail.error).description
      : null;

  const increaseDisplay = detail
    ? formatIncreaseValueDisplay(detail.increase_type, detail.increase_value)
    : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      variant="default"
      size="7xl"
      title={`Detalle de Acción de Personal${detail?.request_code ? `: ${detail.request_code}` : ""}`}
      description="Consulta el desglose de cambios por colaborador y el estado del trámite"
      panelClassName={actionModalPanelClassName}
      contentClassName={actionModalContentClassName}
    >
      {isLoading && <Loader title="Cargando detalle de la acción de personal..." />}

      {detailErrorDescription && (
        <Banner
          variant="error"
          title="Error al cargar el detalle"
          description={detailErrorDescription}
        />
      )}

      {!isLoading && !detail && !detailErrorDescription ? (
        <p className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
          No se encontró la información solicitada.
        </p>
      ) : (
        detail && (
          <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4">
            <div className="scrollbar-dashboard min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain pr-1">
              <div className="flex flex-col gap-5 pb-2">
                {/* General Info */}
                <section className="flex flex-col gap-3">
                  <h4 className={sectionTitleClassName}>Información General</h4>
                  <div className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-2 lg:grid-cols-3">
                    <DetailField
                      label="Estado"
                      value={
                        <Badges
                          label={getPersonnelActionStatusLabel(detail.status)}
                          color="transparent"
                          className={getPersonnelActionStatusBadgeColor(detail.status)}
                        />
                      }
                    />
                    <DetailField
                      label="Alcance"
                      value={`${getPersonnelActionScopeLabel(detail.scope)} (${detail.total_collaborators} ${detail.total_collaborators === 1 ? "colaborador" : "colaboradores"})`}
                      icon={<LayersIcon size={18} />}
                    />
                    <DetailField
                      label="Tipo de Ajuste"
                      value={
                        <div className="flex flex-wrap items-center gap-2">
                          <Badges
                            label={getSalaryIncreaseTypeLabel(detail.increase_type)}
                            color="transparent"
                            className={getSalaryIncreaseTypeBadgeColor(
                              detail.increase_type,
                            )}
                          />
                          {increaseDisplay && (
                            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                              {increaseDisplay}
                            </span>
                          )}
                        </div>
                      }
                      icon={<TrendingUpIcon size={18} />}
                    />
                    {detail.area_name && (
                      <DetailField
                        label="Área Destino"
                        value={detail.area_name}
                        icon={<Building2Icon size={18} />}
                      />
                    )}
                    <DetailField
                      label="Fecha Efectiva"
                      value={
                        formatDateToSpanishWords(detail.effective_date?.slice(0, 10)) ||
                        "—"
                      }
                      icon={<CalendarIcon size={18} />}
                    />
                    <DetailField
                      label="Documento de Soporte"
                      icon={<FileTextIcon size={18} />}
                      value={
                        detail.attachment_url ? (
                          <a
                            href={detail.attachment_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-alpac-primary-600 hover:text-alpac-primary-700 dark:text-alpac-primary-400 dark:hover:text-alpac-primary-300 underline"
                          >
                            <ExternalLinkIcon size={14} />
                            Ver Petición Adjunta
                          </a>
                        ) : (
                          "Sin documento adjunto"
                        )
                      }
                    />
                  </div>
                  <div className="p-1">
                    <DetailField
                      label="Justificación y Motivo"
                      value={detail.justification}
                      icon={<NotebookTextIcon size={18} />}
                    />
                  </div>
                </section>

                {/* Audit Tracking */}
                <section className="flex flex-col gap-3">
                  <h4 className={sectionTitleClassName}>Trazabilidad y Aprobaciones</h4>
                  <div className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-3">
                    <DetailField
                      label="1. Solicitado Por"
                      value={detail.requested_by_user_name || "—"}
                      description={
                        detail.requested_at
                          ? dayjs(detail.requested_at).format("DD/MM/YYYY HH:mm")
                          : "—"
                      }
                      icon={<UserIcon size={18} />}
                    />
                    <DetailField
                      label="2. Revisión Gerencial"
                      value={
                        detail.reviewed_by_management_user_name || "Pendiente de revisión"
                      }
                      description={
                        detail.reviewed_by_management_at
                          ? `${dayjs(detail.reviewed_by_management_at).format("DD/MM/YYYY HH:mm")}${detail.management_notes ? ` — Nota: ${detail.management_notes}` : ""}`
                          : "—"
                      }
                      icon={<UserCheckIcon size={18} />}
                    />
                    <DetailField
                      label="3. Aplicado en Nómina"
                      value={detail.applied_by_user_name || "Pendiente de aplicación"}
                      description={
                        detail.applied_at
                          ? dayjs(detail.applied_at).format("DD/MM/YYYY HH:mm")
                          : "—"
                      }
                      icon={<CheckCircle2Icon size={18} />}
                    />
                  </div>
                </section>

                {/* Before vs After Comparison Table */}
                <section className="flex flex-col gap-3">
                  <h4 className={sectionTitleClassName}>
                    Comparativa de Condiciones (Antes vs Después)
                  </h4>

                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-neutral-700">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 dark:bg-[#363a45] text-slate-700 dark:text-slate-200 font-semibold uppercase tracking-wider">
                        <tr>
                          <th className="p-3">Colaborador</th>
                          <th className="p-3">Salario Actual</th>
                          <th className="p-3">Salario Propuesto</th>
                          <th className="p-3">Cargo Anterior / Nuevo</th>
                          <th className="p-3">Centro Costo Anterior / Nuevo</th>
                          <th className="p-3 text-center">Memorándum Oficial</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-neutral-700 bg-white dark:bg-[#272b34]">
                        {(detail.items ?? []).map((item) => {
                          const salaryChanged =
                            item.proposed_salary !== null &&
                            item.proposed_salary !== undefined &&
                            item.proposed_salary !== item.current_salary;
                          const diffSalary = salaryChanged
                            ? (item.proposed_salary ?? 0) - item.current_salary
                            : 0;

                          return (
                            <tr
                              key={item.item_id}
                              className="hover:bg-slate-50 dark:hover:bg-neutral-800/40"
                            >
                              <td className="p-3 font-medium text-slate-900 dark:text-white">
                                <div>{item.collaborator_full_name}</div>
                                <div className="text-[11px] text-slate-400">
                                  Cédula:{" "}
                                  {formatIdentificationNumber(item.identification_number) ||
                                    item.identification_number}{" "}
                                  | Código: {item.collaborator_code}
                                </div>
                              </td>

                              <td className="p-3 text-slate-700 dark:text-slate-300">
                                {formatCurrency(
                                  item.current_salary ?? 0,
                                  resolveCurrencyCode(item.current_currency),
                                )}
                              </td>

                              <td className="p-3">
                                {salaryChanged ? (
                                  <div className="flex flex-col">
                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                      {formatCurrency(
                                        item.proposed_salary,
                                        resolveCurrencyCode(item.proposed_currency),
                                      )}
                                    </span>
                                    {diffSalary > 0 && (
                                      <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-medium">
                                        +{formatCurrency(
                                          diffSalary,
                                          resolveCurrencyCode(item.current_currency),
                                        )}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-slate-400">Sin variación</span>
                                )}
                              </td>

                              <td className="p-3">
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-slate-400 text-[11px]">
                                    Actual: {item.current_job_position_name || "—"}
                                  </span>
                                  {item.proposed_job_position_name ? (
                                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                                      Nuevo: {item.proposed_job_position_name}
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 text-[11px]">
                                      Sin cambio
                                    </span>
                                  )}
                                </div>
                              </td>

                              <td className="p-3">
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-slate-400 text-[11px]">
                                    Actual: {item.current_cost_center_name || "—"}
                                  </span>
                                  {item.proposed_cost_center_name ? (
                                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                                      Nuevo: {item.proposed_cost_center_name}
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 text-[11px]">
                                      Sin cambio
                                    </span>
                                  )}
                                </div>
                              </td>

                              <td className="p-3 text-center">
                                {item.memorandum_url ? (
                                  <a
                                    href={item.memorandum_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all"
                                  >
                                    <ExternalLinkIcon size={13} />
                                    Ver Memo PDF
                                  </a>
                                ) : (
                                  <span className="text-slate-400 text-[11px]">
                                    {isPersonnelActionApplied(detail.status)
                                      ? "Generando..."
                                      : "Se genera al aplicar"}
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            </div>

            <div className="-mx-4 -mb-4 mt-0 shrink-0 border-t border-t-slate-300 bg-white px-4 py-4 dark:border-t-neutral-600 dark:bg-[#272b34] sm:-mx-6 sm:-mb-6 sm:px-6 rounded-b-xl">
              <div className="flex justify-end">
                <Button
                  type="button"
                  label="Cerrar"
                  size="giant"
                  className={`${actionCancelOutlineClassName} w-full min-w-0 sm:w-auto`}
                  onClick={onClose}
                />
              </div>
            </div>
          </div>
        )
      )}
    </Modal>
  );
};
