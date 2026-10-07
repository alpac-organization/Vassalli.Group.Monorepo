import { useState } from "react";
import { Button, Dropdown, InputText, type Option } from "@alpac/design-system";
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
			status: (status as OngoingOperationsFilters["status"]) || "",
		});
	};

	const handleReset = () => {
		setCode("");
		setCustomerCif("");
		setStatus("");
		onClear();
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="flex justify-between items-center">
				<div className="flex flex-col justify-center gap-2">
					<h3 className="p-0! m-0!">Filtros</h3>
					<small className="text-gray-500 dark:text-gray-300 text-[12px] sm:text-sm leading-snug">
						Filtra por código PO, CIF de cliente o estado.
					</small>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-end">
				<div className="flex flex-col min-w-0">
					<InputText
						label="Código OP"
						labelClassName={labelClassName}
						placeholder="Ej. ALP-MGA-OP-15"
						value={code}
						onChange={(e) => setCode(e.target.value)}
						className={inputClassName}
					/>
				</div>				

				<div className="flex flex-col min-w-0">
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

				<div className="flex flex-col min-w-0">
					<Button
						type="button"
						size="giant"
						className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
						label="Aplicar filtros"
						onClick={handleSearch}
					/>
				</div>

				<div className="flex flex-col min-w-0">
					<Button
						type="button"
						size="giant"
						className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
						label="Limpiar filtros"
						onClick={handleReset}
					/>
				</div>
			</div>
		</div>
	);
}
