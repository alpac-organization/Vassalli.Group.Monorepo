import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, LazyMotion, m } from "framer-motion";
import {
  Modal,
  Spinner,
  Badges,
  Alert,
  AnimatedAlertWrapper,
  Button,
} from "@alpac/design-system";
import {
  User,
  Briefcase,
  MapPin,
  Hash,
  Calendar,
  FileText,
  Eye,
  ArrowLeft,
  DollarSign,
  CreditCard,
  Receipt,
  EyeOff,
  ClipboardList,
} from "lucide-react";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useDeduction } from "@app/modules/payroll/ui/hooks/deduction/useDeduction";
import {
  getDeductionStatusBadgeColor,
  getDeductionStatusLabel,
} from "@app/modules/payroll/domain/enums/deduction-enums/deduction-status.enum";
import { getDeductionTypeLabel } from "@app/modules/payroll/domain/enums/deduction-enums/deduction-type.enum";
import {
  getDeductionPaymentStatusBadgeColor,
  getDeductionPaymentStatusLabel,
} from "@app/modules/payroll/domain/enums/deduction-enums/deduction-payment-status.enum";
import { getDeductionPaymentOriginLabel } from "@app/modules/payroll/domain/enums/deduction-enums/deduction-payment-origin.enum";
import {
  formatIdentificationNumber,
  formatDate,
  formatDateToSpanishWords,
} from "@app/shared/utils/string.utils";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import type { DeductionDetailsDto } from "@app/modules/payroll/domain/ApiContract/Responses/deduction-responses/get-deduction-details.response";
import type { DeductionPaymentsDto } from "@app/modules/payroll/domain/ApiContract/Responses/deduction-responses/get-deduction-payments.response";
import type {
  GetPaymentTravelExpensesResponse,
  GetPayrollReportsVacationAccrualResponse,
} from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-reports";
import { usePayrollReports } from "@app/modules/payroll/ui/hooks/payroll/usePayrollReports";
import { usePermission } from "@app/modules/payroll/ui/hooks/permission/usePermission";
import type { PermissionType } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/create-permission-request";
import type {
  PermissionResponse,
  StepStatus,
} from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/permission-history-response";
import { PERMISSION_TYPE_LABEL } from "@app/modules/payroll/ui/pages/permissions/constants/permission-filters.constants";
import { getPermissionStatusUiLabel } from "@app/modules/payroll/ui/pages/permissions/constants/vacation-status.constants";
import { statusBadgeColor } from "@app/modules/payroll/ui/pages/permissions/components/permission-table/utils/statusBadgeColor";
import type { ModalDetailsPayrollProps } from "@app/modules/payroll/ui/pages/nomina/components/collaborator-details-payroll/types/modal-details-payroll.types";

type DeductionView = "list" | "detail" | "payments";

const DETAIL_ACTION_BUTTON_CLASS =
  "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold text-white bg-alpac-primary-500 dark:bg-alpac-primary-700 transition-opacity hover:opacity-90";

const CLOSE_BUTTON_CLASS =
  "inline-flex items-center justify-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-slate-200 dark:hover:bg-neutral-700";

const deductionViewTransition = {
  opacity: { duration: 0.3, ease: "easeOut" as const },
  x: { duration: 0.3, ease: "easeInOut" as const },
};

const loadMotionFeatures = () =>
  import("framer-motion").then((res) => res.domAnimation);

