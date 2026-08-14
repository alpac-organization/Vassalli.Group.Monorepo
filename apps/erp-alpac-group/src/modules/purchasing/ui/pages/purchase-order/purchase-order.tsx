import { useCallback, useMemo, useState } from "react";
import {
	Alert,
	AnimatedAlertWrapper,
	Breadcrumb,
	Button,
	ContextMenu,
	DataTable,
	Dropdown,
	InputText,
	Pagination,
	useTheme,
	type TableColumn,
} from "@alpac/design-system";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { m } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { PurchaseOrderModal } from "./components/purchase-order-modal/purchase-order-modal";
import type { PurchaseOrderRow } from "./components/purchase-order-modal/purchase-order-modal.types";

const inputClassName =
	"w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const dropdownClassName =
	"w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";
const labelClassName = "text-black! dark:text-white!";
const PAGE_SIZE = 5;

const statusOptions = [
	{ label: "Borrador", value: "draft" },
	{ label: "Pendiente", value: "pending" },
	{ label: "Aprobada", value: "approved" },
	{ label: "Recibida", value: "received" },
	{ label: "Cancelada", value: "cancelled" },
];

export const PurchaseOrder = () => {
	const navigate = useNavigate();
	const { baseUrl } = useBaseUrl();
	const { theme } = useTheme();
	const { urlImage, neutralUrlImage } = useCompanyStore();

	const [isPurchaseOrderModalOpen, setIsPurchaseOrderModalOpen] = useState(false);
	const [orderNumber, setOrderNumber] = useState("");
	const [supplierName, setSupplierName] = useState("");
	const [status, setStatus] = useState<string>("");
	const [selectedPurchaseOrder, setSelectedPurchaseOrder] =
		useState<PurchaseOrderRow | null>(null);
	const [currentPage, setCurrentPage] = useState(1);

	const {
		alertState,
		handleCloseAlert,
		handleRequestError,
		handleRequestSuccess,
	} = useAlertState();

	const purchaseOrders: PurchaseOrderRow[] = [];
	const totalRecords = 0;
	const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;

	const handleClearFilters = () => {
		setOrderNumber("");
		setSupplierName("");
		setStatus("");
		setCurrentPage(1);
	};

	const handlePageChange = useCallback((page: number) => {
		setCurrentPage(page);
	}, []);

	const onEditPurchaseOrder = (data: PurchaseOrderRow) => {
		setSelectedPurchaseOrder(data);
		setIsPurchaseOrderModalOpen(true);
	};

	const onViewDetails = (data: PurchaseOrderRow) => {
		console.log(data);
	};

	const columnConfig: TableColumn<PurchaseOrderRow>[] = useMemo(
		() => [
			{ key: "order_number", label: "N° Orden" },
			{ key: "supplier_name", label: "Proveedor" },
			{ key: "order_date", label: "Fecha" },
			{ key: "total_amount", label: "Total" },
			{ key: "status", label: "Estado" },
			{
				key: "actions",
				label: "Acciones",
				render: (row: PurchaseOrderRow) => (
					<ContextMenu
						items={[
							{ label: "Editar", onClick: () => onEditPurchaseOrder(row) },
							{ label: "Ver detalle", onClick: () => onViewDetails(row) },
						]}
					/>
				),
			},
		],
		[],
	);

	return (
		<m.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.5 }}
			className="flex flex-col gap-4"
		>
			<div className="flex justify-start">
				<Breadcrumb
					items={[
						{
							label: "Dashboard",
							url: `${baseUrl}/`,
							onClick: (url) => navigate(url),
						},
						{
							label: "Órdenes de Compra",
							url: `${baseUrl}/purchasing/purchase-orders`,
							onClick: (url) => navigate(url),
						},
					]}
				/>
			</div>

			<div className="flex flex-col">
				<div className="flex justify-between items-center">
					<div className="flex flex-col justify-center">
						<h3 className="p-0! m-0!">Órdenes de Compra</h3>
						<small className="text-gray-500 dark:text-gray-300">
							Gestión de Órdenes de Compra
						</small>
					</div>
					<img
						className="h-12 sm:h-16 md:h-20 w-auto object-contain"
						src={activeLogo}
						alt="logo alpac"
					/>
				</div>
			</div>			

			<div className="flex justify-between items-center pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
				<div className="flex flex-col justify-center">
					<h3 className="p-0! m-0!">Filtros</h3>
					<small className="text-gray-500 dark:text-gray-300">
						Filtre la lista de órdenes de compra
					</small>
				</div>
			</div>

			<form
				onSubmit={(event) => event.preventDefault()}
				className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-end"
			>
				<InputText
					label="Campo de filtro"
					placeholder="Ej. OC-2026-001"
					className={inputClassName}
					labelClassName={labelClassName}
					value={orderNumber}
					onChange={(event) => setOrderNumber(event.target.value)}
				/>

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
					onClick={handleClearFilters}
					className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
				/>
			</form>

			<div className="flex flex-col">
				<DataTable
					title="Lista de órdenes de compra"
					data={purchaseOrders}
					columns={columnConfig}
					pagination={
						<Pagination
							currentPage={currentPage}
							pageSize={PAGE_SIZE}
							totalRecords={totalRecords}
							onPageChange={handlePageChange}
						/>
					}
				/>
			</div>

			<PurchaseOrderModal
				isOpen={isPurchaseOrderModalOpen}
				onClose={() => {
					setIsPurchaseOrderModalOpen(false);
					setSelectedPurchaseOrder(null);
				}}
				onSubmit={() => {
					setIsPurchaseOrderModalOpen(false);
					setSelectedPurchaseOrder(null);
					handleRequestSuccess("Orden de compra guardada correctamente.");
				}}
				onRequestError={handleRequestError}
				selectedPurchaseOrder={selectedPurchaseOrder}
			/>

			<AnimatedAlertWrapper open={alertState?.open ?? false}>
				<Alert
					type={alertState?.type!}
					title={alertState?.title}
					message={alertState?.message!}
					onClose={handleCloseAlert}
				/>
			</AnimatedAlertWrapper>
		</m.div>
	);
};
