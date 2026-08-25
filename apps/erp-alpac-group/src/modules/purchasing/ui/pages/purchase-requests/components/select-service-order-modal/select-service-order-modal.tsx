import { useCallback, useEffect, useState } from "react";
import {
	Badges,
	Button,
	Checkbox,
	DataTable,
	InputText,
	Modal,
	Pagination,
	RadioButton,
	type TableColumn,
} from "@alpac/design-system";
import type { SelectServiceOrderModalProps } from "./select-service-order-modal.types";
import { useServiceOrder } from "@app/modules/warehouse/ui/hooks/useServiceOrder";
import { useUserStore } from "@app/shared/stores/useUserStore";
import type { GetServiceOrdersResponse } from "@app/modules/service-order/domain/ApiContract/Responses/service-order-responses/get-service-orders.response";
import type { GetServiceOrdersRequest } from "@app/modules/service-order/domain/ApiContract/Requests/service-order-requests/get-service-orders.request";
import { Loader } from "@app/shared/components/loaders/loader";
import { ServiceOrderStatusEnum, type ServiceOrderStatusType } from "@app/modules/service-order/domain/enums/service-order-status.enum";
import { serviceOrderStatusBadgeVariants } from "@app/modules/service-order/ui/service-order.variants";

const PAGE_SIZE = 5;
const primaryButtonClassName =
	"text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!";
const secondaryButtonClassName =
	"text-[15px]! rounded-md! text-slate-500! hover:bg-slate-200! bg-slate-500! dark:bg-slate-700! dark:text-slate-300! dark:hover:bg-slate-600!";
const inputClassName =
	"w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

