import { CalendarRange, Building2, FileText } from "lucide-react";
import type { PayrollHistoryCardProps } from "@app/modules/payroll/ui/pages/periods-payroll/components/payroll-history-card/payroll-history-card.types";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";

export function PayrollHistoryCard({ period, style }: PayrollHistoryCardProps) {
  return (
    <div style={style} className="absolute left-0 top-0 w-full px-1 py-1 sm:px-2 sm:py-2">
      <div className="flex h-full min-h-0 flex-col justify-start rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition-all hover:border-alpac-primary-200 hover:shadow-md sm:rounded-xl sm:p-5 md:flex-row md:items-center md:justify-between md:gap-4 dark:border-neutral-700 dark:bg-[#1e2229] dark:hover:border-alpac-primary-700">
        <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 sm:h-12 sm:w-12 dark:bg-neutral-800 dark:text-slate-400">
            <FileText
              size={20}
              strokeWidth={1.5}
              className="sm:h-6 sm:w-6"
            />
          </div>
          <div className="flex min-w-0 flex-col gap-1 sm:gap-1.5 sm:pb-0">
            <h4 className="m-0 text-sm font-bold leading-snug text-slate-800 sm:text-base dark:text-white">
              Periodo de Nómina
            </h4>
            <div className="flex items-start gap-2 text-xs leading-snug text-slate-500 sm:items-center sm:text-sm dark:text-slate-400">
              <CalendarRange
                size={13}
                className="mt-0.5 shrink-0 text-slate-400 sm:mt-0 sm:h-3.5 sm:w-3.5"
              />
              <span className="wrap-break-word">
                {formatDateToSpanishWords(period.startDate)} —{" "}
                {formatDateToSpanishWords(period.endDate)}
              </span>
            </div>
            {period.branchName && (
              <div className="mt-0.5 flex items-start gap-2 text-[11px] font-medium leading-snug text-slate-500 sm:mt-1 sm:text-xs dark:text-slate-400">
                <Building2
                  size={13}
                  className="mt-0.5 shrink-0 text-slate-400 sm:mt-0 sm:h-3.5 sm:w-3.5"
                />
                <span className="wrap-break-word">{period.branchName}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
