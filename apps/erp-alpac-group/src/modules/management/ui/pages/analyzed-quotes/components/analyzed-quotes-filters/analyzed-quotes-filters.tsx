import { Button, Dropdown } from "@alpac/design-system";
import { useMemo, useState } from "react";
import {
	ManagementReviewStatus,
	ManagementReviewStatusOptions,
	type managementReviewStatusType,
} from "@app/modules/management/domain/enum/management-review-status";
import type { AnalyzedQuotesFiltersProps } from "./analyzed-quotes-filters.types";
import { dropdownClassName, labelClassName } from "./utils/styles";
import { useAreas } from "@app/modules/admin/ui/hooks/areas/useAreas";
import { useCompanies } from "@app/modules/auth/ui/hooks/useCompanies";
import { useUserStore } from "@app/shared/stores/useUserStore";

const resolveStatus = (value: string | number): managementReviewStatusType | "" => {
	if (value === "" || value == null) return "";
	return (
		ManagementReviewStatusOptions.find((option) => option.value === value)
			?.value ?? ManagementReviewStatus.Pending.textValue
	);
};

export function AnalyzedQuotesFilters({
	onApply,
	onClear,
}: AnalyzedQuotesFiltersProps) {
	const { companyId, moduleCode } = useUserStore();
	const [selectedStatus, setSelectedStatus] = useState<string>("");
	const [selectedAreaId, setSelectedAreaId] = useState<string>("");
	const [selectedBranchId, setSelectedBranchId] = useState<string>("");

	const { GetAreasByCompany } = useAreas({
		company_id: companyId ?? "",
		module_code: moduleCode ?? "",
	});
	const { GetBranchesQuery } = useCompanies({ company_id: companyId });

	const areaOptions = useMemo(
		() =>
			(GetAreasByCompany.data ?? []).map((area) => ({
				label: area.work_area_name,
				value: area.work_area_id,
			})),
		[GetAreasByCompany.data],
	);

	const branchOptions = useMemo(
		() =>
			(GetBranchesQuery.data ?? []).map((branch) => ({
				label: branch.branch_name,
				value: branch.branch_id,
			})),
		[GetBranchesQuery.data],
	);

	const handleClear = () => {
		setSelectedStatus("");
		setSelectedAreaId("");
		setSelectedBranchId("");
		onClear();
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="flex justify-between items-center">
				<div className="flex flex-col justify-center gap-2">
					<h3 className="p-0! m-0!">Filtros</h3>
					<small className="text-gray-500 dark:text-gray-300 text-[12px] sm:text-sm leading-snug">
						Filtra las cotizaciones analizadas por estado, área y sucursal.
					</small>
				</div>
			</div>

			<form
				onSubmit={(event) => {
					event.preventDefault();
					onApply({
						status: (selectedStatus || "") as managementReviewStatusType | "",
						area_id: selectedAreaId,
						branch_id: selectedBranchId,
					});
				}}
				className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end"
			>
				<div className="flex flex-col min-w-0">
					<Dropdown
						appearance="dark"
						label="Estado"
						placeholder="Seleccione un estado"
						options={ManagementReviewStatusOptions}
						value={selectedStatus}
						onChange={(value) => setSelectedStatus(resolveStatus(value))}
						labelClassName={labelClassName}
						valueClassName={labelClassName}
						className={`${dropdownClassName} h-[42px]! sm:h-[46px]!`}
					/>
				</div>

				<div className="flex flex-col min-w-0">
					<Dropdown
						appearance="dark"
						label="Área"
						placeholder="Seleccione un área"
						options={areaOptions}
						value={selectedAreaId}
						onChange={(value) => setSelectedAreaId(String(value ?? ""))}
						labelClassName={labelClassName}
						valueClassName={labelClassName}
						className={`${dropdownClassName} h-[42px]! sm:h-[46px]!`}
					/>
				</div>

				<div className="flex flex-col min-w-0">
					<Dropdown
						appearance="dark"
						label="Sucursal"
						placeholder="Seleccione una sucursal"
						options={branchOptions}
						value={selectedBranchId}
						onChange={(value) => setSelectedBranchId(String(value ?? ""))}
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
