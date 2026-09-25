import { useCallback, useEffect, useMemo, useState } from "react";
import {
	Badges,
	Button,
	DataTable,
	InputText,
	Modal,
	Pagination,
	RadioButton,
	type TableColumn,
} from "@alpac/design-system";
import type { SelectOperationalOrderModalProps } from "./select-operational-order-modal.types";
import {
	mockOperationalOrders,
	mockServiceOrdersByOp,
	type OperationalOrder,
} from "../../utils/mock-operational-orders";
import type { GetServiceOrdersResponse } from "@app/modules/service-order/domain/ApiContract/Responses/service-order-responses/get-service-orders.response";
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

export function SelectOperationalOrderModal({
	isOpen,
	onClose,
	onSelect,
	onCheckOsSelection,
}: SelectOperationalOrderModalProps) {
	// Step 1: Select OP, Step 2: Select OS
	const [step, setStep] = useState<1 | 2>(1);
	
	// Step 1 State
	const [searchOpCode, setSearchOpCode] = useState("");
	const [searchClientCode, setSearchClientCode] = useState("");
	const [opPage, setOpPage] = useState(1);
	const [selectedOp, setSelectedOp] = useState<OperationalOrder | null>(null);
	const [opError, setOpError] = useState("");

	// Step 2 State
	const [searchOsCode, setSearchOsCode] = useState("");
	const [osPage, setOsPage] = useState(1);
	const [selectedOs, setSelectedOs] = useState<GetServiceOrdersResponse | null>(null);
	const [osError, setOsError] = useState("");

	useEffect(() => {
		if (!isOpen) {
			setStep(1);
			setSearchOpCode("");
			setSearchClientCode("");
			setOpPage(1);
			setSelectedOp(null);
			setOpError("");

			setSearchOsCode("");
			setOsPage(1);
			setSelectedOs(null);
			setOsError("");
		}
	}, [isOpen]);

	// --- Step 1 Logic (OP) ---
	const filteredOps = useMemo(() => {
		return mockOperationalOrders.filter((op) => {
			const matchCode = searchOpCode ? op.code.toLowerCase().includes(searchOpCode.toLowerCase()) : true;
			const matchClient = searchClientCode ? op.clientCode.toLowerCase().includes(searchClientCode.toLowerCase()) : true;
			return matchCode && matchClient;
		});
	}, [searchOpCode, searchClientCode]);

	const paginatedOps = useMemo(() => {
		const start = (opPage - 1) * PAGE_SIZE;
		return filteredOps.slice(start, start + PAGE_SIZE);
	}, [filteredOps, opPage]);

	const handleNextStep = useCallback(() => {
		if (!selectedOp) {
			setOpError("Seleccione una orden operativa.");
			return;
		}

		const osList = mockServiceOrdersByOp[selectedOp.id] || [];
		if (osList.length === 0) {
			setOpError("Usted no puede seguir con el proceso de registrar requisición para el flujo operativo debido a que no existe ninguna OS asociada a esta OP, seleccione otra OP (a ver si hay OS asociada a esa otra OP) o intente mas tarde.");
			return;
		}

		setOpError("");
		setStep(2);
	}, [selectedOp]);

	const opColumns: TableColumn<OperationalOrder>[] = [
		{
			key: "select",
			label: "",
			render: (row: OperationalOrder) => (
				<RadioButton
					name="select-op"
					checked={selectedOp?.id === row.id}
					onChange={() => {
						setOpError("");
						setSelectedOp(row);
					}}
					aria-label={`Seleccionar ${row.code}`}
				/>
			),
		},
		{ key: "code", label: "Código OP" },
		{ key: "clientCode", label: "Código Cliente" },
	];

	// --- Step 2 Logic (OS) ---
	const availableOsList = useMemo(() => {
		if (!selectedOp) return [];
		return mockServiceOrdersByOp[selectedOp.id] || [];
	}, [selectedOp]);

	const filteredOsList = useMemo(() => {
		return availableOsList.filter((os) => {
			return searchOsCode ? os.code.toLowerCase().includes(searchOsCode.toLowerCase()) : true;
		});
	}, [availableOsList, searchOsCode]);

	const paginatedOsList = useMemo(() => {
		const start = (osPage - 1) * PAGE_SIZE;
		return filteredOsList.slice(start, start + PAGE_SIZE);
	}, [filteredOsList, osPage]);

	const handleConfirm = useCallback(() => {
		if (!selectedOs) {
			setOsError("Seleccione una orden de servicio.");
			return;
		}

		if (onCheckOsSelection && onCheckOsSelection(selectedOs.service_order_id)) {
			setOsError("Esta Orden de Servicio ya ha sido seleccionada en otra requisición.");
			return;
		}

		onSelect(selectedOp!.id, selectedOs);
		onClose();
	}, [selectedOs, selectedOp, onCheckOsSelection, onSelect, onClose]);

	const osColumns: TableColumn<GetServiceOrdersResponse>[] = [
		{
			key: "select",
			label: "",
			render: (row: GetServiceOrdersResponse) => (
				<RadioButton
					name="select-os"
					checked={selectedOs?.service_order_id === row.service_order_id}
					onChange={() => {
						setOsError("");
						setSelectedOs(row);
					}}
					aria-label={`Seleccionar ${row.code}`}
				/>
			),
		},
		{ key: "code", label: "Código OS" },
		{
			key: "customer",
			label: "Cliente",
			render: (row: GetServiceOrdersResponse) => row.customer?.legal_name ?? "—",
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
	];

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			variant="form"
			size="6xl"
			title={step === 1 ? "Seleccionar Orden Operativa" : `Seleccionar Orden de Servicio para ${selectedOp?.code}`}
			description={
				step === 1
					? "Elija una Orden Operativa (OP) para vincularla a la solicitud."
					: "Elija una Orden de Servicio (OS) asociada a la OP seleccionada."
			}
		>
			<div className="flex flex-col gap-4">
				{step === 1 ? (
					// STEP 1 UI
					<div className="flex flex-col gap-4">
						{opError && (
							<p className="m-0 text-sm text-red-500 dark:text-red-400">{opError}</p>
						)}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
							<InputText
								label="Filtrar por código OP"
								placeholder="Ej. OP-2026-001"
								value={searchOpCode}
								onChange={(e) => setSearchOpCode(e.target.value)}
								className={inputClassName}
								labelClassName={labelClassName}
							/>
							<InputText
								label="Filtrar por código Cliente"
								placeholder="Ej. CLI-001"
								value={searchClientCode}
								onChange={(e) => setSearchClientCode(e.target.value)}
								className={inputClassName}
								labelClassName={labelClassName}
							/>
						</div>

						<DataTable
							title="Órdenes Operativas"
							data={paginatedOps}
							columns={opColumns}
							pagination={
								<Pagination
									currentPage={opPage}
									pageSize={PAGE_SIZE}
									totalRecords={filteredOps.length}
									onPageChange={setOpPage}
								/>
							}
						/>

						<div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
							<Button
								type="button"
								size="giant"
								label="Cancelar"
								className={secondaryButtonClassName}
								onClick={onClose}
							/>
							<Button
								type="button"
								size="giant"
								label="Siguiente"
								disabled={!selectedOp}
								className={primaryButtonClassName}
								onClick={handleNextStep}
							/>
						</div>
					</div>
				) : (
					// STEP 2 UI
					<>
						{osError && (
							<p className="m-0 text-sm text-red-500 dark:text-red-400">{osError}</p>
						)}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
							<InputText
								label="Filtrar por código OS"
								placeholder="Ej. OS-2026-001"
								value={searchOsCode}
								onChange={(e) => setSearchOsCode(e.target.value)}
								className={inputClassName}
								labelClassName={labelClassName}
							/>
						</div>

						<DataTable
							title="Órdenes de Servicio"
							data={paginatedOsList}
							columns={osColumns}
							pagination={
								<Pagination
									currentPage={osPage}
									pageSize={PAGE_SIZE}
									totalRecords={filteredOsList.length}
									onPageChange={setOsPage}
								/>
							}
						/>

						<div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
							<Button
								type="button"
								size="giant"
								label="Atrás"
								className={secondaryButtonClassName}
								onClick={() => {
									setStep(1);
									setOsError("");
									setSelectedOs(null);
								}}
							/>
							<Button
								type="button"
								size="giant"
								label="Agregar a la lista"
								disabled={!selectedOs}
								className={primaryButtonClassName}
								onClick={handleConfirm}
							/>
						</div>
					</>
				)}
			</div>
		</Modal>
	);
}