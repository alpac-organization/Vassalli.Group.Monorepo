import { Alert, AnimatedAlertWrapper, Button, DataTable, InputText, Pagination, type TableColumn } from "@alpac/design-system";
import { ArrowLeft, Eye, Rows3 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LotModal } from "./components/lot-modal/lot-modal";
import { LotDetailModal } from "./components/lot-detail-modal/lot-detail-modal";
import { useWarehouseLayout } from "@app/modules/warehouse/ui/hooks/useWarehouseLayout";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { Loader } from "@app/shared/components/loaders/loader";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { RackStatusBadge } from "@app/modules/warehouse/ui/warehouse-admin/utils/layout-badges";
import type { LotListItemResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/lot-response";

type LotRow = {
	lot_id: string;
	code: string;
	width_metres: number;
	length_metres: number;
	status: string | null;
	total_positions: number;
	occupied_positions: number;
};

export const ManageLotsPage = () => {
	const { sectionId } = useParams<{ sectionId: string }>();
	const { warehouseId } = useParams<{ warehouseId: string }>();
	const navigate = useNavigate();
	const { baseUrl } = useBaseUrl();
	const { companyId, moduleCode } = useUserStore();
	const { getMappedError } = useMappedError();
	const { alertState, handleCloseAlert, handleRequestError } = useAlertState();

	const [isLotModalOpen, setIsLotModalOpen] = useState(false);
	const [selectedLotId, setSelectedLotId] = useState<string | null>(null);
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 10;

	const { GetLots, GetLotById } = useWarehouseLayout({
		getLotsPayload: {
			company_id: companyId,
			module_code: moduleCode,
			section_id: sectionId ?? "",
		},
		getLotDetailPayload: {
			company_id: companyId,
			module_code: moduleCode,
			section_id: sectionId ?? "",
			lot_id: selectedLotId ?? "",
		},
	});

	const lotsData = useMemo<LotRow[]>(() => {
		const payload = GetLots.data;
		const list = Array.isArray(payload) ? payload : [];

		return list
			.map((item: LotListItemResponse) => ({
				lot_id: item.lot_id ?? "",
				code: item.code ?? "-",
				width_metres: item.width_metres ?? 0,
				length_metres: item.length_metres ?? 0,
				status: item.status ?? null,
				total_positions: item.total_positions ?? 0,
				occupied_positions: item.occupied_positions ?? 0,
			}))
			.filter((item: LotRow) => {
				return (
					searchTerm === "" ||
					item.code.toLowerCase().includes(searchTerm.toLowerCase())
				);
			});
	}, [GetLots.data, searchTerm]);

	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm]);

	useEffect(() => {
		if (GetLots.isError && GetLots.error) {
			const mappedError = getMappedError(GetLots.error as ApiErrorResponse);
			handleRequestError(mappedError.description);
		}
	}, [GetLots.isError, GetLots.error, getMappedError, handleRequestError]);

	const paginatedData = useMemo(() => {
		const start = (currentPage - 1) * pageSize;
		return lotsData.slice(start, start + pageSize);
	}, [lotsData, currentPage, pageSize]);

	const handleViewDetail = (lotId: string) => {
		setSelectedLotId(lotId);
		setIsDetailModalOpen(true);
	};

	const columns: TableColumn<LotRow>[] = [
		{ key: "code", label: "Código" },
		{
			key: "width_metres",
			label: "Ancho (m)",
			render(row) {
				return <span className="text-slate-300">{row.width_metres}</span>;
			},
		},
		{
			key: "length_metres",
			label: "Largo (m)",
			render(row) {
				return <span className="text-slate-300">{row.length_metres}</span>;
			},
		},
		{
			key: "positions",
			label: "Posiciones",
			render(row) {
				return (
					<span className="text-slate-300">
						{row.occupied_positions} / {row.total_positions}
					</span>
				);
			},
		},
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
				return (
					<Button
						type="button"
						size="medium"
						label="Ver detalle"
						icon={<Eye size={16} />}
						onClick={() => handleViewDetail(row.lot_id)}
						className="w-full min-w-0 shrink-0 text-[14px]! rounded-md! bg-alpac-primary-500 text-white! sm:w-auto!"
					/>
				);
			},
		},
	];

	return (
		<div className="space-y-4 p-6 bg-[#14161c] min-h-screen">
			{(GetLots.isLoading || (isDetailModalOpen && GetLotById.isLoading)) && (
				<Loader title="Cargando tramos..." />
			)}

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
						<h1 className="text-2xl font-bold text-white tracking-tight">Tramos de la sección</h1>
						<span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium">
							{lotsData.length} registros
						</span>
					</div>
				</div>

				<Button
					type="button"
					size="giant"
					label="Registrar Nuevos Tramos"
					icon={<Rows3 size={20} />}
					className="w-full! md:w-auto! mt-4! sm:mt-0! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
					onClick={() => setIsLotModalOpen(true)}
				/>
			</div>

			<div className="bg-[#1b1e27] border border-[#2a2d3d] rounded-xl p-4 mb-6 flex flex-col md:flex-row items-center gap-4">
				<div className="relative flex-1 w-full">
					<InputText
						placeholder="Buscar por código..."
						className="w-full! bg-[#14161c]! border! border-[#2a2d3d]! text-slate-200! rounded-lg! focus:ring-indigo-500! focus:border-indigo-500! placeholder-slate-500!"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
			</div>

			<DataTable
				title="Lista de tramos"
				data={paginatedData}
				columns={columns}
				isLoading={GetLots.isLoading}
				pagination={
					<Pagination
						currentPage={currentPage}
						pageSize={pageSize}
						totalRecords={lotsData.length}
						onPageChange={(page) => setCurrentPage(page)}
						disabled={lotsData.length === 0}
					/>
				}
			/>

			<LotModal
				isOpen={isLotModalOpen}
				sectionId={sectionId ?? ""}
				onSubmit={() => {
					GetLots.refetch();
				}}
				onClose={() => setIsLotModalOpen(false)}
			/>

			<LotDetailModal
				isOpen={isDetailModalOpen}
				lot={GetLotById.data ?? null}
				isLoading={GetLotById.isLoading}
				onClose={() => {
					setIsDetailModalOpen(false);
					setSelectedLotId(null);
				}}
			/>
		</div>
	);
};