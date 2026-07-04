import { Alert, Badges, Button, Spinner } from "@alpac/design-system";
import type {
  DeductionPaymentsDto,
  GetDeductionPaymentsResponse,
} from "@app/modules/payroll/domain/ApiContract/Responses/deduction-responses/get-deduction-payments.response";
import { getDeductionPaymentOriginLabel } from "@app/modules/payroll/domain/enums/deduction-enums/deduction-payment-origin.enum";
import currencyNames from "@app/modules/payroll/constants/currency";
import {
  getDeductionPaymentStatusBadgeColor,
  getDeductionPaymentStatusLabel,
} from "@app/modules/payroll/domain/enums/deduction-enums/deduction-payment-status.enum";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import { ArrowLeftIcon, Receipt } from "lucide-react";

const EMPTY_STATE_CONTAINER_CLASS =
  "flex flex-col items-center justify-center px-4 py-10 text-center";

const EMPTY_STATE_TEXT_CLASS =
  "max-w-xs text-center text-sm leading-relaxed text-slate-500 dark:text-slate-400";

const LOADING_STATE_TEXT_CLASS =
  "mt-3 max-w-[17rem] text-center text-sm leading-relaxed text-slate-500 dark:text-slate-400 sm:max-w-xs";

type ActiveDeductionPaymentsProps = {
  payments: GetDeductionPaymentsResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  onBack: () => void;
};

function PaymentCard({ payment }: { payment: DeductionPaymentsDto }) {
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
            {String(currencyNames[payment.currency])}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ActiveDeductionPayments({
  payments,
  isLoading,
  isError,
  onBack,
}: ActiveDeductionPaymentsProps) {
  const paymentItems = payments?.data ?? [];

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
      <Alert
        type="error"
        title="Error"
        message="No se pudo obtener el historial de pagos."
      />
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          icon={<ArrowLeftIcon className="w-4 h-4" />}
          onClick={onBack}
          label="Volver"
        />
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Pagos realizados ({paymentItems.length})
        </p>
      </div>

      {paymentItems.length === 0 ? (
        <div className={EMPTY_STATE_CONTAINER_CLASS}>
          <Receipt className="mb-2 h-8 w-8 text-slate-300 dark:text-slate-600" />
          <p className={EMPTY_STATE_TEXT_CLASS}>
            No hay pagos registrados para esta deducción.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {paymentItems.map((payment, index) => (
            <PaymentCard
              key={`${payment.deduction_details?.payroll_id ?? index}`}
              payment={payment}
            />
          ))}
        </div>
      )}
    </div>
  );
}
