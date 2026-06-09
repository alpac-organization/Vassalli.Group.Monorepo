import { useEffect, useState } from "react";
import { Modal, Spinner, Badges, Alert, AnimatedAlertWrapper } from "@alpac/design-system";
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
} from "lucide-react";
import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
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
} from "@app/shared/utils/string.utils";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import type { DeductionDetailsDto } from "@app/modules/payroll/domain/ApiContract/Responses/deduction-responses/get-deduction-details.response";
import type { DeductionPaymentsDto } from "@app/modules/payroll/domain/ApiContract/Responses/deduction-responses/get-deduction-payments.response";

type DeductionView = "list" | "detail" | "payments";

const DETAIL_ACTION_BUTTON_CLASS =
  "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold text-white bg-alpac-primary-500 dark:bg-alpac-primary-700 transition-opacity hover:opacity-90";

interface ModalDetailsPayrollProps {
  isOpen: boolean;
  onClose: () => void;
  payrollItem: PayrollItemResponse | null;
  onEditDeductions?: () => void;
}

export function ModalDetailsPayroll({
  isOpen,
  onClose,
  payrollItem,
  onEditDeductions,
}: ModalDetailsPayrollProps): React.ReactNode {
  const collaborator = payrollItem?.collaborator ?? null;
  const { companyId, moduleCode } = useUserStore();
  const { useGetDeductions, useGetDeductionDetails, useGetDeductionPayments } =
    useDeduction();

  const [deductionView, setDeductionView] = useState<DeductionView>("list");
  const [selectedDeductionId, setSelectedDeductionId] = useState<string | null>(
    null,
  );
  const [listErrorOpen, setListErrorOpen] = useState(false);
  const [detailErrorOpen, setDetailErrorOpen] = useState(false);
  const [paymentsErrorOpen, setPaymentsErrorOpen] = useState(false);

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
    data: paymentsData,
    isLoading: isPaymentsLoading,
    isError: isPaymentsError,
  } = useGetDeductionPayments(
    {
      companie_id: companyId,
      module_code: moduleCode,
      deduction_id: selectedDeductionId ?? "",
      page_number: 1,
      page_size: 50,
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
    if (!isOpen) {
      setSelectedDeductionId(null);
      setDeductionView("list");
    }
  }, [isOpen]);

  const deductions = listData?.data ?? [];
  const payments = paymentsData?.data ?? [];

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
    if (deductionView === "payments") {
      setDeductionView("detail");
      return;
    }
    if (deductionView === "detail") {
      setDeductionView("list");
      setSelectedDeductionId(null);
    }
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

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        variant="default"
        title="Detalles del Colaborador"
        panelClassName={[
          "!max-w-2xl w-[min(calc(100vw-1rem),42rem)] min-w-0",
          "max-h-[min(94dvh,54rem)] overflow-y-auto overflow-x-hidden overscroll-contain",
          "!mx-2 !my-2 sm:!mx-4 sm:!my-6",
          "rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
        ].join(" ")}
      >
        <div className="flex flex-col gap-4 pb-2">
          <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-neutral-700 dark:bg-[#1e2229]">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40 sm:h-14 sm:w-14">
              <User className="h-6 w-6 text-blue-600 dark:text-blue-400 sm:h-7 sm:w-7" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-bold text-slate-900 dark:text-white">
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
                <button
                  type="button"
                  onClick={handleBack}
                  className="mr-1 inline-flex items-center gap-1 rounded-md p-0.5 text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  aria-label="Volver"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              ) : (
                <FileText className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              )}

              <h5 className="min-w-0 truncate text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {sectionTitle}
              </h5>

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

            <div className="p-0">
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
                  onViewPayments={() => setDeductionView("payments")}
                />
              ) : isListLoading ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <Spinner
                    size="medium"
                    className="text-blue-600 dark:text-blue-400"
                  />
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
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
                      className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-neutral-800/50"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                          {getDeductionTypeLabel(deduction.type)}
                        </span>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Badges
                          label={getDeductionStatusLabel(deduction.status)}
                          color="transparent"
                          className={getDeductionStatusBadgeColor(
                            deduction.status,
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDeductionId(deduction.deduction_id);
                            setDeductionView("detail");
                          }}
                          className={DETAIL_ACTION_BUTTON_CLASS}
                        >
                          <Eye className="h-3 w-3 shrink-0" />
                          Ver detalles
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <FileText className="mb-2 h-8 w-8 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No hay deducciones activas registradas para este
                    colaborador.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-1 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-slate-200 dark:hover:bg-neutral-700"
            >
              Cerrar
            </button>
            {onEditDeductions && (
              <button
                type="button"
                onClick={onEditDeductions}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                Editar Deducciones
              </button>
            )}
          </div>
        </div>
      </Modal>
    </>
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
      <div className="flex flex-col items-center justify-center py-10">
        <Spinner size="medium" className="text-blue-600 dark:text-blue-400" />
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Cargando detalle...
        </p>
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

      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-neutral-700">
        <div className="min-w-[280px]">
          <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-100 dark:border-neutral-700 dark:bg-neutral-800">
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

      <button
        type="button"
        onClick={onViewPayments}
        className={`${DETAIL_ACTION_BUTTON_CLASS} w-full justify-center sm:w-auto`}
      >
        <Receipt className="h-3 w-3 shrink-0" />
        Ver detalles de pagos realizados
      </button>
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
      <div className="flex flex-col items-center justify-center py-10">
        <Spinner size="medium" className="text-blue-600 dark:text-blue-400" />
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Cargando pagos...
        </p>
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
      <div className="flex flex-col items-center justify-center py-10">
        <Receipt className="mb-2 h-8 w-8 text-slate-300 dark:text-slate-600" />
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No hay pagos registrados para esta deducción.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4">
      {payments.map((payment, index) => (
        <PaymentCard key={`${payment.deduction_details?.payroll_id ?? index}`} payment={payment} />
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
              ? `${formatDate(periodStart)} — ${formatDate(periodEnd)}`
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
          <p className="text-xs text-slate-400 dark:text-slate-500">Monto NIO</p>
          <p className="font-mono text-sm font-semibold text-slate-800 dark:text-slate-100">
            {formatCurrency(payment.amount_paid, "NIO")}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400 dark:text-slate-500">Monto USD</p>
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
    <div className="grid grid-cols-3">
      <div className="px-3 py-2.5 text-sm text-slate-500 dark:text-slate-400">
        {label}
      </div>
      <div className={`px-3 py-2.5 font-mono text-sm ${textClass}`}>
        {formatCurrency(nio, "NIO")}
      </div>
      <div className={`px-3 py-2.5 font-mono text-sm ${textClass}`}>
        {usd != null ? formatCurrency(usd, "USD") : "—"}
      </div>
    </div>
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
