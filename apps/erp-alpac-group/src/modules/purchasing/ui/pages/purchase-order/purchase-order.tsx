import { useCallback, useMemo, useState } from "react";
import {
	Breadcrumb,
	Button,
	DataTable,
	Dropdown,
	Pagination,
	useTheme,
} from "@alpac/design-system";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAreas } from "@app/modules/admin/ui/hooks/areas/useAreas";
import { useCompanies } from "@app/modules/auth/ui/hooks/useCompanies";
import { usePurchaseOrders } from "@app/modules/purchasing/ui/hooks/purchase/usePurchaseOrders";
import { usePurchaseOrderPdf } from "@app/modules/purchasing/ui/pages/purchase-order/hooks/usePurchaseOrderPdf";
import { Loader } from "@app/shared/components/loaders/loader";
import { m } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { GetPurchaseOrdersPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-orders-payload";
import { getPurchaseOrderTableColumns } from "@app/modules/purchasing/ui/pages/purchase-order/utils/purchase-order-table-columns";
import type { GetPurchaseOrdersResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-orders-response";
import { PurchaseOrderDetailsModal } from "@app/modules/purchasing/ui/pages/purchase-order/components/purchase-order-details-modal/purchase-order-details-modal";

const dropdownClassName =
	"w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";
const labelClassName = "text-black! dark:text-white!";
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;

export const PurchaseOrder = () => {
	const navigate = useNavigate();
	const { baseUrl } = useBaseUrl();
	const { theme } = useTheme();
	const { urlImage, neutralUrlImage } = useCompanyStore();
	const { companyId, moduleCode } = useUserStore();
	const { AlertComponent, handleRequestError } = useAlertState();
	const { isGenerating, generatePurchaseOrderPdf } = usePurchaseOrderPdf();

	const [selectedAreaId, setSelectedAreaId] = useState("");
	const [selectedBranchId, setSelectedBranchId] = useState("");
	const [appliedAreaId, setAppliedAreaId] = useState("");
	const [appliedBranchId, setAppliedBranchId] = useState("");
	const [pageNumber, setPageNumber] = useState(DEFAULT_PAGE_NUMBER);
	const [pageSize, setPageSize] = useState<number | undefined>(undefined);
	const [isPurchaseOrderDetailsOpen, setIsPurchaseOrderDetailsOpen] =
		useState(false);
	const [selectedPurchaseOrder, setSelectedPurchaseOrder] =
		useState<GetPurchaseOrdersResponse | null>(null);

	const purchaseOrdersPayload = useMemo<GetPurchaseOrdersPayload>(
		() => ({
			company_id: companyId,
			module_code: moduleCode,
			page_number: pageNumber,
			...(pageSize != null && pageSize !== DEFAULT_PAGE_SIZE
				? { page_size: pageSize }
				: {}),
			...(appliedAreaId ? { area_id: appliedAreaId } : {}),
			...(appliedBranchId ? { branch_id: appliedBranchId } : {}),
		}),
		[
			companyId,
			moduleCode,
			pageNumber,
			pageSize,
			appliedAreaId,
			appliedBranchId,
		],
	);

	const { GetAreasByCompany } = useAreas({
		company_id: companyId,
		module_code: moduleCode,
	});
	const { GetBranchesQuery } = useCompanies({ company_id: companyId });
	const { GetPurchaseOrders } = usePurchaseOrders({
		getPurchaseOrdersPayload: purchaseOrdersPayload,
	});

	const purchaseOrders = GetPurchaseOrders.data?.data ?? [];
	const totalRecords = GetPurchaseOrders.data?.total ?? 0;
	const currentPage = GetPurchaseOrders.data?.page_number ?? pageNumber;
	const resolvedPageSize = GetPurchaseOrders.data?.page_size ?? DEFAULT_PAGE_SIZE;
	const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;

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

	const handleApplyFilters = () => {
		setAppliedAreaId(selectedAreaId);
		setAppliedBranchId(selectedBranchId);
		setPageNumber(DEFAULT_PAGE_NUMBER);
	};

	const handleClearFilters = () => {
		setSelectedAreaId("");
		setSelectedBranchId("");
		setAppliedAreaId("");
		setAppliedBranchId("");
		setPageNumber(DEFAULT_PAGE_NUMBER);
		setPageSize(undefined);
	};

	const handlePageChange = useCallback((page: number) => {
		setPageNumber(page);
	}, []);

	const onViewDetail = useCallback((data: GetPurchaseOrdersResponse) => {
		setSelectedPurchaseOrder(data);
		setIsPurchaseOrderDetailsOpen(true);
	}, []);

	const onGeneratePurchaseOrderPdf = useCallback(
		async (row: GetPurchaseOrdersResponse) => {
			try {
				await generatePurchaseOrderPdf({
					purchaseOrderId: row.purchase_order_id,
					purchaseRequestId: row.purchase_request?.purchase_request_id,
				});
			} catch (error) {
				const message =
					error instanceof Error
						? error.message
						: "No se pudo generar la orden de compra.";
				handleRequestError(message);
			}
		},
		[generatePurchaseOrderPdf, handleRequestError],
	);

	const columnsConfig = useMemo(
		() =>
			getPurchaseOrderTableColumns({
				onViewDetail,
				onGeneratePurchaseOrderPdf,
			}),
		[onViewDetail, onGeneratePurchaseOrderPdf],
	);

	const showLoader = GetPurchaseOrders.isLoading || isGenerating;
	const loaderTitle = isGenerating
		? "Generando orden de compra..."
		: "Cargando órdenes de compra...";

	return (
		<m.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.5 }}
			className="flex flex-col gap-4"
		>
			{showLoader ? <Loader title={loaderTitle} /> : null}

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
				onSubmit={(event) => {
					event.preventDefault();
					handleApplyFilters();
				}}
				className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end"
			>
				<Dropdown
					appearance="dark"
					label="Área"
					placeholder="Seleccione un área"
					options={areaOptions}
					value={selectedAreaId}
					onChange={(value) => setSelectedAreaId(String(value))}
					labelClassName={labelClassName}
					valueClassName={labelClassName}
					className={dropdownClassName}
				/>

				<Dropdown
					appearance="dark"
					label="Sucursal"
					placeholder="Seleccione una sucursal"
					options={branchOptions}
					value={selectedBranchId}
					onChange={(value) => setSelectedBranchId(String(value))}
					labelClassName={labelClassName}
					valueClassName={labelClassName}
					className={dropdownClassName}
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
					columns={columnsConfig}
					pagination={
						<Pagination
							currentPage={currentPage}
							pageSize={resolvedPageSize}
							totalRecords={totalRecords}
							onPageChange={handlePageChange}
						/>
					}
				/>
			</div>

			<PurchaseOrderDetailsModal
				isOpen={isPurchaseOrderDetailsOpen}
				onClose={() => setIsPurchaseOrderDetailsOpen(false)}
				purchaseOrder={selectedPurchaseOrder}
			/>

			{AlertComponent}
		</m.div>
	);
};
