import { useState } from "react";
import { Button, DatePicker, type DatePickerValue } from "@alpac/design-system";
import type { ControlVacationFiltersBarProps } from "@app/modules/payroll/ui/pages/control-vacations/components/control-vacation-filters/type/control-vacation-filter-bar";

export function ControlVacationFiltersBar({
  onApply,
  onClear,
}: ControlVacationFiltersBarProps) {
  const [startDate, setStartDate] = useState<DatePickerValue>(null);
  const [endDate, setEndDate] = useState<DatePickerValue>(null);

  const handleClear = () => {
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
            Descripcion de filtros
          </small>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-start sm:gap-3 md:gap-4">
        <div className="flex w-full min-w-0 flex-col gap-3 sm:w-auto sm:flex-row sm:items-end sm:gap-2">
          <div className="w-full shrink-0 sm:w-auto">
            <DatePicker
              fieldWidth="medium"
              label="Fecha inicio"
              value={startDate}
              onChange={(v) => setStartDate(v)}
            />
          </div>
          <div className="w-full shrink-0 sm:w-auto">
            <DatePicker
              fieldWidth="medium"
              label="Fecha fin"
              value={endDate}
              onChange={(v) => setEndDate(v)}
            />
          </div>
        </div>
        <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          <Button
            type="button"
            size="giant"
            label="Aplicar filtros"
            onClick={onApply}
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
