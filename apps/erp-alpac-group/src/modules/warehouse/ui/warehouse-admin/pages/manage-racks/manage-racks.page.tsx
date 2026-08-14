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
	SectionHeader,
	useTheme,
	type TableColumn,
} from "@alpac/design-system";
import { Rows4 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { m } from "framer-motion";
import { RackModal } from "./components/rack-modal/rack-modal";
import { RackDetailModal } from "./components/rack-detail-modal/rack-detail-modal";
import { useWarehouseLayout } from "@app/modules/warehouse/ui/hooks/useWarehouseLayout";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { Loader } from "@app/shared/components/loaders/loader";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { RackStatusBadge } from "@app/modules/warehouse/ui/warehouse-admin/utils/layout-badges";
import { RackStatusOptions } from "@app/modules/warehouse/domain/enums/rack-status.enum";
import { RackUsageProfileOptions } from "@app/modules/warehouse/domain/enums/rack-usage-profile.enum";
import type { GetRacksRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-racks-request";
import type { RackSummaryResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/rack-response";
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

type RackRow = {
	rack_id: string;
	code: string;
	level_number: number;
	row_number: number;
	status: string | null;
};

const PAGE_SIZE = 10;

export const ManageRacksPage = () => {
	const { sectionId } = useParams<{ sectionId: string }>();
	const { warehouseId } = useParams<{ warehouseId: string }>();
	const navigate = useNavigate();
	const { baseUrl } = useBaseUrl();
	const { companyId, moduleCode } = useUserStore();
	const { getMappedError } = useMappedError();
	const { alertState, handleCloseAlert, handleRequestError } = useAlertState();
	const { theme } = useTheme();
	const { urlImage, neutralUrlImage } = useCompanyStore();
	const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;

	const [isRackModalOpen, setIsRackModalOpen] = useState(false);
	const [selectedRackId, setSelectedRackId] = useState<string | null>(null);
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

	const [filterLevel, setFilterLevel] = useState("");
	const [filterStatus, setFilterStatus] = useState("");
	const [filterUsage, setFilterUsage] = useState("");
	const [appliedFilters, setAppliedFilters] = useState({
		level: "",
		status: "",
		usage: "",
	});

	const [currentPage, setCurrentPage] = useState(1);

	const getRacksPayload = useMemo<GetRacksRequest>(
		() => ({
			company_id: companyId,
			module_code: moduleCode,
			section_id: sectionId ?? "",
			level_number: appliedFilters.level ? Number(appliedFilters.level) : null,
			status: appliedFilters.status ? appliedFilters.status : null,
			usage_profile: appliedFilters.usage ? appliedFilters.usage : null,
		}),
		[companyId, moduleCode, sectionId, appliedFilters],
	);

	const { GetRacks, GetRackById } = useWarehouseLayout({
		getRacksPayload,
		getRackDetailPayload: {
			company_id: companyId,
			module_code: moduleCode,
			rack_id: selectedRackId ?? "",
		},
	});

	const racksData = useMemo<RackRow[]>(() => {
		const payload = GetRacks.data;
		const list = Array.isArray(payload?.racks)
			? payload.racks
			: Array.isArray(payload)
				? payload
				: [];

		return list.map((item: RackSummaryResponse) => ({
			rack_id: item.rack_id ?? "",
			code: item.code ?? "-",
			level_number: item.level_number ?? 0,
			row_number: item.row_number ?? 0,
			status: item.status ?? null,
		}));
	}, [GetRacks.data]);

	useEffect(() => {
		if (GetRacks.isError && GetRacks.error) {
			const mappedError = getMappedError(GetRacks.error as ApiErrorResponse);
			handleRequestError(mappedError.description);
		}
	}, [GetRacks.isError, GetRacks.error, getMappedError, handleRequestError]);

	useEffect(() => {
		if (GetRackById.isError && GetRackById.error) {
			const mappedError = getMappedError(GetRackById.error as ApiErrorResponse);
			handleRequestError(mappedError.description);
		}
	}, [GetRackById.isError, GetRackById.error, getMappedError, handleRequestError]);

	useEffect(() => {
		setCurrentPage(1);
	}, [appliedFilters]);

	const handleApplyFilters = useCallback(
		(event: React.FormEvent) => {
			event.preventDefault();
			setAppliedFilters({
				level: filterLevel.trim(),
				status: filterStatus,
				usage: filterUsage,
			});
		},
		[filterLevel, filterStatus, filterUsage],
	);

	const handleClearFilters = useCallback(() => {
		setFilterLevel("");
		setFilterStatus("");
		setFilterUsage("");
		setAppliedFilters({ level: "", status: "", usage: "" });
	}, []);

	const paginatedData = useMemo(() => {
		const start = (currentPage - 1) * PAGE_SIZE;
		return racksData.slice(start, start + PAGE_SIZE);
	}, [racksData, currentPage]);

	const handleViewDetail = (rackId: string) => {
		setSelectedRackId(rackId);
		setIsDetailModalOpen(true);
	};

	const columns: TableColumn<RackRow>[] = [
		{ key: "code", label: "Código" },
		{ key: "level_number", label: "Nivel" },
		{ key: "row_number", label: "Fila" },
		{
			key: "status",
			label: "Estado",
			render(row) {
				return <RackStatusBadge value={row.status} />;
			},
		},
		{
			key: "action",
			label: "Acciones",
			render(row) {
				const isLastItem =
					paginatedData.length > 0 &&
					paginatedData[paginatedData.length - 1]?.rack_id === row.rack_id;

				return (
					<ContextMenu
						items={[
							{
								label: "Ver detalle",
								onClick: () => handleViewDetail(row.rack_id),
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
			{(GetRacks.isLoading || (isDetailModalOpen && GetRackById.isLoading)) && (
				<Loader title="Cargando racks..." />
			)}

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
						{
							label: "Racks",
							url: `${baseUrl}/warehouse-admin/management/sections/${warehouseId}/racks/${sectionId}`,
							onClick: (url) => navigate(url),
						},
					]}
				/>
			</div>

			<SectionHeader
				title="Racks de la sección"
				subtitle="Consulte y registre racks de la sección seleccionada"
				logoImage={activeLogo}
			/>

			<div className="flex justify-between items-center pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
				<div className="flex flex-col justify-center">
					<h3 className="p-0! m-0!">Acciones</h3>
					<small className="text-gray-500 dark:text-gray-300">
						Registre nuevos racks
					</small>
				</div>
			</div>

			<div className="w-full dark:bg-[#272b34]! p-4 rounded-md border border-slate-600 dark:border-neutral-600">
				<div className="w-full flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:justify-start">
					<Button
						type="button"
						size="giant"
						label="Registrar Nuevos Racks"
						icon={<Rows4 size={20} />}
						className={primaryButtonClassName}
						onClick={() => setIsRackModalOpen(true)}
					/>
				</div>
			</div>

			<div className="flex justify-between items-center pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
				<div className="flex flex-col justify-center">
					<h3 className="p-0! m-0!">Filtros</h3>
					<small className="text-gray-500 dark:text-gray-300">
						Filtra por nivel, estado o perfil de uso
					</small>
				</div>
			</div>

			<form
				onSubmit={handleApplyFilters}
				className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-end"
			>
					<div className="flex flex-col min-w-0">
						<InputText
							label="Nivel"
							placeholder="Número de nivel..."
							className={inputClassName}
							labelClassName={labelClassName}
							value={filterLevel}
							onChange={(e) => setFilterLevel(e.target.value)}
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
							value={filterStatus}
							onChange={(val) => setFilterStatus(val)}
							options={[
								{ value: "", label: "Todos" },
								...RackStatusOptions,
							]}
						/>
					</div>

					<div className="flex flex-col min-w-0">
						<Dropdown
							label="Perfil de uso"
							placeholder="Todos"
							appearance="dark"
							className={`${dropdownClassName} h-[42px]! sm:h-[46px]!`}
							labelClassName={labelClassName}
							valueClassName={labelClassName}
							value={filterUsage}
							onChange={(val) => setFilterUsage(val)}
							options={[
								{ value: "", label: "Todos" },
								...RackUsageProfileOptions,
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
				title="Lista de racks"
				data={paginatedData}
				columns={columns}
				isLoading={GetRacks.isLoading}
				pagination={
					<Pagination
						currentPage={currentPage}
						pageSize={PAGE_SIZE}
						totalRecords={racksData.length}
						onPageChange={(page) => setCurrentPage(page)}
						disabled={racksData.length === 0}
					/>
				}
			/>

			<RackModal
				isOpen={isRackModalOpen}
				sectionId={sectionId ?? ""}
				onSubmit={() => {
					GetRacks.refetch();
				}}
				onClose={() => setIsRackModalOpen(false)}
			/>

			<RackDetailModal
				isOpen={isDetailModalOpen}
				rack={GetRackById.data ?? null}
				isLoading={GetRackById.isLoading}
				onClose={() => {
					setIsDetailModalOpen(false);
					setSelectedRackId(null);
				}}
			/>
		</m.div>
	);
};