export function SelectServiceOrderModal({
	isOpen,
	onClose,
	onSelect,
	selectionType = "single",
}: SelectServiceOrderModalProps) {
	const { companyId, moduleCode } = useUserStore();

	const buildBaseFilters = (): GetServiceOrdersRequest => ({
		company_id: companyId,
		module_code: moduleCode,
		page_number: 1,
		page_size: PAGE_SIZE,
	});

	const [error, setError] = useState("");
	const [searchCode, setSearchCode] = useState("");
	const [searchCif, setSearchCif] = useState("");
	const [filters, setFilters] = useState<GetServiceOrdersRequest>(buildBaseFilters);
	const [tempSelected, setTempSelected] = useState<GetServiceOrdersResponse | null>(null);
	const [tempSelectedMultiple, setTempSelectedMultiple] = useState<GetServiceOrdersResponse[]>([]);

	const { GetServiceOrders } = useServiceOrder({
		getServiceOrdersPayload: isOpen
			? {
				...filters,
				company_id: companyId,
				module_code: moduleCode,
				page_size: PAGE_SIZE,
			}
			: undefined,
	});

	const registeredServiceOrders = GetServiceOrders.data?.data ?? [];
	const totalRecords = GetServiceOrders.data?.total ?? 0;
	const currentPage = filters.page_number ?? 1;

	useEffect(() => {
		if (!isOpen) {
			setError("");
			setSearchCode("");
			setSearchCif("");
			setTempSelected(null);
			setTempSelectedMultiple([]);
			return;
		}

		setFilters(buildBaseFilters());
	}, [isOpen, companyId, moduleCode]);

	const handleClose = () => {
		setError("");
		setSearchCode("");
		setSearchCif("");
		setTempSelected(null);
		setTempSelectedMultiple([]);
		setFilters(buildBaseFilters());
		onClose();
	};

	const handleApplyFilters = () => {
		setError("");
		setFilters((prev) => ({
			...prev,
			code: searchCode.trim() || undefined,
			cif: searchCif.trim() || undefined,
			page_number: 1,
		}));
	};

	const handleClearFilters = () => {
		setSearchCode("");
		setSearchCif("");
		setError("");
		setFilters(buildBaseFilters());
	};

	const handlePageChange = useCallback((page: number) => {
		setFilters((prev) => ({
			...prev,
			page_number: page,
		}));
	}, []);

	const handleToggleMultipleSelection = (order: GetServiceOrdersResponse) => {
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

	const columnConfig: TableColumn<GetServiceOrdersResponse>[] =
		[
			{
				key: "select",
				label: "",
				render: (row: GetServiceOrdersResponse) => {
					return selectionType === "single" ? (
						<RadioButton
							name="select-service-order-single"
							checked={tempSelected?.service_order_id === row.service_order_id}
							onChange={() => {
								setError("");
								setTempSelected(row);
							}}
							aria-label={`Seleccionar ${row.code}`}
						/>
					) : (
						<Checkbox
							name="select-service-order-multiple"
							checked={tempSelectedMultiple.some(
								(item) => item.service_order_id === row.service_order_id,
							)}
							onChange={() => handleToggleMultipleSelection(row)}
							aria-label={`Seleccionar ${row.code}`}
						/>
					);
				},
			},
			{ key: "code", label: "Código" },
			{
				key: "customer",
				label: "Cliente",
				render: (row: GetServiceOrdersResponse) => row.customer?.legal_name ?? "—",
			},
			{
				key: "cif",
				label: "CIF",
				render: (row: GetServiceOrdersResponse) => row.customer?.cif ?? "—",
			},
			{
				key: "observations",
				label: "Observaciones",
				render: (row: GetServiceOrdersResponse) => row.observations?.trim() || "—",
			},
			{
				key: "status",
				label: "Estado",
				render: (row: GetServiceOrdersResponse) => {

					const statusItem = Object.values(ServiceOrderStatusEnum)
						.find((status) => status.textValue === row.status as ServiceOrderStatusType);

					const statusKey = statusItem?.textValue ?? "default";

					const variant = serviceOrderStatusBadgeVariants[
						statusKey as keyof typeof serviceOrderStatusBadgeVariants
					] ?? serviceOrderStatusBadgeVariants.default;

					return (
						<Badges
							label={statusItem?.label ?? variant.label ?? "—"}
							color={variant.badgeColor}
						/>
					);
				},
			},
		] satisfies TableColumn<GetServiceOrdersResponse>[];

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
			size="6xl"
			title="Seleccionar orden de servicio"
			description={
				selectionType === "multiple"
					? "Elija una o más órdenes de servicio para vincularlas a la solicitud."
					: "Elija una orden de servicio para vincularla a la solicitud."
			}
		>
			{(GetServiceOrders.isPending || GetServiceOrders.isFetching) && (
				<Loader title="Cargando órdenes de servicio..." />
			)}

			<div className="flex flex-col gap-4">
				{error ? (
					<p className="m-0 text-sm text-red-500 dark:text-red-400">{error}</p>
				) : null}

				<form
					onSubmit={handleApplyFilters}
					className="grid grid-cols-4 gap-4 items-end"
				>
					<InputText
						label="Filtrar por código"
						placeholder="Ej. OS-2026-001"
						value={searchCode}
						onChange={(event) => setSearchCode(event.target.value)}
						className={inputClassName}
						labelClassName={labelClassName}
					/>

					<InputText
						label="Filtrar por CIF"
						placeholder="Ej. J0310000000000"
						value={searchCif}
						onChange={(event) => setSearchCif(event.target.value)}
						className={inputClassName}
						labelClassName={labelClassName}
					/>

					<Button
						type="submit"
						size="giant"
						className="w-full! sm:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
						label="Aplicar filtros"
					/>

					<Button
						type="button"
						size="giant"
						className="w-full! sm:w-auto! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
						label="Limpiar filtros"
						onClick={handleClearFilters}
					/>
				</form>

				<DataTable
					title={
						selectedCount > 0
							? `Órdenes de servicio (${selectedCount} ${selectedCount === 1 ? "seleccionada" : "seleccionadas"})`
							: "Órdenes de servicio"
					}
					data={registeredServiceOrders}
					columns={columnConfig}
					pagination={
						<Pagination
							currentPage={currentPage}
							pageSize={PAGE_SIZE}
							totalRecords={totalRecords}
							onPageChange={handlePageChange}
							disabled={GetServiceOrders.isFetching}
						/>
					}
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
