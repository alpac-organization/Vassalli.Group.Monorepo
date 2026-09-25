import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
	Button,
	DatePicker,
	Dropdown,
	InputText,
	SectionHeader,
} from "@alpac/design-system";
import { PurchaseRequestStatusOptions } from "@app/modules/purchasing/domain/enums/purchase-request-status.enum";
import { useAreas } from "@app/modules/admin/ui/hooks/areas/useAreas";
import { useUserStore } from "@app/shared/stores/useUserStore";
import type {
	PurchaseRequestFilterForm,
	PurchaseRequestFiltersProps,
} from "./purchase-request-filters.types";

const inputClassName =
	"w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const dropdownClassName =
	"w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";
const labelClassName = "text-black! dark:text-white!";

const defaultFilterForm: PurchaseRequestFilterForm = {
	code: "",
	status: null,
	date: null,
	area_id: null,
};

export const PurchaseRequestFilters = ({
	codeLabel,
	codePlaceholder,
	isAdministrator,
	currentBranchId,
	onApplyFilters,
	onClearFilters,
}: PurchaseRequestFiltersProps) => {
	const { companyId, moduleCode } = useUserStore();
	const { register, control, handleSubmit, reset } = useForm<PurchaseRequestFilterForm>({
		defaultValues: defaultFilterForm,
	});

	const { GetAreasByCompany } = useAreas({
		company_id: isAdministrator ? companyId : "",
		module_code: moduleCode ?? "",
	});

	const areaOptions = (GetAreasByCompany.data ?? []).map((area) => ({
		label: area.work_area_name,
		value: area.work_area_id,
	}));

	useEffect(() => {
		reset(defaultFilterForm);
	}, [currentBranchId, companyId, moduleCode, reset]);

	const handleClear = () => {
		reset(defaultFilterForm);
		onClearFilters();
	};

	return (
		<>
			<div className="flex justify-between items-center pt-4 pb-4 border-t border-t-slate-600 dark:border-t-neutral-600">
				<div className="flex flex-col justify-center">
					<SectionHeader
						title="Filtros"
						subtitle="Refina los resultados según tus preferencias"
					/>
				</div>
			</div>

			<form
				onSubmit={handleSubmit(onApplyFilters)}
				className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-end mb-4!"
			>
				<InputText
					label={codeLabel}
					placeholder={codePlaceholder}
					className={inputClassName}
					labelClassName={labelClassName}
					{...register("code")}
				/>

				<Controller
					control={control}
					name="status"
					render={({ field }) => (
						<Dropdown
							label="Estado"
							placeholder="Seleccione..."
							appearance="dark"
							options={PurchaseRequestStatusOptions ?? []}
							value={field.value}
							onChange={(value) => field.onChange(value)}
							className={dropdownClassName}
							labelClassName={labelClassName}
							valueClassName={labelClassName}
						/>
					)}
				/>

				<Controller
					control={control}
					name="date"
					render={({ field }) => (
						<DatePicker
							label="Mes"
							labelAbove
							views={["year", "month"]}
							openTo="month"
							format="MMMM YYYY"
							disableFuture
							className={inputClassName}
							value={field.value}
							onChange={(value) => field.onChange(value)}
							slotProps={{
								popper: {
									disablePortal: false,
									sx: { zIndex: 2000 },
								},
							}}
						/>
					)}
				/>

				{isAdministrator ? (
					<Controller
						control={control}
						name="area_id"
						render={({ field }) => (
							<Dropdown
								label="Área"
								placeholder="Seleccione un área"
								appearance="dark"
								options={areaOptions}
								value={field.value}
								onChange={(value) => field.onChange(value)}
								className={dropdownClassName}
								labelClassName={labelClassName}
								valueClassName={labelClassName}
							/>
						)}
					/>
				) : null}

				<Button
					type="submit"
					size="giant"
					label="Aplicar filtros"
					className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
				/>

				<Button
					type="button"
					size="giant"
					label="Limpiar filtros"
					onClick={handleClear}
					className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
				/>
			</form>
		</>
	);
};
