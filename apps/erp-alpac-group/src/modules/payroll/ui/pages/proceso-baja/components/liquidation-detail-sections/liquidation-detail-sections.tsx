import type { LiquidationDetailDto } from "@app/modules/payroll/domain/ApiContract/Responses/liquidation-responses/get-liquidations.response";
import { procesoBajaSectionTitleClassName } from "@app/modules/payroll/ui/pages/proceso-baja/utils/proceso-baja.constants";
import { getLiquidationStatusLabel } from "@app/modules/payroll/ui/pages/proceso-baja/utils/proceso-baja.labels";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { formatDate } from "@app/shared/utils/string.utils";
import { CalendarIcon } from "lucide-react";

const showDate = (value?: string | null) => (value ? formatDate(value) : "—");

type LiquidationDetailSectionsProps = {
  detail: LiquidationDetailDto;
};

export const LiquidationDetailSections = ({ detail }: LiquidationDetailSectionsProps) => {
  const lines = detail.details ?? [];

  return (
    <div className="flex flex-col gap-5">
      <section className="flex flex-col gap-3">
        <h4 className={procesoBajaSectionTitleClassName}>Información general</h4>
        <div className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-2 lg:grid-cols-3">
          <DetailField label="Colaborador" value={detail.collaborator_name?.trim() || "—"} />
          <DetailField label="Estado" value={getLiquidationStatusLabel(detail.status)} />
          <DetailField label="Bruto" value={formatCurrency(detail.gross_total)} />
          <DetailField label="Deducciones" value={formatCurrency(detail.deductions_total)} />
          <DetailField label="Neto" value={formatCurrency(detail.net_total)} />
          <DetailField
            label="Calculada"
            value={showDate(detail.calculated_at)}
            icon={<CalendarIcon size={18} />}
          />
          {detail.approved_at && (
            <DetailField
              label="Aprobada"
              value={showDate(detail.approved_at)}
              icon={<CalendarIcon size={18} />}
            />
          )}
          {detail.paid_at && (
            <DetailField
              label="Pagada"
              value={showDate(detail.paid_at)}
              icon={<CalendarIcon size={18} />}
            />
          )}
          {detail.cancellation_reason?.trim() && (
            <DetailField label="Motivo de cancelación" value={detail.cancellation_reason} />
          )}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h4 className={procesoBajaSectionTitleClassName}>Desglose</h4>
        {lines.length === 0 ? (
          <p className="m-0 p-1 text-sm text-slate-500 dark:text-slate-400">
            Sin líneas de liquidación.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-md border border-slate-200 dark:border-neutral-700">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 dark:bg-[#1f232b]">
                <tr>
                  <th className="px-3 py-2 text-left">Concepto</th>
                  <th className="px-3 py-2 text-right">Cantidad</th>
                  <th className="px-3 py-2 text-right">Monto</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => (
                  <tr
                    key={line.detail_id}
                    className="border-t border-slate-200 dark:border-neutral-700"
                  >
                    <td className="px-3 py-2">{line.description || line.concept}</td>
                    <td className="px-3 py-2 text-right">{line.quantity}</td>
                    <td className="px-3 py-2 text-right">{formatCurrency(line.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
