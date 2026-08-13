import { useEffect, useMemo, useState } from "react";
import {
	Alert,
	Button,
	Checkbox,
	DataTable,
	InputText,
	Modal,
	RadioButton,
	type TableColumn,
} from "@alpac/design-system";
import type {
	SelectableServiceOrder,
	SelectServiceOrderModalProps,
} from "./select-service-order-modal.types";

const primaryButtonClassName =
	"text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!";
const secondaryButtonClassName =
	"text-[15px]! rounded-md! text-slate-500! hover:bg-slate-200! bg-slate-500! dark:bg-slate-700! dark:text-slate-300! dark:hover:bg-slate-600!";
const inputClassName =
	"w-full! sm:w-[500px]! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

const MOCK_SERVICE_ORDERS: SelectableServiceOrder[] = [
	{
		service_order_id: "os-001",
		service_order_code: "OS-2026-001",
		customer_name: "Empresa 1",
		description: "Mantenimiento preventivo de equipos",
		status: "Procesada",
	},
	{
		service_order_id: "os-002",
		service_order_code: "OS-2026-002",
		customer_name: "Empresa 2",
		description: "Reparación de sistema eléctrico",
		status: "En proceso",
	},
	{
		service_order_id: "os-003",
		service_order_code: "OS-2026-003",
		customer_name: "Empresa 3",
		description: "Reparación de sistema fluvial",
		status: "En proceso",
	},
];

export function SelectServiceOrderModal({
	isOpen,
	onClose,
	onSelect,
	selectionType = "single",
}: SelectServiceOrderModalProps) {
	const [error, setError] = useState("");
	const [searchCode, setSearchCode] = useState("");
	const [appliedSearchCode, setAppliedSearchCode] = useState("");
	const [tempSelected, setTempSelected] =
		useState<SelectableServiceOrder | null>(null);
	const [tempSelectedMultiple, setTempSelectedMultiple] = useState<
		SelectableServiceOrder[]
	>([]);

	useEffect(() => {
		if (!isOpen) {
			setError("");
			setSearchCode("");
			setAppliedSearchCode("");
			setTempSelected(null);
			setTempSelectedMultiple([]);
		}
	}, [isOpen]);

	const registeredServiceOrders = useMemo(() => {
		const query = appliedSearchCode.trim().toLowerCase();
		if (!query) return MOCK_SERVICE_ORDERS;

		return MOCK_SERVICE_ORDERS.filter((order) =>
			order.service_order_code.toLowerCase().includes(query),
		);
	}, [appliedSearchCode]);

	const handleClose = () => {
		setError("");
		setSearchCode("");
		setAppliedSearchCode("");
		setTempSelected(null);
		setTempSelectedMultiple([]);
		onClose();
	};

	const handleToggleMultipleSelection = (order: SelectableServiceOrder) => {
		setError("");
		setTempSelectedMultiple((prev) => {
			const alreadySelected = prev.some(
				(item) => item.service_order_id === order.service_order_id,
			);

			if (alreadySelected) {
				return prev.filter(
					(item) => item.service_order_id !== order.service_order_id,
				);
			}

			return [...prev, order];
		});
	};

	const handleConfirm = () => {
		if (selectionType === "multiple") {
			if (tempSelectedMultiple.length === 0) {
				setError("Seleccione al menos una orden de servicio.");
				return;
			}

			onSelect(tempSelectedMultiple);
			handleClose();
			return;
		}

		if (!tempSelected) {
			setError("Seleccione una orden de servicio.");
			return;
		}

		onSelect([tempSelected]);
		handleClose();
	};

	const handleApplyFilters = (evt: React.SubmitEvent<HTMLFormElement>) => {
		evt.preventDefault();
		setAppliedSearchCode(searchCode);
		setError("");
	};

	const handleClearFilters = () => {
		setSearchCode("");
		setAppliedSearchCode("");
		setError("");
	};

	const columnConfig: TableColumn<SelectableServiceOrder>[] = useMemo(
		() => [
			{
				key: "select",
				label: "",
				render: (row) => {
					return selectionType === "single" ? (
						<RadioButton
							name="select-service-order-single"
							disabled={row.status === "Procesada"}
							checked={
								tempSelected?.service_order_id === row.service_order_id
							}
							onChange={() => {
								setError("");
								setTempSelected(row);
							}}
							aria-label={`Seleccionar ${row.service_order_code}`}
						/>
					) : (
						<Checkbox
							name="select-service-order-multiple"
							disabled={row.status === "Procesada"}
							checked={tempSelectedMultiple.some(
								(item) => item.service_order_id === row.service_order_id,
							)}
							onChange={() => handleToggleMultipleSelection(row)}
							aria-label={`Seleccionar ${row.service_order_code}`}
						/>
					);
				},
			},
			{ key: "service_order_code", label: "Código" },
			{ key: "customer_name", label: "Cliente" },
			{ key: "description", label: "Descripción" },
			{ key: "status", label: "Estado" },
		],
		[selectionType, tempSelected, tempSelectedMultiple],
	);

	const isConfirmDisabled =
		registeredServiceOrders.length === 0 ||
		(selectionType === "multiple"
			? tempSelectedMultiple.length === 0
			: !tempSelected);

	const selectedCount =
		selectionType === "multiple"
			? tempSelectedMultiple.length
			: tempSelected
				? 1
				: 0;

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			variant="form"
			size="5xl"
			title="Seleccionar orden de servicio"
			description={
				selectionType === "multiple"
					? "Elija una o más órdenes de servicio para vincularlas a la solicitud."
					: "Elija una orden de servicio para vincularla a la solicitud."
			}
		>

			<div className="flex flex-col gap-4">
				{error ? (
					<p className="m-0 text-sm text-red-500 dark:text-red-400">{error}</p>
				) : null}

				<div className="flex justify-between items-center">
					<div className="flex flex-col justify-center">
						<form
							onSubmit={handleApplyFilters}
							className="flex items-end gap-4"
						>
							<InputText
								label="Filtrar por código"
								placeholder="Ej. OS-2026-001"
								value={searchCode}
								onChange={(event) => setSearchCode(event.target.value)}
								className={inputClassName}
								labelClassName={labelClassName}
							/>

							<div className="flex flex-col">
								<Button
									type="submit"
									size="giant"
									className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
									label="Aplicar filtros"
								/>
							</div>

							<div className="flex flex-col">
								<Button
									type="button"
									size="giant"
									className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
									label="Limpiar filtros"
									onClick={handleClearFilters}
								/>
							</div>
						</form>
					</div>
				</div>

				<DataTable
					title={
						selectedCount > 0
							? `Órdenes de servicio (${selectedCount} ${selectedCount === 1 ? "seleccionada" : "seleccionadas"})`
							: "Órdenes de servicio"
					}
					data={registeredServiceOrders}
					columns={columnConfig}
				/>

				<Alert
					type="info"
					title="Aviso"
					message="Esta funcionalidad se encuentra en desarrollo."
				/>

				<div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
					<Button
						type="button"
						size="giant"
						label="Cancelar"
						className={secondaryButtonClassName}
						onClick={handleClose}
					/>
					<Button
						type="button"
						size="giant"
						label="Agregar a la lista"
						disabled={isConfirmDisabled}
						className={primaryButtonClassName}
						onClick={handleConfirm}
					/>
				</div>
			</div>
		</Modal>
	);
}
