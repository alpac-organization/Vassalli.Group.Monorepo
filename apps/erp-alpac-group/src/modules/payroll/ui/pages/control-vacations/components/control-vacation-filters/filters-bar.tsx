import { useState } from "react";
import { Button, DatePicker, type DatePickerValue } from "@alpac/design-system";
import type { ControlVacationFiltersBarProps } from "@app/modules/payroll/ui/pages/control-vacations/components/control-vacation-filters/type/control-vacation-filter-bar";
import dayjs from "dayjs";
import { toUtcDayRangeIsoFromYmd } from "@app/shared/utils/string.utils";

const datePickerFieldClassName =
  "w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";

export function ControlVacationFiltersBar({
  initialStart,
  initialEnd,
  onApply,
  onClear,
}: ControlVacationFiltersBarProps) {
  const [startDate, setStartDate] = useState<DatePickerValue>(() =>
    initialStart ? dayjs(initialStart) : null,
  );
  const [endDate, setEndDate] = useState<DatePickerValue>(() =>
    initialEnd ? dayjs(initialEnd) : null,
  );
  const [rangeError, setRangeError] = useState<string | null>(null);

  const handleApply = () => {
    setRangeError(null);
    const s = startDate ? dayjs(startDate) : null;
    const e = endDate ? dayjs(endDate) : null;
    if (!s?.isValid() || !e?.isValid()) return;
    const startStr = s.format("YYYY-MM-DD");
    const endStr = e.format("YYYY-MM-DD");
    if (startStr > endStr) {
      setRangeError("La fecha inicial no puede ser posterior a la fecha final.");
      return;
    }
    const { start_date, end_date } = toUtcDayRangeIsoFromYmd(startStr, endStr);
    onApply({ start_date, end_date });
  };

  const handleClear = () => {
    setRangeError(null);
    setStartDate(null);
    setEndDate(null);
    onClear();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between border-t border-t-slate-600 pt-4 dark:border-t-neutral-600">
        <div className="flex flex-col justify-center">
          <h3 className="p-0! m-0!">Filtros</h3>
          <small className="text-gray-500 dark:text-gray-300">
            Elija fechas y aplique para cargar. Limpiar deja los campos vacíos.
          </small>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-start sm:gap-3 md:gap-4">
        <div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-2">
            <div className="w-full shrink-0 sm:w-auto">
              <DatePicker
                fieldWidth="medium"
                label="Fecha inicio"
                value={startDate}
                onChange={(v) => setStartDate(v)}
                slotProps={{
                  textField: {
                    className: datePickerFieldClassName,
                  },
                }}
              />
            </div>
            <div className="w-full shrink-0 sm:w-auto">
              <DatePicker
                fieldWidth="medium"
                label="Fecha fin"
                value={endDate}
                onChange={(v) => setEndDate(v)}
                slotProps={{
                  textField: {
                    className: datePickerFieldClassName,
                  },
                }}
              />
            </div>
          </div>
          {rangeError ? (
            <p className="m-0 text-sm text-red-600 dark:text-red-400">
              {rangeError}
            </p>
          ) : null}
        </div>
        <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          <Button
            type="button"
            size="giant"
            label="Aplicar filtros"
            onClick={handleApply}
            className="w-full! rounded-md! bg-alpac-primary-600! text-[15px]! text-white! sm:w-auto!"
          />
          <Button
            type="button"
            size="giant"
            label="Limpiar filtros"
            onClick={handleClear}
            className="w-full! rounded-md! bg-slate-500! text-[15px]! text-white! dark:bg-slate-700! sm:w-auto!"
          />
        </div>
      </div>
    </div>
  );
}
