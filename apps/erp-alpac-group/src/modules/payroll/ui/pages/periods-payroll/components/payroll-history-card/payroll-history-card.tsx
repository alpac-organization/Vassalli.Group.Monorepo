import {
  CalendarDays,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  CircleDollarSign,
} from "lucide-react";
import type { PayrollHistoryCardProps } from "@app/modules/payroll/ui/pages/periods-payroll/components/payroll-history-card/payroll-history-card.types";
import { PAYROLL_TYPE_LABELS } from "@app/modules/payroll/domain/enums/payroll-enums/payroll-enum";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import { Button } from "@alpac/design-system";
import { Badges } from "@alpac/design-system";
interface StatBoxProps {
  label: string;
  value: string | number;
}

function StatBox({ label, value }: StatBoxProps) {
  return (
    <div className="flex flex-col gap-0.5 rounded-lg bg-slate-50 px-3 py-2 dark:bg-neutral-800/60">
      <span className="text-[10px] font-medium leading-none text-slate-400 dark:text-slate-500 sm:text-[11px]">
        {label}
      </span>
      <span className="text-sm font-bold leading-snug text-slate-700 dark:text-white sm:text-base">
        {value === "" || value === null || value === undefined ? "—" : value}
      </span>
    </div>
  );
}

export function PayrollHistoryCard({
  period,
  style,
  onViewDetails,
}: PayrollHistoryCardProps) {
  const typeLabel =
    PAYROLL_TYPE_LABELS[period.type as keyof typeof PAYROLL_TYPE_LABELS] ??
    period.type;

  const isVirtualized = style?.height != null;

  return (
    <div
      style={isVirtualized ? style : undefined}
      className={
        isVirtualized
          ? "absolute left-0 top-0 w-full px-2 py-1.5 md:px-4 md:pt-4 md:py-0"
          : "w-full px-2 py-1.5 sm:px-3 sm:py-2"
      }
    >
      <div
        className={
          isVirtualized
            ? "flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-alpac-primary-200 hover:shadow-md dark:border-neutral-700/60 dark:bg-[#1e2229] dark:hover:border-alpac-primary-700/60"
            : "flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-alpac-primary-200 hover:shadow-md dark:border-neutral-700/60 dark:bg-[#1e2229] dark:hover:border-alpac-primary-700/60"
        }
      >
        <div
          className={
            isVirtualized
              ? "flex min-h-0 flex-1 flex-col gap-2.5 px-4 pb-2 pt-3.5 sm:gap-3 sm:px-5 sm:pt-4 md:pb-2.5"
              : "flex flex-col gap-2.5 px-4 pb-3 pt-3.5 sm:gap-3 sm:px-5 sm:pt-4"
          }
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              {/* <span className="truncate text-sm font-semibold text-slate-800 dark:text-white">
                Periodo {period.}
              </span> */}

              <Badges
                color="bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-400 gap-2"
                label="Cerrado"
                childIcon={CheckCircle2}
              />
            </div>
            <Badges
              color="bg-slate-100 text-slate-500 dark:bg-neutral-800 dark:text-slate-400"
              label={typeLabel}
              className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-[14px] font-medium text-slate-500 dark:bg-neutral-800 dark:text-slate-400 sm:text-[12px] gap-3"
              childIcon={CircleDollarSign}
            />
          </div>

          <div className="flex items-center gap-1.5">
            <CalendarDays
              size={13}
              strokeWidth={2}
              className="shrink-0 text-blue-400 dark:text-blue-500"
            />
            <span className="text-[11px] font-medium text-blue-500 dark:text-blue-400 sm:text-xs">
              {formatDateToSpanishWords(period.start_date)} —{" "}
              {formatDateToSpanishWords(period.end_date)}
            </span>
          </div>

          <div className="flex flex-col gap-1.5 md:grid md:grid-cols-3 md:gap-2 pt-2 pb-2">
            <StatBox label="Empleados" value="—" />
            <StatBox label="Bruto" value="—" />
            <StatBox label="Neto" value="—" />
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2.5 border-t border-slate-100 px-4 py-3 dark:border-neutral-700/40 sm:px-5 md:flex-row md:items-center md:justify-between md:gap-4 md:px-6 md:py-5">
          <div className="flex items-center gap-1.5 text-[12px] text-slate-400 dark:text-slate-500 sm:text-[12px]">
            <Clock size={11} strokeWidth={2} className="shrink-0" />
            <span>Cerrado el {formatDateToSpanishWords(period.end_date)}</span>
          </div>

          <Button
            type="button"
            onClick={onViewDetails}
            disabled={!onViewDetails}
            className="flex w-full items-center justify-center gap-0.5 text-[11px] font-semibold disabled:cursor-default disabled:opacity-50 text-gray-300! bg-alpac-primary-500! dark:bg-alpac-primary-700! md:w-auto md:justify-start"
            label="Ver detalles"
            icon={<ArrowUpRight size={12} strokeWidth={2.5} />}
          />
        </div>
      </div>
    </div>
  );
}
