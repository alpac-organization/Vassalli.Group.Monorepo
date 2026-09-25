import { useCallback, useEffect, useMemo, useState } from "react";
import {
	Button,
	Checkbox,
	ContextMenu,
	DataTable,
	Dropdown,
	InputText,
	Modal,
	Pagination,
	RadioButton,
	type TableColumn,
} from "@alpac/design-system";
import type { GetSuppliersResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/get-suppliers-response";
import type { GetSuppliersRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/get-suppliers-request";
import {
	quoteFormPrimaryButtonClassName,
	quoteFormSecondaryButtonClassName,
} from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/styles/create-quote-form.styles";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useSupplier } from "@app/modules/purchasing/ui/hooks/supplier/useSupplier";
import { Loader } from "@app/shared/components/loaders/loader";
import { Controller, useForm } from "react-hook-form";
import {
	ConstitutionEnum,
	ConstitutionOptions,
} from "@app/core/enums/constitution.enum";
import {
	formatIdentificationNumber,
	formatRuc,
} from "@app/shared/utils/string.utils";
import type { SelectSupplierModalProps } from "./select-supplier-modal.types";
import { isValidateValue } from "@app/shared/utils/values.utils";
import { inputClassName, labelClassName, dropdownClassName } from "@app/modules/purchasing/ui/pages/supplier/utils/style";
import { SupplierDetailsModal } from "@app/modules/purchasing/ui/pages/supplier/components/supplier-details-modal/supplier-details-modal";

const PAGE_SIZE = 5;

const contextMenuButton =
	"rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";

export function SelectSupplierModal({
	isOpen,
	onClose,
	onSelect,
	selectionType = "single",
}: SelectSupplierModalProps) {
	const { companyId, moduleCode } = useUserStore();

	const buildBaseFilters = (): GetSuppliersRequest => ({
		company_id: companyId,
		module_code: moduleCode,
		page_number: 1,
		page_size: PAGE_SIZE,
	});

	const defaultFilters: Pick<
		GetSuppliersRequest,
		"identification_number" | "constitution_type" | "commercial_name"
	> = {
		identification_number: "",
		constitution_type: undefined,
		commercial_name: "",
	};

	const [error, setError] = useState("");
	const [tempSelected, setTempSelected] = useState<GetSuppliersResponse | null>(null);
	const [tempSelectedMultiple, setTempSelectedMultiple] = useState<GetSuppliersResponse[]>([]);
	const [filters, setFilters] = useState<GetSuppliersRequest>(buildBaseFilters);
	const [isSupplierDetailsModalOpen, setIsSupplierDetailsModalOpen] = useState(false);
	const [selectedSupplier, setSelectedSupplier] = useState<GetSuppliersResponse | null>(null);

	const { register, handleSubmit, control, reset, watch } =
		useForm<GetSuppliersRequest>({
			defaultValues: { ...defaultFilters },
		});

	const { GetSuppliers } = useSupplier({
		suppliersFilters: {
			...filters,
			company_id: companyId,
			module_code: moduleCode,
			page_size: PAGE_SIZE,
		},
	});

	const constitutionType = watch("constitution_type");
	const isLegalPerson = constitutionType === ConstitutionEnum.Legal.value;
	const isNaturalPerson = constitutionType === ConstitutionEnum.Natural.value;

	const registeredSuppliers = useMemo(() => {
		return GetSuppliers.data?.data ?? [];
	}, [GetSuppliers.data?.data]);

	const totalRecords = GetSuppliers.data?.total_records ?? GetSuppliers.data?.total ?? 0;
	const currentPage = filters.page_number ?? 1;

	useEffect(() => {
		if (!isOpen) {
			setError("");
			setTempSelected(null);
			setTempSelectedMultiple([]);
			reset(defaultFilters);
			return;
		}

		reset(defaultFilters);
		setFilters(buildBaseFilters());
	}, [isOpen, companyId, moduleCode, reset]);

	const handleClearFilters = () => {
		reset(defaultFilters);
		setFilters(buildBaseFilters());
	};

	const handlePageChange = useCallback((page: number) => {
		setFilters((prev) => ({
			...prev,
			page_number: page,
		}));
	}, []);

	const handleFilterSuppliers = (data: GetSuppliersRequest) => {
		const identification = data?.identification_number?.trim() || undefined;
		const commercialName = data?.commercial_name?.trim() || undefined;
		const constitutionType =
			data.constitution_type === undefined ||
				data.constitution_type === null ||
				Number(data.constitution_type) === -1
				? undefined
				: Number(data.constitution_type);

		setFilters((prev) => ({
			...prev,
			page_number: 1,
			identification_number: identification,
			commercial_name: commercialName,
			constitution_type: constitutionType,
		}));
	};

	const handleClose = () => {
		setError("");
		setTempSelected(null);
		setTempSelectedMultiple([]);
		reset(defaultFilters);
		setFilters(buildBaseFilters());
		onClose();
	};

	const handleToggleMultipleSelection = (supplier: GetSuppliersResponse) => {
		setError("");
		setTempSelectedMultiple((prev) => {
			const alreadySelected = prev.some(
				(item) => item.supplier_id === supplier.supplier_id,
			);

			if (alreadySelected) {
				return prev.filter(
					(item) => item.supplier_id !== supplier.supplier_id,
				);
			}

			return [...prev, supplier];
		});
	};

	const handleConfirm = () => {
		if (selectionType === "multiple") {
			if (tempSelectedMultiple.length === 0) {
				setError("Seleccione al menos un proveedor registrado.");
				return;
			}

			onSelect(tempSelectedMultiple);
			handleClose();
			return;
		}

		if (!tempSelected) {
			setError("Seleccione un proveedor registrado.");
			return;
		}

		onSelect([tempSelected]);
		handleClose();
	};

	const columnConfig: TableColumn<GetSuppliersResponse>[] = useMemo(
		() => [
			{
				key: "select",
				label: "",
				render: (row) => {
					return selectionType === "single" ? (
						<RadioButton
							name="select-supplier-single"
							checked={tempSelected?.supplier_id === row.supplier_id}
							onChange={() => {
								setError("");
								setTempSelected(row);
							}}							
							aria-label={`Seleccionar ${row?.supplier_legal_name ?? ""}`}
						/>
					) : (
						<Checkbox
							name="select-supplier-multiple"
							checked={tempSelectedMultiple.some(
								(item) => item.supplier_id === row.supplier_id,
							)}
							onChange={() => handleToggleMultipleSelection(row)}							
							aria-label={`Seleccionar ${row?.supplier_legal_name ?? ""}`}
						/>
					);
				},
			},
			{
				key: "supplier_legal_name",
				label: "Razón Social / Nombre Comercial",
				render: (row) => {					
					const legal = row?.supplier_legal_name ?? "—";
					const comm = row?.commercial_name?.trim();
					return (
						<div className="flex flex-col">
							<span className="font-medium text-slate-900 dark:text-white">
								{legal}
							</span>
							{comm && (
								<span className="text-xs text-slate-500 dark:text-slate-400">
									{comm}
								</span>
							)}
						</div>
					);
				},
			},
			{ key: "identification_type", label: "Tipo de Identificación" },
			{ key: "identification_number", label: "Número de Identificación" },
			{ key: "constitution_type", label: "Tipo de Constitución" },
			{
				key: "actions",
				label: "Acciones",
				render: (row: GetSuppliersResponse) => (
					<ContextMenu
						items={[
							{
								label: "Ver detalle", onClick: () => {
									setIsSupplierDetailsModalOpen(true);
									setSelectedSupplier(row);
								}
							},
						]}
						triggerClassName={contextMenuButton}
					/>
				),
			},
		],
		[selectionType, tempSelected, tempSelectedMultiple],
	);

	const isLoadingSuppliers = GetSuppliers.isPending || GetSuppliers.isFetching;

	const hasSelectedSuppliers =
		selectionType === "multiple"
			? tempSelectedMultiple.length === 0
			: !tempSelected;

	const isConfirmDisabled =
		isLoadingSuppliers ||
		registeredSuppliers.length === 0 ||
		hasSelectedSuppliers;

	const selectedCount =
		selectionType === "multiple"
			? tempSelectedMultiple.length
			: tempSelected
				? 1
				: 0;

	const selectedCountText = useMemo(() => {
		return selectedCount > 0
			? `(${selectedCount} ${selectedCount === 1 ? "seleccionado)" : "seleccionados)"}`
			: "";
	}, [selectedCount]);

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			variant="form"
			size="5xl"
			title="Seleccionar proveedor"
			description={
				selectionType === "multiple"
					? "Elija uno o más proveedores registrados para agregarlos a la cotización."
					: "Elija un proveedor registrado para agregarlo a la cotización."
			}
		>
			{isLoadingSuppliers && <Loader title="Cargando proveedores..." />}

			<div className="flex flex-col gap-6">
				<form
					onSubmit={handleSubmit(handleFilterSuppliers)}
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
				>
					<Controller
						name="constitution_type"
						control={control}
						render={({ field }) => (
							<Dropdown
								label="Tipo de constitución"
								placeholder="Seleccione..."
								appearance="dark"
								options={ConstitutionOptions ?? []}
								value={field.value ?? null}
								onChange={(value) => {
									const parsed = !isValidateValue(value) ? undefined : Number(value);
									field.onChange(
										parsed === -1 || Number.isNaN(parsed)
											? undefined
											: parsed,
									);
								}}
								className={dropdownClassName}
								labelClassName={labelClassName}
								valueClassName={labelClassName}
							/>
						)}
					/>

					<InputText
						label="Nombre comercial"
						placeholder="Ej. DIMAC"
						className={inputClassName}
						labelClassName={labelClassName}
						{...register("commercial_name")}
					/>

					<InputText
						label="Identificación"
						placeholder="Ej. J0310000000001"
						className={inputClassName}
						labelClassName={labelClassName}
						{...register("identification_number", {
							setValueAs: (value: string) =>
								value
									? value.toString().replace(/-/g, "").toUpperCase()
									: "",
							onChange: (evt) => {
								if (isLegalPerson) {
									evt.target.value = formatRuc(evt.target.value);
								} else if (isNaturalPerson) {
									evt.target.value = formatIdentificationNumber(
										evt.target.value,
									);
								}
							},
						})}
					/>

					<div className="flex gap-2">
						<Button
							type="submit"
							size="giant"
							label="Filtrar"
							className="w-full! rounded-md! bg-alpac-primary-500! text-[15px]! text-white! dark:bg-alpac-primary-700!"
						/>

						<Button
							type="button"
							size="giant"
							label="Limpiar"
							onClick={handleClearFilters}
							className="w-full! rounded-md! bg-slate-500! text-[15px]! text-white! dark:bg-slate-700!"
						/>
					</div>
				</form>

				{error ? (
					<p className="m-0 text-sm text-red-500 dark:text-red-400">{error}</p>
				) : null}

				<DataTable
					title={`Proveedores ${selectedCountText}`}
					data={registeredSuppliers}
					columns={columnConfig}
					pagination={
						<Pagination
							currentPage={currentPage}
							pageSize={PAGE_SIZE}
							totalRecords={totalRecords}
							onPageChange={handlePageChange}
							disabled={GetSuppliers.isFetching}
						/>
					}
				/>

				<SupplierDetailsModal
					isOpen={isSupplierDetailsModalOpen}
					onClose={() => setIsSupplierDetailsModalOpen(false)}
					selectedSupplier={selectedSupplier}
				/>

				<div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
					<Button
						type="button"
						size="giant"
						label="Cancelar"
						className={quoteFormSecondaryButtonClassName}
						onClick={handleClose}
					/>
					<Button
						type="button"
						size="giant"
						label="Agregar a la lista"
						disabled={isConfirmDisabled}
						className={quoteFormPrimaryButtonClassName}
						onClick={handleConfirm}
					/>
				</div>
			</div>
		</Modal>
	);
}
