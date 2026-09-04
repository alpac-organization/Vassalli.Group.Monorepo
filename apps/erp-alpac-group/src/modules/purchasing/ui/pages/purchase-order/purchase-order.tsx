import { useCallback, useMemo, useState } from "react";
import {
	Breadcrumb,
	Button,
	DataTable,
	Dropdown,
	Pagination,
	useTheme
} from "@alpac/design-system";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAreas } from "@app/modules/admin/ui/hooks/areas/useAreas";
import { useCompanies } from "@app/modules/auth/ui/hooks/useCompanies";
import { usePurchase } from "@app/modules/purchasing/ui/hooks/purchase/usePurchase";
import { Loader } from "@app/shared/components/loaders/loader";
import { m } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { GetPurchaseOrdersPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-orders-payload";
import { getPurchaseOrderTableColumns } from "./utils/purchase-order-table-columns";
import type { GetPurchaseOrdersResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-orders-response";
import { PurchaseOrderDetailsModal } from "./components/purchase-order-details-modal/purchase-order-details-modal";

const dropdownClassName =
	"w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";
const labelClassName = "text-black! dark:text-white!";
const PAGE_SIZE = 5;

export const PurchaseOrder = () => {
	const navigate = useNavigate();
	const { baseUrl } = useBaseUrl();
	const { theme } = useTheme();
	const { urlImage, neutralUrlImage } = useCompanyStore();
	const { companyId, moduleCode } = useUserStore();

	const [selectedAreaId, setSelectedAreaId] = useState("");
	const [selectedBranchId, setSelectedBranchId] = useState("");
	const [isPurchaseOrderDetailsOpen, setIsPurchaseOrderDetailsOpen] = useState(false);
	const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState<GetPurchaseOrdersResponse | null>(null);
	const [filters, setFilters] = useState<GetPurchaseOrdersPayload>({
		company_id: companyId,
		module_code: moduleCode,
		page_number: 1,
		page_size: PAGE_SIZE,
	});

	const { GetAreasByCompany } = useAreas({ company_id: companyId });
	const { GetBranchesQuery } = useCompanies({ company_id: companyId });
	const { GetPurchaseOrders } = usePurchase({
		getPurchaseOrdersPayload: {
			...filters,
			company_id: companyId,
			module_code: moduleCode,
			page_size: PAGE_SIZE,
		},
	});

	const purchaseOrders = GetPurchaseOrders.data?.data ?? [];
	const totalRecords = GetPurchaseOrders.data?.total ?? 0;
	const currentPage = filters.page_number;
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
		setFilters({
			company_id: companyId,
			module_code: moduleCode,
			page_number: 1,
			page_size: PAGE_SIZE,
			...(selectedAreaId && { area_id: selectedAreaId }),
			...(selectedBranchId && { branch_id: selectedBranchId }),
		});
	};

	const handleClearFilters = () => {
		setSelectedAreaId("");
		setSelectedBranchId("");
		setFilters({
			company_id: companyId,
			module_code: moduleCode,
			page_number: 1,
			page_size: PAGE_SIZE,
		});
	};

	const handlePageChange = useCallback((page: number) => {
		setFilters((prev) => ({
			...prev,
			page_number: page,
		}));
	}, []);

	const onViewDetail = (data: GetPurchaseOrdersResponse) => {
		setSelectedPurchaseOrder(data);
		setIsPurchaseOrderDetailsOpen(true);
	};

	const columnsConfig = useMemo(
		() => getPurchaseOrderTableColumns(onViewDetail),
		[onViewDetail]
	);

	return (
		<m.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.5 }}
			className="flex flex-col gap-4"
		>
			{GetPurchaseOrders.isLoading && <Loader title="Cargando órdenes de compra..." />}

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
							pageSize={PAGE_SIZE}
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
		</m.div>
	);
};
