import { Button, Dropdown } from "@alpac/design-system";
import { useState } from "react";
import {
  AccountingReviewStatus,
  AccountingTypeOptions,
  type accountingReviewStatusType,
} from "@app/modules/finance/enum/analysis-quotation/accounting-review-status";
import type { QuoteAnalysisFiltersProps } from "@app/modules/finance/ui/pages/quote-analisys/components/quote-analysis-filters/types/quote-analysis-filters.types";
import {
  dropdownClassName,
  labelClassName,
} from "@app/modules/finance/ui/pages/quote-analisys/components/quote-analysis-filters/utils/styles";

const resolveStatus = (value: string | number): accountingReviewStatusType =>
  AccountingTypeOptions.find((option) => option.value === value)?.value ??
  AccountingReviewStatus.Pending.textValue;

export function QuoteAnalysisFilters({
  onApply,
  onClear,
}: QuoteAnalysisFiltersProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const handleClear = () => {
    setSelectedStatus("");
    onClear();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col justify-center gap-2">
          <h3 className="p-0! m-0!">Filtros</h3>
          <small className="text-gray-500 dark:text-gray-300 text-[12px] sm:text-sm leading-snug">
            Filtra las solicitudes de revisión contable por estado.
          </small>
        </div>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          onApply(selectedStatus as accountingReviewStatusType);
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end"
      >
        <div className="flex flex-col min-w-0">
          <Dropdown
            appearance="dark"
            label="Estado"
            placeholder="Seleccione un estado"
            options={AccountingTypeOptions}
            value={selectedStatus}
            onChange={(value) => setSelectedStatus(resolveStatus(value))}
            labelClassName={labelClassName}
            valueClassName={labelClassName}
            className={`${dropdownClassName} h-[42px]! sm:h-[46px]!`}
          />
        </div>

        <div className="flex flex-row gap-3 min-w-0 w-full items-end self-end">
          <Button
            type="submit"
            size="giant"
            className="flex-1! sm:flex-none! w-full! sm:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
            label="Aplicar filtros"
          />
          <Button
            type="button"
            size="giant"
            className="flex-1! sm:flex-none! w-full! sm:w-auto! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
            label="Limpiar filtros"
            onClick={handleClear}
          />
        </div>
      </form>
    </div>
  );
}
