import { useState } from "react";
import { Button, Dropdown, InputText, type Option } from "@alpac/design-system";
import {
  dropdownClassName,
  inputClassName,
  labelClassName,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/utils/styles";

interface DescargueFiltersProps {
  onApply: (search: string, status: string) => void;
  onClear: () => void;
}

const statusOptions: Option[] = [
  { value: "all", label: "Todos" },
  { value: "1", label: "Pendiente" },
  { value: "2", label: "En Proceso" },
];

export function DescargueFilters({ onApply, onClear }: DescargueFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const handleSearch = () => {
    onApply(searchTerm.trim(), selectedStatus);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedStatus("all");
    onClear();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col justify-center gap-1">
          <h3 className="p-0! m-0! text-sm sm:text-base font-bold text-slate-800 dark:text-white">
            Filtros
          </h3>
          <small className="text-gray-500 dark:text-gray-300 text-[12px] sm:text-sm leading-snug">
            Filtra las mercancías de descargue por nombre, descripción o estado
          </small>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div className="flex flex-col min-w-0">
          <InputText
            label="Mercancía"
            labelClassName={labelClassName}
            placeholder="Ej. Harina, Maíz..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={inputClassName}
          />
        </div>

        <div className="flex flex-col min-w-0">
          <Dropdown
            appearance="dark"
            label="Estado"
            labelClassName={labelClassName}
            options={statusOptions}
            value={selectedStatus}
            onChange={(val) => setSelectedStatus(String(val || "all"))}
            className={dropdownClassName}
          />
        </div>

        <div className="flex flex-col min-w-0">
          <Button
            type="button"
            size="giant"
            className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
            label="Buscar"
            onClick={handleSearch}
          />
        </div>

        <div className="flex flex-col min-w-0">
          <Button
            type="button"
            size="giant"
            className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
            label="Limpiar"
            onClick={handleReset}
          />
        </div>
      </div>
    </div>
  );
}
