import { useCallback, useEffect, useMemo, useState } from "react";
import {
	Button,
	Checkbox,
	DataTable,
	Modal,
	Pagination,
	RadioButton,
	type TableColumn,
} from "@alpac/design-system";
import type { GetSuppliersResponse } from "@app/modules/purchasing/domain/suppliers/responses/get-suppliers-response";
import type { GetSuppliersRequest } from "@app/modules/purchasing/domain/suppliers/requests/get-suppliers-request";
import {
	quoteFormPrimaryButtonClassName,
	quoteFormSecondaryButtonClassName,
} from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/styles/create-quote-form.styles";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useSuppliers } from "@app/modules/purchasing/ui/hooks/suppliers/useSuppliers";
import { Loader } from "@app/shared/components/loaders/loader";

type SelectSupplierModalProps = {
	isOpen: boolean;
	selectionType?: "single" | "multiple";
	excludeSupplierIds?: string[];
	onClose: () => void;
	onSelect: (suppliers: GetSuppliersResponse[]) => void;
};

const PAGE_SIZE = 5;

export function SelectSupplierModal({
	isOpen,
	onClose,
	onSelect,
	selectionType = "single",	
}: SelectSupplierModalProps) {
	const { companyId, moduleCode } = useUserStore();

	const [error, setError] = useState("");
	const [pageNumber, setPageNumber] = useState(1);
	const [tempSelected, setTempSelected] = useState<GetSuppliersResponse | null>(
		null,
	);
	const [tempSelectedMultiple, setTempSelectedMultiple] = useState<
		GetSuppliersResponse[]
	>([]);
	const [filters, setFilters] = useState<GetSuppliersRequest>({
		companie_id: companyId,
		module_code: moduleCode,
		page_number: 1,
		page_size: PAGE_SIZE,
	});

	const { GetSuppliers } = useSuppliers({
		suppliersFilters: filters,
	});

	const registeredSuppliers = useMemo(() => {
		return GetSuppliers.data?.data ?? [];
	}, [GetSuppliers.data?.data]);

	const totalRecords = useMemo(() => {
		return GetSuppliers.data?.total ?? 0;
	}, [GetSuppliers.data]);

	useEffect(() => {
		if (!isOpen) {
			setError("");
			setPageNumber(1);
			setTempSelected(null);
			setTempSelectedMultiple([]);
			return;
		}

		const initial: GetSuppliersRequest = {
			companie_id: companyId,
			module_code: moduleCode,
			page_number: 1,
			page_size: PAGE_SIZE,
		};

		setFilters(initial);
		setPageNumber(1);
	}, [isOpen, companyId, moduleCode]);

	const handlePageChange = useCallback((page: number) => {
		setPageNumber(page);
		setFilters((prev) => ({
			...prev,
			page_number: page,
			page_size: PAGE_SIZE,
		}));
	}, []);

	const handleClose = () => {
		setError("");
		setPageNumber(1);
		setTempSelected(null);
		setTempSelectedMultiple([]);
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
							aria-label={`Seleccionar ${row.supplier_legal_name}`}
						/>
					) : (
						<Checkbox
							name="select-supplier-multiple"
							checked={tempSelectedMultiple.some(
								(item) => item.supplier_id === row.supplier_id,
							)}
							onChange={() => handleToggleMultipleSelection(row)}
							aria-label={`Seleccionar ${row.supplier_legal_name}`}
						/>
					);
				},
			},
			{ key: "supplier_legal_name", label: "Razón Social" },
			{ key: "identification_type", label: "Tipo de Identificación" },
			{ key: "identification_number", label: "Número de Identificación" },
			{ key: "constitution_type", label: "Tipo de Constitución" },
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
				{error ? (
					<p className="m-0 text-sm text-red-500 dark:text-red-400">{error}</p>
				) : null}

				<DataTable
					title={`Proveedores ${selectedCountText}`}
					data={registeredSuppliers}
					columns={columnConfig}
					pagination={
						<Pagination
							currentPage={pageNumber}
							pageSize={PAGE_SIZE}
							totalRecords={totalRecords}
							onPageChange={handlePageChange}
						/>
					}
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