export function ModalDetailsPayroll({
  isOpen,
  onClose,
  payrollItem,
  payrollId,
  payrollType,
  onEditDeductions,
}: ModalDetailsPayrollProps): React.ReactNode {
  const collaborator = payrollItem?.collaborator ?? null;
  const { companyId, moduleCode } = useUserStore();
  const { useGetDeductions, useGetDeductionDetails, useGetDeductionPayments } =
    useDeduction();

  const [deductionView, setDeductionView] = useState<DeductionView>("list");
  const [viewDirection, setViewDirection] = useState<"forward" | "back">(
    "forward",
  );
  const [selectedDeductionId, setSelectedDeductionId] = useState<string | null>(
    null,
  );
  const [listErrorOpen, setListErrorOpen] = useState(false);
  const [detailErrorOpen, setDetailErrorOpen] = useState(false);
  const [paymentsErrorOpen, setPaymentsErrorOpen] = useState(false);
  const [vacationReportErrorOpen, setVacationReportErrorOpen] = useState(false);
  const [travelExpensesReportErrorOpen, setTravelExpensesReportErrorOpen] =
    useState(false);
  const [permissionsReportErrorOpen, setPermissionsReportErrorOpen] =
    useState(false);

  const {
    data: listData,
    isLoading: isListLoading,
    isError: isListError,
  } = useGetDeductions(
    {
      companie_id: companyId,
      module_code: moduleCode,
      identification_number: collaborator?.identification_number,
      status: "Progress",
    },
    {
      enabled:
        isOpen &&
        !!companyId &&
        !!moduleCode &&
        !!collaborator?.identification_number,
    },
  );

  const {
    data: detailData,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useGetDeductionDetails(
    {
      companie_id: companyId,
      module_code: moduleCode,
      deduction_id: selectedDeductionId ?? "",
      identification_number: collaborator?.identification_number,
    },
    {
      enabled:
        !!selectedDeductionId &&
        !!companyId &&
        !!moduleCode &&
        deductionView !== "list",
    },
  );

  const {
    data: vacationReportsData,
    isLoading: isVacationReportLoading,
    isError: isVacationReportError,
  } = usePayrollReports({
    payload: {
      companie_id: companyId,
      module_code: moduleCode,
      payroll_id: payrollId ?? "",
      payroll_type: payrollType ?? "None",
      report_type: "VacationAccrual",
      identification_number: collaborator?.identification_number,
    },
    enabled:
      isOpen &&
      deductionView === "list" &&
      !!companyId &&
      !!moduleCode &&
      !!payrollId &&
      !!collaborator?.identification_number,
  });

  const {
    data: travelExpensesReportsData,
    isLoading: isTravelExpensesLoading,
    isError: isTravelExpensesError,
  } = usePayrollReports({
    payload: {
      companie_id: companyId,
      module_code: moduleCode,
      payroll_id: payrollId ?? "",
      payroll_type: payrollType ?? "None",
      report_type: "TravelExpenses",
      identification_number: collaborator?.identification_number,
    },
    enabled:
      isOpen &&
      deductionView === "list" &&
      !!companyId &&
      !!moduleCode &&
      !!payrollId &&
      !!collaborator?.identification_number,
  });

  const permissionFilters = useMemo(() => {
    if (
      !isOpen ||
      deductionView !== "list" ||
      !companyId ||
      !moduleCode ||
      !collaborator?.identification_number
    ) {
      return undefined;
    }
    return {
      companie_id: companyId,
      module_code: moduleCode,
      identification_number: collaborator.identification_number,
      payroll_id: payrollId ?? "",
      page_size: 10,
      page_number: 1,
    };
  }, [
    isOpen,
    deductionView,
    companyId,
    moduleCode,
    collaborator?.identification_number,
  ]);

  const { GetPermissionHistory } = usePermission(permissionFilters);

  const {
    data: paymentsData,
    isLoading: isPaymentsLoading,
    isError: isPaymentsError,
  } = useGetDeductionPayments(
    {
      companie_id: companyId,
      module_code: moduleCode,
      deduction_id: selectedDeductionId ?? "",
      page_number: 1,
      page_size: 10,
    },
    {
      enabled:
        deductionView === "payments" &&
        !!selectedDeductionId &&
        !!companyId &&
        !!moduleCode,
    },
  );

  useEffect(() => {
    if (isListError) setListErrorOpen(true);
  }, [isListError]);

  useEffect(() => {
    if (isDetailError) setDetailErrorOpen(true);
  }, [isDetailError]);

  useEffect(() => {
    if (isPaymentsError) setPaymentsErrorOpen(true);
  }, [isPaymentsError]);

  useEffect(() => {
    if (isVacationReportError) setVacationReportErrorOpen(true);
  }, [isVacationReportError]);

  useEffect(() => {
    if (isTravelExpensesError) setTravelExpensesReportErrorOpen(true);
  }, [isTravelExpensesError]);

  useEffect(() => {
    if (GetPermissionHistory.isError) setPermissionsReportErrorOpen(true);
  }, [GetPermissionHistory.isError]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedDeductionId(null);
      setDeductionView("list");
      setViewDirection("forward");
    }
  }, [isOpen]);

  const deductions = listData?.data ?? [];
  const payments = paymentsData?.data ?? [];
  const vacationHistory = vacationReportsData?.vacation_accruals_history ?? [];
  const travelExpensesHistory =
    travelExpensesReportsData?.payment_travel_expenses ?? [];
  const vacationData =
    vacationHistory.find(
      (item) => item.collaborator_code === collaborator?.collaborator_code,
    ) ??
    vacationHistory[0] ??
    null;
  const travelExpensesData =
    travelExpensesHistory.find(
      (item) =>
        (item.collaborator_code &&
          item.collaborator_code === collaborator?.collaborator_code) ||
        item.collaborator_fullname === collaborator?.full_name,
    ) ??
    travelExpensesHistory[0] ??
    null;
  const permissions = GetPermissionHistory.data?.data ?? [];
  const permissionsTotal =
    GetPermissionHistory.data?.total ?? permissions.length;

  const formattedIdentification = (() => {
    const id = collaborator?.identification_number;
    if (!id) return "—";
    if (id.length !== 14) return id;
    return formatIdentificationNumber(id);
  })();

  const selectedDeduction = deductions.find(
    (d) => d.deduction_id === selectedDeductionId,
  );

  const handleBack = () => {
    setViewDirection("back");
    if (deductionView === "payments") {
      setDeductionView("detail");
      return;
    }
    if (deductionView === "detail") {
      setDeductionView("list");
      setSelectedDeductionId(null);
    }
  };

  const goToDetail = (deductionId: string) => {
    setViewDirection("forward");
    setSelectedDeductionId(deductionId);
    setDeductionView("detail");
  };

  const goToPayments = () => {
    setViewDirection("forward");
    setDeductionView("payments");
  };

  const sectionTitle = (() => {
    if (deductionView === "payments") return "Pagos realizados";
    if (deductionView === "detail" && selectedDeduction) {
      return getDeductionTypeLabel(selectedDeduction.type);
    }
    return "Deducciones Activas";
  })();

  return (
    <>
      <AnimatedAlertWrapper open={listErrorOpen}>
        <Alert
          type="error"
          title="Error al cargar deducciones"
          message="No se pudo obtener la lista de deducciones. Intente nuevamente."
          showCloseButton
          onClose={() => setListErrorOpen(false)}
        />
      </AnimatedAlertWrapper>

      <AnimatedAlertWrapper open={detailErrorOpen}>
        <Alert
          type="error"
          title="Error al cargar el detalle"
          message="No se pudo obtener el detalle de la deducción. Intente nuevamente."
          showCloseButton
          onClose={() => setDetailErrorOpen(false)}
        />
      </AnimatedAlertWrapper>

      <AnimatedAlertWrapper open={paymentsErrorOpen}>
        <Alert
          type="error"
          title="Error al cargar pagos"
          message="No se pudo obtener el historial de pagos. Intente nuevamente."
          showCloseButton
          onClose={() => setPaymentsErrorOpen(false)}
        />
      </AnimatedAlertWrapper>

      <AnimatedAlertWrapper open={vacationReportErrorOpen}>
        <Alert
          type="error"
          title="Error al cargar vacaciones"
          message="No se pudo obtener el acumulado de vacaciones. Intente nuevamente."
          showCloseButton
          onClose={() => setVacationReportErrorOpen(false)}
        />
      </AnimatedAlertWrapper>

      <AnimatedAlertWrapper open={travelExpensesReportErrorOpen}>
        <Alert
          type="error"
          title="Error al cargar viáticos"
          message="No se pudo obtener el detalle de viáticos. Intente nuevamente."
          showCloseButton
          onClose={() => setTravelExpensesReportErrorOpen(false)}
        />
      </AnimatedAlertWrapper>

      <AnimatedAlertWrapper open={permissionsReportErrorOpen}>
        <Alert
          type="error"
          title="Error al cargar permisos"
          message="No se pudo obtener el historial de permisos. Intente nuevamente."
          showCloseButton
          onClose={() => setPermissionsReportErrorOpen(false)}
        />
      </AnimatedAlertWrapper>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        variant="default"
        size="4xl"
        title="Detalles del Colaborador"
        panelClassName={[
          "w-[min(calc(100vw-1rem),56rem)] min-w-0",
          "max-h-[min(94dvh,54rem)] overflow-y-auto overflow-x-hidden overscroll-contain",
          "!mx-2 !my-2 sm:!mx-4 sm:!my-6",
          "rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
        ].join(" ")}
      >
        <div className="flex flex-col gap-4 pb-2">
          <div className="flex flex-wrap items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-neutral-700 dark:bg-[#1e2229] sm:items-center sm:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40 sm:h-14 sm:w-14">
              <User className="h-6 w-6 text-blue-600 dark:text-blue-400 sm:h-7 sm:w-7" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="wrap-break-word text-base font-bold leading-snug text-slate-900 dark:text-white">
                {collaborator?.full_name || "—"}
              </p>
              <p className="mt-0.5 font-mono text-sm text-slate-500 dark:text-slate-400">
                {collaborator?.collaborator_code || "—"}
              </p>
            </div>
            <div className="hidden shrink-0 flex-col items-end sm:flex">
              <span className="text-xs text-slate-400 dark:text-slate-500">
                Identificación
              </span>
              <span className="mt-0.5 font-mono text-sm font-semibold text-slate-700 dark:text-slate-200">
                {formattedIdentification}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoCard
              icon={<Briefcase className="h-4 w-4" />}
              label="CARGO"
              value={collaborator?.job_position || "—"}
            />
            <InfoCard
              icon={<MapPin className="h-4 w-4" />}
              label="ÁREA"
              value={collaborator?.work_area || "—"}
            />
            <InfoCard
              icon={<Hash className="h-4 w-4" />}
              label="NÚMERO INSS"
              value={collaborator?.inss_number || "—"}
              mono
            />
            <InfoCard
              icon={<Calendar className="h-4 w-4" />}
              label="FECHA DE INGRESO"
              value={
                collaborator?.entry_date
                  ? formatDate(collaborator.entry_date)
                  : "—"
              }
            />
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-neutral-700">
            <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50/50 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800/50">
              {deductionView !== "list" ? (
                <Button
                  type="button"
                  onClick={handleBack}
                  icon={<ArrowLeft className="h-4 w-4" />}
                  className="mr-1 inline-flex items-center gap-1 rounded-md p-0.5 text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  aria-label="Volver"
                />
              ) : (
                <FileText className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              )}

              <h5 className={MODAL_SECTION_TITLE_CLASS}>{sectionTitle}</h5>

              {deductionView === "list" && !isListLoading && !isListError && (
                <span className="ml-auto shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                  {deductions.length}
                </span>
              )}

              {deductionView === "detail" && selectedDeduction && (
                <div className="ml-auto shrink-0">
                  <Badges
                    label={getDeductionStatusLabel(selectedDeduction.status)}
                    color="transparent"
                    className={getDeductionStatusBadgeColor(
                      selectedDeduction.status,
                    )}
                  />
                </div>
              )}

              {deductionView === "payments" && !isPaymentsLoading && (
                <span className="ml-auto shrink-0 rounded-full bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                  {payments.length}
                </span>
              )}
            </div>

            <div className="overflow-hidden p-0">
              <LazyMotion features={loadMotionFeatures} strict>
                <AnimatePresence initial={false} mode="wait">
                  <m.div
                    key={deductionView}
                    initial={{
                      opacity: 0,
                      x: viewDirection === "forward" ? 24 : -24,
                    }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{
                      opacity: 0,
                      x: viewDirection === "forward" ? -24 : 24,
                    }}
                    transition={deductionViewTransition}
                  >
                    {deductionView === "payments" ? (
                      <DeductionPaymentsPanel
                        payments={payments}
                        isLoading={isPaymentsLoading}
                        isError={isPaymentsError}
                      />
                    ) : deductionView === "detail" ? (
                      <DeductionDetailPanel
                        detail={detailData ?? null}
                        isLoading={isDetailLoading}
                        onViewPayments={goToPayments}
                      />
                    ) : isListLoading ? (
                      <div className={EMPTY_STATE_CONTAINER_CLASS}>
                        <Spinner
                          size="medium"
                          className="text-blue-600 dark:text-blue-400"
                        />
                        <p className={LOADING_STATE_TEXT_CLASS}>
                          Cargando deducciones...
                        </p>
                      </div>
                    ) : isListError ? (
                      <div className="p-4">
                        <Alert
                          type="error"
                          title="Error"
                          message="No se pudo obtener la lista de deducciones."
                        />
                      </div>
                    ) : deductions.length > 0 ? (
                      <div className="flex flex-col divide-y divide-slate-100 dark:divide-neutral-700">
                        {deductions.map((deduction) => (
                          <div
                            key={deduction.deduction_id}
                            className="flex flex-col gap-4 px-4 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-neutral-800/50 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                          >
                            <div className="flex w-full min-w-0 items-center justify-between gap-3 sm:flex-1 sm:justify-start">
                              <span className="min-w-0 text-sm font-semibold text-slate-800 dark:text-slate-100">
                                {getDeductionTypeLabel(deduction.type)}
                              </span>
                              <Badges
                                label={getDeductionStatusLabel(
                                  deduction.status,
                                )}
                                color="transparent"
                                className={`shrink-0 sm:ml-1 ${getDeductionStatusBadgeColor(
                                  deduction.status,
                                )}`}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => goToDetail(deduction.deduction_id)}
                              className={`${DETAIL_ACTION_BUTTON_CLASS} w-full shrink-0 justify-center whitespace-nowrap sm:w-auto sm:px-3 sm:py-1.5`}
                            >
                              <Eye className="h-3.5 w-3.5 shrink-0 sm:h-3 sm:w-3" />
                              Ver detalles
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={EMPTY_STATE_CONTAINER_CLASS}>
                        <FileText className="mb-2 h-8 w-8 text-slate-300 dark:text-slate-600" />
                        <p className={EMPTY_STATE_TEXT_CLASS}>
                          No hay deducciones activas registradas para este
                          colaborador.
                        </p>
                      </div>
                    )}
                  </m.div>
                </AnimatePresence>
              </LazyMotion>
            </div>
          </div>

          {deductionView === "list" && (
            <>
              <VacationAccrualPanel
                data={vacationData}
                isLoading={isVacationReportLoading}
                isError={isVacationReportError}
              />
              <PermissionsPanel
                permissions={permissions}
                total={permissionsTotal}
                isLoading={GetPermissionHistory.isLoading}
                isError={GetPermissionHistory.isError}
              />
              <TravelExpensesPanel
                data={travelExpensesData}
                isLoading={isTravelExpensesLoading}
                isError={isTravelExpensesError}
              />
            </>
          )}

          <div className="flex flex-col gap-2 px-4 pt-1 sm:flex-row sm:justify-start sm:gap-3">
            <Button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              icon={<EyeOff className="h-3 w-3 shrink-0" />}
              label="Cerrar Vista"
              className={`${CLOSE_BUTTON_CLASS} w-full shrink-0 whitespace-nowrap sm:w-auto sm:px-3 sm:py-1.5`}
            />
            {onEditDeductions && (
              <Button
                type="button"
                onClick={onEditDeductions}
                label="Editar Deducciones"
                className="w-full shrink-0 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 sm:w-auto"
              />
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}

const MODAL_SECTION_TITLE_CLASS =
  "min-w-0 text-[11px] font-bold uppercase leading-snug text-slate-500 dark:text-slate-400 sm:text-xs sm:tracking-wider";

const MODAL_PANEL_PADDING_CLASS = "p-3 sm:p-4";

const EMPTY_STATE_CONTAINER_CLASS =
  "flex flex-col items-center justify-center px-4 py-10 text-center";

const EMPTY_STATE_TEXT_CLASS =
  "max-w-[17rem] text-center text-sm leading-relaxed text-slate-500 dark:text-slate-400 sm:max-w-xs";

const LOADING_STATE_TEXT_CLASS =
  "mt-3 max-w-[17rem] text-center text-sm leading-relaxed text-slate-500 dark:text-slate-400 sm:max-w-xs";

interface MobileFieldProps {
  label: string;
  value: React.ReactNode;
  className?: string;
  valueClassName?: string;
}

function MobileField({
  label,
  value,
  className,
  valueClassName,
}: MobileFieldProps): React.ReactNode {
  return (
    <div className={className}>
      <p className="text-[16px]! font-medium capitalize tracking-wide text-slate-400 dark:text-slate-500">
        {label}
      </p>
      <div
        className={`mt-0.5 text-sm text-slate-700 dark:text-slate-200 ${valueClassName ?? ""}`}
      >
        {value}
      </div>
    </div>
  );
}

interface VacationAccrualPanelProps {
  data: GetPayrollReportsVacationAccrualResponse | null;
  isLoading: boolean;
  isError: boolean;
}

function VacationAccrualPanel({
  data,
  isLoading,
  isError,
}: VacationAccrualPanelProps): React.ReactNode {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-neutral-700">
      <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50/50 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800/50">
        <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
        <h5 className={MODAL_SECTION_TITLE_CLASS}>Acumulado de vacaciones</h5>
      </div>

      <div className="overflow-hidden p-0">
        {isLoading ? (
          <div className={EMPTY_STATE_CONTAINER_CLASS}>
            <Spinner
              size="medium"
              className="text-blue-600 dark:text-blue-400"
            />
            <p className={LOADING_STATE_TEXT_CLASS}>
              Cargando acumulado de vacaciones...
            </p>
          </div>
        ) : isError ? (
          <div className="p-4">
            <Alert
              type="error"
              title="Error"
              message="No se pudo obtener el acumulado de vacaciones."
            />
          </div>
        ) : !data ? (
          <div className={EMPTY_STATE_CONTAINER_CLASS}>
            <Calendar className="mb-2 h-8 w-8 text-slate-300 dark:text-slate-600" />
            <p className={EMPTY_STATE_TEXT_CLASS}>
              No hay información de vacaciones para este colaborador.
            </p>
          </div>
        ) : (
          <div className={MODAL_PANEL_PADDING_CLASS}>
            <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-neutral-700">
              <div className="hidden border-b border-slate-200 bg-slate-100 sm:grid sm:grid-cols-4 dark:border-neutral-700 dark:bg-neutral-800">
                <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Concepto
                </div>
                <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Saldo
                </div>
                <div className="flex items-center gap-1 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <CreditCard className="h-3 w-3" /> NIO
                </div>
                <div className="flex items-center gap-1 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <DollarSign className="h-3 w-3" /> USD
                </div>
              </div>

              <div className="flex flex-col divide-y divide-slate-100 dark:divide-neutral-700">
                <VacationBalanceRow
                  label="Saldo inicial"
                  balance={data.beginning_balance}
                />
                <VacationBalanceRow
                  label="Saldo final"
                  balance={data.final_balance}
                  highlight
                />
                <VacationBalanceRow
                  label="Saldo de vacaciones"
                  balance={data.vacation_balance}
                />
                <VacationAmountRow
                  label="Cantidad equivalente"
                  nio={data.equivales_quantity}
                  usd={data.equivales_quantity_in_dollars}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const PERMISSION_TABLE_GRID_CLASS =
  "grid grid-cols-[minmax(6.5rem,1fr)_minmax(8.5rem,1.35fr)_minmax(4rem,0.65fr)_minmax(6.5rem,0.9fr)_minmax(5.5rem,0.75fr)_minmax(5.5rem,0.8fr)]";

function formatPermissionPeriod(startDate: string, endDate: string): string {
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  if (start === "—" && end === "—") return "—";
  if (start === end) return start;
  return `${start} — ${end}`;
}

function formatPermissionTimeRange(
  type: PermissionType,
  startTime?: string,
  endTime?: string,
): string {
  if (type === "Vacation") return "—";
  if (!startTime && !endTime) return "—";
  return `${startTime ?? "—"} — ${endTime ?? "—"}`;
}
function formatPermissionDays(amountDays?: number): string {
  if (amountDays == null) return "—";
  return `${amountDays} ${amountDays === 1 ? "día" : "días"}`;
}

function getApprovalStepIndicator(step: StepStatus): {
  label: string;
  className: string;
  title: string;
} {
  if (step.is_approved) {
    return {
      label: "✓",
      className:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
      title: `Aprobado por ${step.reviewed_by}`,
    };
    //step.is_approved === null
  } else if (!step.is_approved && !step.reviewed_by) {
    return {
      label: "○",
      className:
        "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200",
      title: "Pendiente de revisión",
    };
  }
  return {
    label: "✗",
    className:
      "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200",
    title: `Rechazado por ${step.reviewed_by}`,
  };
}

interface PermissionApprovalStepsProps {
  firstStep: StepStatus;
  secondStep: StepStatus;
}

function PermissionApprovalSteps({
  firstStep,
  secondStep,
}: PermissionApprovalStepsProps): React.ReactNode {
  const steps = [
    { key: "first", shortLabel: "1°", step: firstStep },
    { key: "second", shortLabel: "2°", step: secondStep },
  ] as const;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {steps.map(({ key, shortLabel, step }) => {
        const indicator = getApprovalStepIndicator(step);
        return (
          <span
            key={key}
            title={indicator.title}
            className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${indicator.className}`}
          >
            {shortLabel}
            {indicator.label}
          </span>
        );
      })}
    </div>
  );
}

interface PermissionTableRowProps {
  permission: PermissionResponse;
}

function PermissionMobileCard({
  permission,
}: PermissionTableRowProps): React.ReactNode {
  return (
    <div className="flex flex-col gap-3 px-3 py-4 sm:hidden">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          {PERMISSION_TYPE_LABEL[permission.type] ?? permission.type}
        </p>
        <Badges
          label={getPermissionStatusUiLabel(permission.status)}
          color="transparent"
          className={`shrink-0 ${statusBadgeColor(permission.status)}`}
        />
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <MobileField
          className="col-span-2"
          label="Período"
          value={formatPermissionPeriod(
            permission.start_date,
            permission.end_date,
          )}
        />
        <MobileField
          label="Días"
          value={formatPermissionDays(permission.amount_days)}
          valueClassName="font-semibold text-blue-700 dark:text-blue-300"
        />
        <MobileField
          label="Horario"
          value={formatPermissionTimeRange(
            permission.type,
            permission.start_time,
            permission.end_time,
          )}
          valueClassName="font-mono text-xs"
        />
      </div>

      <div>
        <p className="text-[15px]! font-medium capitalize tracking-wide text-slate-400 dark:text-slate-500">
          Aprobación
        </p>
        <div className="mt-1.5">
          <PermissionApprovalSteps
            firstStep={permission.first_step_status}
            secondStep={permission.second_step_status}
          />
        </div>
      </div>
    </div>
  );
}

function PermissionTableRow({
  permission,
}: PermissionTableRowProps): React.ReactNode {
  return (
    <>
      <PermissionMobileCard permission={permission} />
      <div
        className={`${PERMISSION_TABLE_GRID_CLASS} hidden transition-colors hover:bg-slate-50 dark:hover:bg-neutral-800/50 sm:grid`}
      >
        <div className="px-3 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-100">
          {PERMISSION_TYPE_LABEL[permission.type] ?? permission.type}
        </div>
        <div className="px-3 py-2.5 text-sm text-slate-600 dark:text-slate-300">
          {formatPermissionPeriod(permission.start_date, permission.end_date)}
        </div>
        <div className="px-3 py-2.5 text-sm font-semibold text-blue-700 dark:text-blue-300">
          {formatPermissionDays(permission.amount_days)}
        </div>
        <div className="px-3 py-2.5 font-mono text-xs text-slate-600 dark:text-slate-300">
          {formatPermissionTimeRange(
            permission.type,
            permission.start_time,
            permission.end_time,
          )}
        </div>
        <div className="flex items-center px-3 py-2.5">
          <Badges
            label={getPermissionStatusUiLabel(permission.status)}
            color="transparent"
            className={statusBadgeColor(permission.status)}
          />
        </div>
        <div className="flex items-center px-3 py-2.5">
          <PermissionApprovalSteps
            firstStep={permission.first_step_status}
            secondStep={permission.second_step_status}
          />
        </div>
      </div>
    </>
  );
}

interface PermissionsPanelProps {
  permissions: PermissionResponse[];
  total: number;
  isLoading: boolean;
  isError: boolean;
}

function PermissionsPanel({
  permissions,
  total,
  isLoading,
  isError,
}: PermissionsPanelProps): React.ReactNode {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-neutral-700">
      <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50/50 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800/50">
        <ClipboardList className="h-4 w-4 text-slate-500 dark:text-slate-400" />
        <h5 className={MODAL_SECTION_TITLE_CLASS}>Permisos</h5>
        {!isLoading && !isError && total > 0 && (
          <span className="ml-auto shrink-0 rounded-full bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
            {total}
          </span>
        )}
      </div>

      <div className="overflow-hidden p-0">
        {isLoading ? (
          <div className={EMPTY_STATE_CONTAINER_CLASS}>
            <Spinner
              size="medium"
              className="text-blue-600 dark:text-blue-400"
            />
            <p className={LOADING_STATE_TEXT_CLASS}>Cargando permisos...</p>
          </div>
        ) : isError ? (
          <div className="p-4">
            <Alert
              type="error"
              title="Error"
              message="No se pudo obtener el historial de permisos."
            />
          </div>
        ) : permissions.length === 0 ? (
          <div className={EMPTY_STATE_CONTAINER_CLASS}>
            <ClipboardList className="mb-2 h-8 w-8 text-slate-300 dark:text-slate-600" />
            <p className={EMPTY_STATE_TEXT_CLASS}>
              No hay permisos registrados para este colaborador.
            </p>
          </div>
        ) : (
          <div className={MODAL_PANEL_PADDING_CLASS}>
            <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-neutral-700">
              <div
                className={`${PERMISSION_TABLE_GRID_CLASS} hidden border-b border-slate-200 bg-slate-100 dark:border-neutral-700 dark:bg-neutral-800 sm:grid`}
              >
                <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Tipo
                </div>
                <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Período
                </div>
                <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Días
                </div>
                <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Horario
                </div>
                <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Estado
                </div>
                <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Aprobación
                </div>
              </div>

              <div className="flex flex-col divide-y divide-slate-100 dark:divide-neutral-700">
                {permissions.map((permission) => (
                  <PermissionTableRow
                    key={permission.permit_apllication_id}
                    permission={permission}
                  />
                ))}
              </div>
            </div>
            {total > permissions.length && (
              <p className="mt-2 text-center text-xs text-slate-400 dark:text-slate-500">
                Mostrando {permissions.length} de {total} permisos
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface TravelExpensesPanelProps {
  data: GetPaymentTravelExpensesResponse | null;
  isLoading: boolean;
  isError: boolean;
}

function TravelExpensesPanel({
  data,
  isLoading,
  isError,
}: TravelExpensesPanelProps): React.ReactNode {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-neutral-700">
      <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50/50 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800/50">
        <Receipt className="h-4 w-4 text-slate-500 dark:text-slate-400" />
        <h5 className={MODAL_SECTION_TITLE_CLASS}>Viáticos</h5>
      </div>

      <div className="overflow-hidden p-0">
        {isLoading ? (
          <div className={EMPTY_STATE_CONTAINER_CLASS}>
            <Spinner
              size="medium"
              className="text-blue-600 dark:text-blue-400"
            />
            <p className={LOADING_STATE_TEXT_CLASS}>Cargando viáticos...</p>
          </div>
        ) : isError ? (
          <div className="p-4">
            <Alert
              type="error"
              title="Error"
              message="No se pudo obtener el detalle de viáticos."
            />
          </div>
        ) : !data ? (
          <div className={EMPTY_STATE_CONTAINER_CLASS}>
            <Receipt className="mb-2 h-8 w-8 text-slate-300 dark:text-slate-600" />
            <p className={EMPTY_STATE_TEXT_CLASS}>
              No hay información de viáticos para este colaborador.
            </p>
          </div>
        ) : (
          <div className={MODAL_PANEL_PADDING_CLASS}>
            <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-neutral-700">
              <div className="hidden border-b border-slate-200 bg-slate-100 sm:grid sm:grid-cols-3 dark:border-neutral-700 dark:bg-neutral-800">
                <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Concepto
                </div>
                <div className="flex items-center gap-1 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <CreditCard className="h-3 w-3" /> NIO
                </div>
                <div className="flex items-center gap-1 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <DollarSign className="h-3 w-3" /> USD
                </div>
              </div>

              <div className="flex flex-col divide-y divide-slate-100 dark:divide-neutral-700">
                <AmountRow label="Transporte" nio={data.transport} />
                <AmountRow label="Alimentación" nio={data.feeding} />
                <AmountRow label="Hospedaje" nio={data.lodging} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface DeductionDetailPanelProps {
  detail: DeductionDetailsDto | null;
  isLoading: boolean;
  onViewPayments: () => void;
}

function DeductionDetailPanel({
  detail,
  isLoading,
  onViewPayments,
}: DeductionDetailPanelProps): React.ReactNode {
  if (isLoading) {
    return (
      <div className={EMPTY_STATE_CONTAINER_CLASS}>
        <Spinner size="medium" className="text-blue-600 dark:text-blue-400" />
        <p className={LOADING_STATE_TEXT_CLASS}>Cargando detalle...</p>
      </div>
    );
  }

  if (!detail) return null;

  const paidCount = detail.number_fortnights_paid ?? 0;
  const totalCount = detail.number_fortnights ?? 0;

  return (
    <div className="flex flex-col gap-5 p-4">
      {detail.description && (
        <div className="rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-neutral-700 dark:bg-[#1e2229]">
          <p className="mb-0.5 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Descripción
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-200">
            {detail.description}
          </p>
        </div>
      )}

      {totalCount > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-neutral-700 dark:bg-[#1e2229]">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Quincenas
          </p>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {paidCount} / {totalCount} pagadas
          </span>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-neutral-700">
        <div>
          <div className="hidden border-b border-slate-200 bg-slate-100 sm:grid sm:grid-cols-3 dark:border-neutral-700 dark:bg-neutral-800">
            <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Concepto
            </div>
            <div className="flex items-center gap-1 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <CreditCard className="h-3 w-3" /> NIO
            </div>
            <div className="flex items-center gap-1 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <DollarSign className="h-3 w-3" /> USD
            </div>
          </div>

          <div className="flex flex-col divide-y divide-slate-100 dark:divide-neutral-700">
            {detail.fortnightly_amount != null && (
              <AmountRow
                label="Cuota quincenal"
                nio={detail.fortnightly_amount}
                usd={detail.fortnightly_amount_in_dollars}
              />
            )}
            {detail.amount_paid != null && (
              <AmountRow
                label="Monto pagado"
                nio={detail.amount_paid}
                usd={detail.amount_paid_in_dollars}
              />
            )}
            {detail.total_balance != null && (
              <AmountRow
                label="Saldo pendiente"
                nio={detail.total_balance}
                usd={detail.total_balance_in_dollars}
                highlight
              />
            )}
            <AmountRow
              label="Total original"
              nio={detail.total_amount}
              usd={detail.total_amount_in_dollars}
              bold
            />
          </div>
        </div>
      </div>
      <div className="flex sm:justify-end">
        <Button
          type="button"
          onClick={onViewPayments}
          label="Ver detalles de pagos "
          icon={<Receipt className="h-3.5 w-3.5 shrink-0 sm:h-3 sm:w-3" />}
          className={`${DETAIL_ACTION_BUTTON_CLASS} w-full shrink-0 justify-center whitespace-nowrap sm:w-auto sm:px-3 sm:py-1.5`}
        />
      </div>
    </div>
  );
}

interface DeductionPaymentsPanelProps {
  payments: DeductionPaymentsDto[];
  isLoading: boolean;
  isError: boolean;
}

function DeductionPaymentsPanel({
  payments,
  isLoading,
  isError,
}: DeductionPaymentsPanelProps): React.ReactNode {
  if (isLoading) {
    return (
      <div className={EMPTY_STATE_CONTAINER_CLASS}>
        <Spinner size="medium" className="text-blue-600 dark:text-blue-400" />
        <p className={LOADING_STATE_TEXT_CLASS}>Cargando pagos...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4">
        <Alert
          type="error"
          title="Error"
          message="No se pudo obtener el historial de pagos."
        />
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className={EMPTY_STATE_CONTAINER_CLASS}>
        <Receipt className="mb-2 h-8 w-8 text-slate-300 dark:text-slate-600" />
        <p className={EMPTY_STATE_TEXT_CLASS}>
          No hay pagos registrados para esta deducción.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4">
      {payments.map((payment, index) => (
        <PaymentCard
          key={`${payment.deduction_details?.payroll_id ?? index}`}
          payment={payment}
        />
      ))}
    </div>
  );
}

function PaymentCard({
  payment,
}: {
  payment: DeductionPaymentsDto;
}): React.ReactNode {
  const periodStart = payment.deduction_details?.start_date;
  const periodEnd = payment.deduction_details?.end_date;

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4 dark:border-neutral-700 dark:bg-[#1e2229]">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Período de nómina
          </p>
          <p className="mt-0.5 text-sm font-semibold text-slate-800 dark:text-slate-100">
            {periodStart && periodEnd
              ? `${formatDateToSpanishWords(periodStart)} — ${formatDateToSpanishWords(periodEnd)}`
              : "—"}
          </p>
        </div>
        <Badges
          label={getDeductionPaymentStatusLabel(payment.status)}
          color="transparent"
          className={getDeductionPaymentStatusBadgeColor(payment.status)}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Monto NIO
          </p>
          <p className="font-mono text-sm font-semibold text-slate-800 dark:text-slate-100">
            {formatCurrency(payment.amount_paid, "NIO")}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Monto USD
          </p>
          <p className="font-mono text-sm font-semibold text-slate-800 dark:text-slate-100">
            {formatCurrency(payment.amount_paid_in_dollars, "USD")}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400 dark:text-slate-500">Origen</p>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {getDeductionPaymentOriginLabel(payment.origin)}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400 dark:text-slate-500">Moneda</p>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {String(payment.currency)}
          </p>
        </div>
      </div>
    </div>
  );
}

const formatVacationBalance = (value: number): string =>
  value.toLocaleString("es-NI", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

interface VacationBalanceRowProps {
  label: string;
  balance: number;
  highlight?: boolean;
}

function VacationBalanceRow({
  label,
  balance,
  highlight,
}: VacationBalanceRowProps): React.ReactNode {
  const textClass = highlight
    ? "font-semibold text-blue-700 dark:text-blue-300"
    : "font-medium text-slate-700 dark:text-slate-200";

  return (
    <>
      <div className="flex flex-col gap-2 px-3 py-3 sm:hidden">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {label}
        </p>
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Saldo
          </span>
          <span className={`font-mono text-sm tabular-nums ${textClass}`}>
            {formatVacationBalance(balance)}
          </span>
        </div>
      </div>

      <div className="hidden sm:grid sm:grid-cols-4">
        <div className="px-3 py-2.5 text-sm text-slate-500 dark:text-slate-400">
          {label}
        </div>
        <div
          className={`px-3 py-2.5 font-mono text-sm tabular-nums ${textClass}`}
        >
          {formatVacationBalance(balance)}
        </div>
        <div className="px-3 py-2.5 font-mono text-sm text-slate-400 dark:text-slate-500">
          —
        </div>
        <div className="px-3 py-2.5 font-mono text-sm text-slate-400 dark:text-slate-500">
          —
        </div>
      </div>
    </>
  );
}

interface VacationAmountRowProps {
  label: string;
  nio: number;
  usd?: number | null;
  highlight?: boolean;
  bold?: boolean;
}

function VacationAmountRow({
  label,
  nio,
  usd,
  highlight,
  bold,
}: VacationAmountRowProps): React.ReactNode {
  const textClass = bold
    ? "font-bold text-slate-900 dark:text-white"
    : highlight
      ? "font-semibold text-blue-700 dark:text-blue-300"
      : "font-medium text-slate-700 dark:text-slate-200";

  return (
    <>
      <div className="flex flex-col gap-3 px-3 py-3 sm:hidden">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {label}
        </p>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
              NIO
            </span>
            <span
              className={`font-mono text-sm tabular-nums wrap-break-word text-right ${textClass}`}
            >
              {formatCurrency(nio, "NIO")}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
              USD
            </span>
            <span
              className={`font-mono text-sm tabular-nums wrap-break-word text-right ${textClass}`}
            >
              {usd != null ? formatCurrency(usd, "USD") : "—"}
            </span>
          </div>
        </div>
      </div>

      <div className="hidden sm:grid sm:grid-cols-4">
        <div className="px-3 py-2.5 text-sm text-slate-500 dark:text-slate-400">
          {label}
        </div>
        <div className="px-3 py-2.5 font-mono text-sm text-slate-400 dark:text-slate-500">
          —
        </div>
        <div
          className={`px-3 py-2.5 font-mono text-sm tabular-nums ${textClass}`}
        >
          {formatCurrency(nio, "NIO")}
        </div>
        <div
          className={`px-3 py-2.5 font-mono text-sm tabular-nums ${textClass}`}
        >
          {usd != null ? formatCurrency(usd, "USD") : "—"}
        </div>
      </div>
    </>
  );
}

interface AmountRowProps {
  label: string;
  nio: number;
  usd?: number | null;
  highlight?: boolean;
  bold?: boolean;
}

function AmountRow({
  label,
  nio,
  usd,
  highlight,
  bold,
}: AmountRowProps): React.ReactNode {
  const textClass = bold
    ? "font-bold text-slate-900 dark:text-white"
    : highlight
      ? "font-semibold text-blue-700 dark:text-blue-300"
      : "font-medium text-slate-700 dark:text-slate-200";

  return (
    <>
      <div className="flex flex-col gap-3 px-3 py-3 sm:hidden">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {label}
        </p>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
              NIO
            </span>
            <span
              className={`font-mono text-sm tabular-nums wrap-break-word text-right ${textClass}`}
            >
              {formatCurrency(nio, "NIO")}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
              USD
            </span>
            <span
              className={`font-mono text-sm tabular-nums wrap-break-word text-right ${textClass}`}
            >
              {usd != null ? formatCurrency(usd, "USD") : "—"}
            </span>
          </div>
        </div>
      </div>

      <div className="hidden sm:grid sm:grid-cols-3">
        <div className="px-3 py-2.5 text-sm text-slate-500 dark:text-slate-400">
          {label}
        </div>
        <div
          className={`px-3 py-2.5 font-mono text-sm tabular-nums ${textClass}`}
        >
          {formatCurrency(nio, "NIO")}
        </div>
        <div
          className={`px-3 py-2.5 font-mono text-sm tabular-nums ${textClass}`}
        >
          {usd != null ? formatCurrency(usd, "USD") : "—"}
        </div>
      </div>
    </>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}

function InfoCard({
  icon,
  label,
  value,
  mono,
}: InfoCardProps): React.ReactNode {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 dark:border-neutral-700 dark:bg-[#1e2229]">
      <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p
        className={`truncate text-sm font-semibold text-slate-900 dark:text-white ${mono ? "font-mono" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}
