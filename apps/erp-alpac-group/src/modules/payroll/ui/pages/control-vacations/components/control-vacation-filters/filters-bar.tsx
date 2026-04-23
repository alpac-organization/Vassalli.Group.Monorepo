import { useEffect, useState } from "react";
import { Button, DatePicker, type DatePickerValue } from "@alpac/design-system";
import type { ControlVacationFiltersBarProps } from "@app/modules/payroll/ui/pages/control-vacations/components/control-vacation-filters/types/control-vacation-filter-bar";
import dayjs from "dayjs";
import { toUtcDayRangeIsoFromYmd } from "@app/shared/utils/string.utils";
import {
  datePickerFieldClassName,
  controlVacationCalendarDaySx,
} from "@app/modules/payroll/ui/pages/control-vacations/components/control-vacation-filters/utils/styles.datepicker";

export function ControlVacationFiltersBar({
  initialStart,
  initialEnd,
  isApplyingFilters = false,
  onApply,
  onClear,
}: ControlVacationFiltersBarProps) {
  const today = dayjs().endOf("day");
  const [startDate, setStartDate] = useState<DatePickerValue>(() => {
    if (!initialStart) return null;
    return dayjs(initialStart.split("T")[0]);
  });
  const [endDate, setEndDate] = useState<DatePickerValue>(() => {
    if (!initialEnd) return null;
    return dayjs(initialEnd.split("T")[0]);
  });
  const [rangeError, setRangeError] = useState<string | null>(null);

  const rangeOrderInvalid =
    Boolean(startDate && endDate) &&
    (() => {
      const s = dayjs(startDate);
      const e = dayjs(endDate);
      if (!s.isValid() || !e.isValid()) return false;
      return s.isAfter(e, "day");
    })();

  useEffect(() => {
    setStartDate(initialStart ? dayjs(initialStart.split("T")[0]) : null);
  }, [initialStart]);

  useEffect(() => {
    setEndDate(initialEnd ? dayjs(initialEnd.split("T")[0]) : null);
  }, [initialEnd]);

  const handleStartDateChange = (value: DatePickerValue) => {
    setRangeError(null);
    setStartDate(value);

    const nextStart = value ? dayjs(value) : null;
    if (!nextStart?.isValid()) {
      setEndDate(null);
      return;
    }

    if (endDate) {
      const currentEnd = dayjs(endDate);
      if (currentEnd.isValid() && currentEnd.isBefore(nextStart, "day")) {
        setRangeError("La fecha final no puede ser menor a la fecha inicial");
      }
    }
  };

  const handleEndDateChange = (value: DatePickerValue) => {
    setRangeError(null);
    setEndDate(value);

    const nextEnd = value ? dayjs(value) : null;
    if (!nextEnd?.isValid() || !startDate) return;

    const nextStart = dayjs(startDate);
    if (nextStart.isValid() && nextEnd.isBefore(nextStart, "day")) {
      setRangeError("La fecha final no puede ser menor a la fecha inicial");
    }
  };

  const canApplyFilters = Boolean(startDate && endDate) && !rangeOrderInvalid;

  const handleApply = () => {
    setRangeError(null);
    const s = startDate ? dayjs(startDate) : null;
    const e = endDate ? dayjs(endDate) : null;
    if (!s?.isValid() || !e?.isValid()) return;
    if (s.isAfter(today, "day") || e.isAfter(today, "day")) {
      setRangeError("No se permiten fechas futuras.");
      return;
    }
    const startStr = s.format("YYYY-MM-DD");
    const endStr = e.format("YYYY-MM-DD");
    if (startStr > endStr) {
      setRangeError("La fecha inicial no puede ser posterior a la fecha final");
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
                onChange={handleStartDateChange}
                maxDate={today}
                slotProps={{
                  textField: {
                    className: datePickerFieldClassName,
                  },
                  day: {
                    sx: controlVacationCalendarDaySx,
                  },
                }}
              />
            </div>
            <div className="w-full shrink-0 sm:w-auto">
              <DatePicker
                fieldWidth="medium"
                label="Fecha fin"
                value={endDate}
                onChange={handleEndDateChange}
                disabled={!startDate}
                minDate={
                  startDate ? dayjs(startDate).startOf("day") : undefined
                }
                maxDate={today}
                slotProps={{
                  textField: {
                    className: datePickerFieldClassName,
                  },
                  day: {
                    sx: controlVacationCalendarDaySx,
                  },
                }}
              />
            </div>
          </div>
          {rangeError || rangeOrderInvalid ? (
            <p className="m-0 text-sm text-red-600 dark:text-red-400">
              {rangeError ??
                "La fecha final no puede ser menor a la fecha inicial"}
            </p>
          ) : null}
        </div>
        <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          <Button
            type="button"
            size="giant"
            label="Aplicar filtros"
            isLoading={isApplyingFilters}
            onClick={handleApply}
            disabled={!canApplyFilters}
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
