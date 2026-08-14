import {
	Alert,
	AnimatedAlertWrapper,
	Breadcrumb,
	Button,
	DataTable,
	Dropdown,
	InputText,
	Pagination,
	SectionHeader,
	useTheme,
	type TableColumn,
} from "@alpac/design-system";
import { LayoutGrid, Rows3, Rows4 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { m } from "framer-motion";
import { SectionModal } from "./components/section-modal/section-modal";
import { useWarehouseLayout } from "@app/modules/warehouse/ui/hooks/useWarehouseLayout";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { Loader } from "@app/shared/components/loaders/loader";
import { SectionTypeOptions } from "@app/modules/warehouse/domain/enums/section-type.enum";
import { SectionStorageTypeOptions } from "@app/modules/warehouse/domain/enums/section-storage-type.enum";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { SectionResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/section-response";
import {
	ActiveStatusBadge,
	SectionStorageTypeBadge,
	SectionTypeBadge,
} from "@app/modules/warehouse/ui/warehouse-admin/utils/layout-badges";
import {
	applyFiltersButtonClassName,
	clearFiltersButtonClassName,
	dropdownClassName,
	inputClassName,
	labelClassName,
	primaryActionButtonClassName,
	primaryButtonClassName,
	secondaryActionButtonClassName,
} from "@app/modules/warehouse/ui/warehouse-admin/utils/page-styles";

type SectionRow = {
	section_id: string;
	section_code: string;
	section_name: string;
	section_type: string | null;
	storage_type: string | null;
	is_active: boolean;
};

type SectionFilters = {
	searchTerm: string;
	filterType: string;
	filterStorage: string;
	filterStatus: string;
};

const EMPTY_FILTERS: SectionFilters = {
	searchTerm: "",
	filterType: "",
	filterStorage: "",
	filterStatus: "",
};

export const ManageSectionsPage = () => {
	const { warehouseId } = useParams<{ warehouseId: string }>();
	const navigate = useNavigate();
	const { baseUrl } = useBaseUrl();
	const { companyId, moduleCode } = useUserStore();
	const { getMappedError } = useMappedError();
	const { alertState, handleCloseAlert, handleRequestError } = useAlertState();
	const { theme } = useTheme();
	const { urlImage, neutralUrlImage } = useCompanyStore();
	const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;

	const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);

	const [draftFilters, setDraftFilters] = useState<SectionFilters>(EMPTY_FILTERS);
	const [appliedFilters, setAppliedFilters] = useState<SectionFilters>(EMPTY_FILTERS);

	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 10;

	const { GetSections } = useWarehouseLayout({
		getSectionsPayload: {
			company_id: companyId,
			module_code: moduleCode,
			warehouse_id: warehouseId ?? "",
		},
	});

	const sectionsData = useMemo<SectionRow[]>(() => {
		const payload = GetSections.data;
		const list = Array.isArray(payload) ? payload : [];

		return list
			.map((item: SectionResponse) => ({
				section_id: item.section_id ?? "",
				section_code: item.section_code ?? "-",
				section_name: item.section_name ?? "-",
				section_type: item.section_type ?? null,
				storage_type: item.storage_type ?? null,
				is_active: Boolean(item.is_active),
			}))
			.filter((item: SectionRow) => {
				const matchesSearch =
					appliedFilters.searchTerm === "" ||
					item.section_name
						.toLowerCase()
						.includes(appliedFilters.searchTerm.toLowerCase()) ||
					item.section_code
						.toLowerCase()
						.includes(appliedFilters.searchTerm.toLowerCase());

				const matchesType =
					appliedFilters.filterType === "" ||
					item.section_type === appliedFilters.filterType;

				const matchesStorage =
					appliedFilters.filterStorage === "" ||
					item.storage_type === appliedFilters.filterStorage;

				let matchesStatus = true;
				if (appliedFilters.filterStatus === "Activa") {
					matchesStatus = item.is_active === true;
				} else if (appliedFilters.filterStatus === "Inactiva") {
					matchesStatus = item.is_active === false;
				}

				return matchesSearch && matchesType && matchesStorage && matchesStatus;
			});
	}, [GetSections.data, appliedFilters]);

	useEffect(() => {
		setCurrentPage(1);
	}, [appliedFilters]);

	useEffect(() => {
		if (GetSections.isError && GetSections.error) {
			const mappedError = getMappedError(GetSections.error as ApiErrorResponse);
			handleRequestError(mappedError.description);
		}
	}, [GetSections.isError, GetSections.error, getMappedError, handleRequestError]);

	const paginatedData = useMemo(() => {
		const start = (currentPage - 1) * pageSize;
		return sectionsData.slice(start, start + pageSize);
	}, [sectionsData, currentPage, pageSize]);

	const handleApplyFilters = useCallback(
		(event: React.FormEvent) => {
			event.preventDefault();
			setAppliedFilters({
				searchTerm: draftFilters.searchTerm.trim(),
				filterType: draftFilters.filterType,
				filterStorage: draftFilters.filterStorage,
				filterStatus: draftFilters.filterStatus,
			});
		},
		[draftFilters],
	);

	const handleClearFilters = useCallback(() => {
		setDraftFilters(EMPTY_FILTERS);
		setAppliedFilters(EMPTY_FILTERS);
	}, []);

	const handleGoToLots = (sectionId: string) => {
		navigate(`${baseUrl}/warehouse-admin/management/sections/${warehouseId}/lots/${sectionId}`);
	};

	const handleGoToRacks = (sectionId: string) => {
		navigate(`${baseUrl}/warehouse-admin/management/sections/${warehouseId}/racks/${sectionId}`);
	};

	const columns: TableColumn<SectionRow>[] = [
		{ key: "section_code", label: "Código" },
		{ key: "section_name", label: "Nombre" },
		{
			key: "section_type",
			label: "Tipo",
			render(row) {
				return <SectionTypeBadge value={row.section_type} />;
			},
		},
		{
			key: "storage_type",
			label: "Almacenamiento",
			render(row) {
				return <SectionStorageTypeBadge value={row.storage_type} />;
			},
		},
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
				return (
					<div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:gap-3">
						<Button
							type="button"
							size="medium"
							label="Ver tramos"
							icon={<Rows3 size={16} />}
							onClick={() => handleGoToLots(row.section_id)}
							className={primaryActionButtonClassName}
						/>
						<Button
							type="button"
							size="medium"
							label="Ver racks"
							icon={<Rows4 size={16} />}
							onClick={() => handleGoToRacks(row.section_id)}
							className={secondaryActionButtonClassName}
						/>
					</div>
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
			{GetSections.isLoading && <Loader title="Cargando secciones..." />}

			<AnimatedAlertWrapper open={alertState?.open ?? false}>
				<Alert
					type={alertState?.type!}
					title={alertState?.title}
					message={alertState?.message!}
					onClose={handleCloseAlert}
				/>
			</AnimatedAlertWrapper>

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
						{
							label: "Secciones",
							url: `${baseUrl}/warehouse-admin/management/sections/${warehouseId}`,
							onClick: (url) => navigate(url),
						},
					]}
				/>
			</div>

			<SectionHeader
				title="Secciones de la bodega"
				subtitle="Gestione las secciones y acceda a tramos o racks"
				logoImage={activeLogo}
			/>

			<div className="flex flex-col gap-4">
				<div className="flex justify-between items-center">
					<div className="flex flex-col justify-center gap-2">
						<h3 className="p-0! m-0!">Filtros</h3>
						<small className="text-gray-500 dark:text-gray-300 text-[12px] sm:text-sm leading-snug">
							Filtra por nombre, código, tipo, almacenamiento o estado
						</small>
					</div>
				</div>

				<form
					onSubmit={handleApplyFilters}
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 items-end"
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
								...SectionTypeOptions,
							]}
						/>
					</div>

					<div className="flex flex-col min-w-0">
						<Dropdown
							label="Almacenamiento"
							placeholder="Todos"
							appearance="dark"
							className={`${dropdownClassName} h-[42px]! sm:h-[46px]!`}
							labelClassName={labelClassName}
							valueClassName={labelClassName}
							value={draftFilters.filterStorage}
							onChange={(val) =>
								setDraftFilters((prev) => ({ ...prev, filterStorage: val }))
							}
							options={[
								{ value: "", label: "Todos" },
								...SectionStorageTypeOptions,
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
			</div>

			<div className="flex justify-end">
				<Button
					type="button"
					size="giant"
					label="Registrar Nueva Sección"
					icon={<LayoutGrid size={20} />}
					className={primaryButtonClassName}
					onClick={() => setIsSectionModalOpen(true)}
				/>
			</div>

			<DataTable
				title="Lista de secciones"
				data={paginatedData}
				columns={columns}
				isLoading={GetSections.isLoading}
				pagination={
					<Pagination
						currentPage={currentPage}
						pageSize={pageSize}
						totalRecords={sectionsData.length}
						onPageChange={(page) => setCurrentPage(page)}
						disabled={sectionsData.length === 0}
					/>
				}
			/>

			<SectionModal
				isOpen={isSectionModalOpen}
				warehouseId={warehouseId ?? ""}
				onSubmit={() => {
					GetSections.refetch();
				}}
				onClose={() => setIsSectionModalOpen(false)}
			/>
		</m.div>
	);
};
