import { Alert, AnimatedAlertWrapper, Button, DataTable, Dropdown, InputText, Pagination, type TableColumn } from "@alpac/design-system";
import { ArrowLeft, Rows4, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RackModal } from "./components/rack-modal/rack-modal";
import { useWarehouseLayout } from "@app/modules/warehouse/ui/hooks/useWarehouseLayout";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { Loader } from "@app/shared/components/loaders/loader";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { RackStatusBadge } from "@app/modules/warehouse/ui/warehouse-admin/utils/layout-badges";
import { RackStatusOptions } from "@app/modules/warehouse/domain/enums/rack-status.enum";
import { RackUsageProfileOptions } from "@app/modules/warehouse/domain/enums/rack-usage-profile.enum";
import type { GetRacksRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-racks-request";
import type { RackSummaryResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/rack-response";

type RackRow = {
	rack_id: string;
	code: string;
	level_number: number;
	row_number: number;
	status: string;
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

	const [isRackModalOpen, setIsRackModalOpen] = useState(false);

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

	const { GetRacks } = useWarehouseLayout({ getRacksPayload });

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

	const totalRacks = useMemo(
		() => GetRacks.data?.total_racks_count ?? racksData.length,
		[GetRacks.data, racksData.length],
	);

	useEffect(() => {
		if (GetRacks.isError && GetRacks.error) {
			const mappedError = getMappedError(GetRacks.error as ApiErrorResponse);
			handleRequestError(mappedError.description);
		}
	}, [GetRacks.isError, GetRacks.error, getMappedError, handleRequestError]);

	useEffect(() => {
		setCurrentPage(1);
	}, [appliedFilters]);

	const handleApplyFilters = useCallback(() => {
		setAppliedFilters({
			level: filterLevel,
			status: filterStatus,
			usage: filterUsage,
		});
	}, [filterLevel, filterStatus, filterUsage]);

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

	const columns: TableColumn<RackRow>[] = [
		{ key: "code", label: "Código" },
		{
			key: "level_number",
			label: "Nivel",
			render(row) {
				return <span className="text-slate-300">{row.level_number}</span>;
			},
		},
		{
			key: "row_number",
			label: "Fila",
			render(row) {
				return <span className="text-slate-300">{row.row_number}</span>;
			},
		},
		{
			key: "status",
			label: "Estado",
			render(row) {
				return <RackStatusBadge value={row.status} />;
			},
		},
	];

	return (
		<div className="space-y-4 p-6 bg-[#14161c] min-h-screen">
			{GetRacks.isLoading && <Loader title="Cargando racks..." />}

			<AnimatedAlertWrapper open={alertState?.open ?? false}>
				<Alert
					type={alertState?.type!}
					title={alertState?.title}
					message={alertState?.message!}
					onClose={handleCloseAlert}
				/>
			</AnimatedAlertWrapper>

			<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
				<div className="flex items-center gap-4">
					<Button
						type="button"
						size="medium"
						label="Volver"
						icon={<ArrowLeft size={16} />}
						onClick={() =>
							navigate(`${baseUrl}/warehouse-admin/management/sections/${warehouseId}`)
						}
						className="w-full min-w-0 shrink-0 text-[14px]! rounded-md! bg-white! dark:bg-transparent! text-slate-700! dark:text-slate-300! border! border-slate-300! dark:border-slate-600! hover:bg-slate-50! dark:hover:bg-slate-700/30! sm:w-auto!"
					/>
					<div className="flex items-center gap-4">
						<h1 className="text-2xl font-bold text-white tracking-tight">Racks de la sección</h1>
						<span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium">
							{totalRacks} registros
						</span>
					</div>
				</div>

				<Button
					type="button"
					size="giant"
					label="Registrar Nuevos Racks"
					icon={<Rows4 size={20} />}
					className="w-full! md:w-auto! mt-4! sm:mt-0! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
					onClick={() => setIsRackModalOpen(true)}
				/>
			</div>

			<div className="bg-[#1b1e27] border border-[#2a2d3d] rounded-xl p-4 mb-6 flex flex-col md:flex-row items-center gap-4">
				<div className="w-full md:w-48">
					<InputText
						placeholder="Nivel..."
						className="w-full! bg-[#14161c]! border! border-[#2a2d3d]! text-slate-200! rounded-lg! focus:ring-indigo-500! focus:border-indigo-500! placeholder-slate-500!"
						value={filterLevel}
						onChange={(e) => setFilterLevel(e.target.value)}
					/>
				</div>

				<div className="w-full md:w-52">
					<Dropdown
						placeholder="Todos los estados"
						appearance="dark"
						className="w-full! bg-[#14161c]! border! border-[#2a2d3d]! text-slate-200! rounded-lg! focus:ring-indigo-500! focus:border-indigo-500!"
						value={filterStatus}
						onChange={(val) => setFilterStatus(val)}
						options={[
							{ value: "", label: "Todos los estados" },
							...RackStatusOptions,
						]}
					/>
				</div>

				<div className="w-full md:w-52">
					<Dropdown
						placeholder="Todo perfil de uso"
						appearance="dark"
						className="w-full! bg-[#14161c]! border! border-[#2a2d3d]! text-slate-200! rounded-lg! focus:ring-indigo-500! focus:border-indigo-500!"
						value={filterUsage}
						onChange={(val) => setFilterUsage(val)}
						options={[
							{ value: "", label: "Todo perfil de uso" },
							...RackUsageProfileOptions,
						]}
					/>
				</div>

				<div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
					<Button
						type="button"
						size="medium"
						label="Aplicar filtros"
						icon={<Search size={16} />}
						onClick={handleApplyFilters}
						className="w-full! text-[14px]! rounded-md! bg-alpac-primary-500 text-white! sm:w-auto!"
					/>
					<Button
						type="button"
						size="medium"
						label="Limpiar"
						onClick={handleClearFilters}
						className="w-full! text-[14px]! rounded-md! bg-white! dark:bg-transparent! text-slate-700! dark:text-slate-300! border! border-slate-300! dark:border-slate-600! hover:bg-slate-50! dark:hover:bg-slate-700/30! sm:w-auto!"
					/>
				</div>
			</div>

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
		</div>
	);
};