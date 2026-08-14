import {
	Breadcrumb,
	Button,
	ContextMenu,
	DataTable,
	Dropdown,
	InputText,
	Pagination,
	SectionHeader,
	useTheme,
	type TableColumn,
} from "@alpac/design-system";
import { Warehouse } from "lucide-react";
import { useCallback, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { m } from "framer-motion";
import { WarehouseModal } from "@app/modules/warehouse/ui/warehouse/components/warehouse-modal/warehouse-modal";
import { useWarehouse } from "@app/modules/warehouse/ui/hooks/useWarehouse";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { ActiveStatusBadge } from "@app/modules/warehouse/ui/warehouse-admin/utils/layout-badges";
import {
	applyFiltersButtonClassName,
	clearFiltersButtonClassName,
	dropdownClassName,
	inputClassName,
	labelClassName,
	primaryButtonClassName,
} from "@app/modules/warehouse/ui/warehouse-admin/utils/page-styles";

const contextMenuButton =
	"rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";

type WarehouseRow = {
	warehouse_id: string;
	warehouse_name: string;
	warehouse_code: string;
	warehouse_type: string;
	is_active: boolean;
};

type WarehouseFilters = {
	searchTerm: string;
	filterType: string;
	filterStatus: string;
};

const EMPTY_FILTERS: WarehouseFilters = {
	searchTerm: "",
	filterType: "",
	filterStatus: "",
};

export const ManageSectionPage = () => {
	const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
	const { companyId, moduleCode } = useUserStore();
	const navigate = useNavigate();
	const { baseUrl } = useBaseUrl();
	const { theme } = useTheme();
	const { urlImage, neutralUrlImage } = useCompanyStore();
	const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;

	const [draftFilters, setDraftFilters] = useState<WarehouseFilters>(EMPTY_FILTERS);
	const [appliedFilters, setAppliedFilters] = useState<WarehouseFilters>(EMPTY_FILTERS);

	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 10;

	const { GetWarehouses } = useWarehouse({
		getWarehousesPayload: {
			company_id: companyId,
			module_code: moduleCode,
		},
	});

	const warehouseData = useMemo<WarehouseRow[]>(() => {
		const payload = GetWarehouses.data;
		const list: unknown[] = Array.isArray(payload)
			? payload
			: Array.isArray(payload?.data)
				? payload.data
				: [];

		return list
			.map((item): WarehouseRow => {
				const warehouse = item as Partial<WarehouseRow>;

				return {
					warehouse_id: warehouse.warehouse_id ?? "",
					warehouse_name: warehouse.warehouse_name ?? "-",
					warehouse_code: warehouse.warehouse_code ?? "-",
					warehouse_type: warehouse.warehouse_type ?? "-",
					is_active: Boolean(warehouse.is_active),
				};
			})
			.filter((item) => {
				const matchesSearch =
					appliedFilters.searchTerm === "" ||
					item.warehouse_name
						.toLowerCase()
						.includes(appliedFilters.searchTerm.toLowerCase()) ||
					item.warehouse_code
						.toLowerCase()
						.includes(appliedFilters.searchTerm.toLowerCase());

				const matchesType =
					appliedFilters.filterType === "" ||
					item.warehouse_type === appliedFilters.filterType;

				let matchesStatus = true;
				if (appliedFilters.filterStatus === "Activa") {
					matchesStatus = item.is_active === true;
				} else if (appliedFilters.filterStatus === "Inactiva") {
					matchesStatus = item.is_active === false;
				}

				return matchesSearch && matchesType && matchesStatus;
			});
	}, [GetWarehouses.data, appliedFilters]);

	useEffect(() => {
		setCurrentPage(1);
	}, [appliedFilters]);

	const paginatedData = useMemo(() => {
		const start = (currentPage - 1) * pageSize;
		return warehouseData.slice(start, start + pageSize);
	}, [warehouseData, currentPage, pageSize]);

	const handleApplyFilters = useCallback(
		(event: React.FormEvent) => {
			event.preventDefault();
			setAppliedFilters({
				searchTerm: draftFilters.searchTerm.trim(),
				filterType: draftFilters.filterType,
				filterStatus: draftFilters.filterStatus,
			});
		},
		[draftFilters],
	);

	const handleClearFilters = useCallback(() => {
		setDraftFilters(EMPTY_FILTERS);
		setAppliedFilters(EMPTY_FILTERS);
	}, []);

	const columns: TableColumn<WarehouseRow>[] = [
		{ key: "warehouse_name", label: "Nombre" },
		{ key: "warehouse_code", label: "Código" },
		{ key: "warehouse_type", label: "Tipo" },
		{
			key: "is_active",
			label: "Estado",
			render(row) {
				return <ActiveStatusBadge isActive={row.is_active} />;
			},
		},
		{
			key: "action",
			label: "Acciones",
			render(row) {
				const isLastItem =
					paginatedData.length > 0 &&
					paginatedData[paginatedData.length - 1]?.warehouse_id ===
						row.warehouse_id;

				return (
					<ContextMenu
						items={[
							{
								label: "Ver secciones",
								onClick: () =>
									navigate(
										`${baseUrl}/warehouse-admin/management/sections/${row.warehouse_id}`,
									),
							},
						]}
						triggerClassName={contextMenuButton}
						openUpOnMobile={isLastItem}
					/>
				);
			},
		},
	];

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
							label: "Gestión de Bodega",
							url: `${baseUrl}/warehouse-admin/management`,
							onClick: (url) => navigate(url),
						},
					]}
				/>
			</div>

			<SectionHeader
				title="Lista de bodegas"
				subtitle="Gestione las bodegas y acceda a sus secciones"
				logoImage={activeLogo}
			/>

			<div className="flex justify-between items-center pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
				<div className="flex flex-col justify-center">
					<h3 className="p-0! m-0!">Acciones</h3>
					<small className="text-gray-500 dark:text-gray-300">
						Registre una nueva bodega
					</small>
				</div>
			</div>

			<div className="w-full dark:bg-[#272b34]! p-4 rounded-md border border-slate-600 dark:border-neutral-600">
				<div className="w-full flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:justify-start">
					<Button
						type="button"
						size="giant"
						label="Registrar Nueva Bodega"
						icon={<Warehouse size={20} />}
						className={primaryButtonClassName}
						onClick={() => setIsWarehouseModalOpen(true)}
					/>
				</div>
			</div>

			<div className="flex justify-between items-center pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
				<div className="flex flex-col justify-center">
					<h3 className="p-0! m-0!">Filtros</h3>
					<small className="text-gray-500 dark:text-gray-300">
						Filtra por nombre, código, tipo o estado de la bodega
					</small>
				</div>
			</div>

			<form
				onSubmit={handleApplyFilters}
				className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-end"
			>
					<div className="flex flex-col min-w-0">
						<InputText
							label="Búsqueda"
							placeholder="Buscar por nombre o código..."
							className={inputClassName}
							labelClassName={labelClassName}
							value={draftFilters.searchTerm}
							onChange={(e) =>
								setDraftFilters((prev) => ({ ...prev, searchTerm: e.target.value }))
							}
						/>
					</div>

					<div className="flex flex-col min-w-0">
						<Dropdown
							label="Tipo"
							placeholder="Todos"
							appearance="dark"
							className={`${dropdownClassName} h-[42px]! sm:h-[46px]!`}
							labelClassName={labelClassName}
							valueClassName={labelClassName}
							value={draftFilters.filterType}
							onChange={(val) =>
								setDraftFilters((prev) => ({ ...prev, filterType: val }))
							}
							options={[
								{ value: "", label: "Todos" },
								{ value: "Fiscal", label: "Fiscal" },
								{ value: "General", label: "General" },
								{ value: "Granel", label: "Granel" },
							]}
						/>
					</div>

					<div className="flex flex-col min-w-0">
						<Dropdown
							label="Estado"
							placeholder="Todos"
							appearance="dark"
							className={`${dropdownClassName} h-[42px]! sm:h-[46px]!`}
							labelClassName={labelClassName}
							valueClassName={labelClassName}
							value={draftFilters.filterStatus}
							onChange={(val) =>
								setDraftFilters((prev) => ({ ...prev, filterStatus: val }))
							}
							options={[
								{ value: "", label: "Todos" },
								{ value: "Activa", label: "Activa" },
								{ value: "Inactiva", label: "Inactiva" },
							]}
						/>
					</div>

					<div className="flex flex-col min-w-0">
						<Button
							type="submit"
							size="giant"
							className={applyFiltersButtonClassName}
							label="Aplicar filtros"
						/>
					</div>

					<div className="flex flex-col min-w-0">
						<Button
							type="button"
							size="giant"
							className={clearFiltersButtonClassName}
							label="Limpiar filtros"
							onClick={handleClearFilters}
						/>
					</div>
				</form>

			<DataTable
				title="Lista de bodegas"
				data={paginatedData}
				columns={columns}
				pagination={
					<Pagination
						currentPage={currentPage}
						pageSize={pageSize}
						totalRecords={warehouseData.length}
						onPageChange={(page) => setCurrentPage(page)}
						disabled={warehouseData.length === 0}
					/>
				}
			/>

			<WarehouseModal
				isOpen={isWarehouseModalOpen}
				onSubmit={() => {
					void GetWarehouses.refetch();
				}}
				onClose={() => setIsWarehouseModalOpen(false)}
			/>
		</m.div>
	);
};
