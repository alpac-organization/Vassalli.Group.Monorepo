import { useState } from "react";
import { Button, DatePicker, type DatePickerValue } from "@alpac/design-system";
import type { ControlVacationFiltersBarProps } from "@app/modules/payroll/ui/pages/control-vacations/components/control-vacation-filters/control-vacation-filter-bar";

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
    <div className="rounded-lg border border-slate-600 dark:border-neutral-600 bg-white dark:bg-[#272b34] p-4 md:p-5">
      <h3 className="font-bold pb-2">Filtros</h3>
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
            className="w-full sm:w-auto! text-[15px]! rounded-md! bg-alpac-primary-500 text-white!"
          />
          <Button
            type="button"
            size="giant"
            label="Limpiar filtros"
            onClick={handleClear}
            className="w-full sm:w-auto! text-[15px]! rounded-md! bg-slate-500! dark:bg-slate-700! text-white!"
          />
        </div>
      </div>
    </div>
  );
}
