import { useState } from "react";
import { Button, Dropdown, InputText, type Option } from "@alpac/design-system";
import { Filter, RotateCcw, Search } from "lucide-react";
import { OperationalOrderStatusOptions } from "@app/modules/warehouse/domain/enums/warehouse-managua/operational-order-status.enum";
import {
  dropdownClassName,
  inputClassName,
  labelClassName,
} from "../../utils/styles";
import type { OngoingOperationsFilters } from "../../types/ongoing-operations.types";

interface OperationsFiltersProps {
  onApply: (filters: OngoingOperationsFilters) => void;
  onClear: () => void;
}

const statusOptions: Option[] = [
  { value: "", label: "Todos los estados" },
  ...OperationalOrderStatusOptions.map((opt) => ({
    value: String(opt.value || opt.label),
    label: opt.label,
  })),
];

export function OperationsFilters({ onApply, onClear }: OperationsFiltersProps) {
  const [code, setCode] = useState("");
  const [customerCif, setCustomerCif] = useState("");
  const [status, setStatus] = useState<string>("");

  const handleSearch = () => {
    onApply({
      code: code.trim(),
      customer_cif: customerCif.trim(),
      status: (status as any) || "",
    });
  };

  const handleReset = () => {
    setCode("");
    setCustomerCif("");
    setStatus("");
    onClear();
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-white dark:bg-[#272b34] rounded-xl border border-slate-200 dark:border-neutral-700 shadow-sm">
      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold text-sm">
        <Filter size={16} className="text-alpac-primary-500" />
        <span>Filtros de búsqueda</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <InputText
          label="Código PO"
          labelClassName={labelClassName}
          placeholder="Ej. ALP-MGA-OP-15"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className={inputClassName}
        />

        <InputText
          label="CIF de Cliente"
          labelClassName={labelClassName}
          placeholder="Ej. 20123456789"
          value={customerCif}
          onChange={(e) => setCustomerCif(e.target.value)}
          className={inputClassName}
        />

        <Dropdown
          appearance="dark"
          label="Estado"
          labelClassName={labelClassName}
          placeholder="Seleccionar estado"
          options={statusOptions}
          value={status || undefined}
          onChange={(val) => setStatus(String(val || ""))}
          className={dropdownClassName}
        />
      </div>

      <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-neutral-700/60">
        <Button
          type="button"
          size="small"
          label="Limpiar"
          icon={<RotateCcw size={14} />}
          onClick={handleReset}
          className="text-[13px]! text-slate-600! dark:text-slate-300! bg-slate-100! dark:bg-slate-700! hover:bg-slate-200! dark:hover:bg-slate-600! rounded-md!"
        />
        <Button
          type="button"
          size="small"
          label="Buscar"
          icon={<Search size={14} />}
          onClick={handleSearch}
          className="text-[13px]! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! hover:bg-alpac-primary-600! rounded-md!"
        />
      </div>
    </div>
  );
}
