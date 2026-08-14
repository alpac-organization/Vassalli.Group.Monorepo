import {
	Alert,
	AnimatedAlertWrapper,
	Breadcrumb,
	Button,
	ContextMenu,
	DataTable,
	InputText,
	Pagination,
	SectionHeader,
	useTheme,
	type TableColumn,
} from "@alpac/design-system";
import { Rows3 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { m } from "framer-motion";
import { LotModal } from "./components/lot-modal/lot-modal";
import { LotDetailModal } from "./components/lot-detail-modal/lot-detail-modal";
import { useWarehouseLayout } from "@app/modules/warehouse/ui/hooks/useWarehouseLayout";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { Loader } from "@app/shared/components/loaders/loader";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { RackStatusBadge } from "@app/modules/warehouse/ui/warehouse-admin/utils/layout-badges";
import type { LotListItemResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/lot-response";
import {
	inputClassName,
	labelClassName,
	primaryButtonClassName,
} from "@app/modules/warehouse/ui/warehouse-admin/utils/page-styles";

const contextMenuButton =
	"rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";

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
	const { theme } = useTheme();
	const { urlImage, neutralUrlImage } = useCompanyStore();
	const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;

	const [isLotModalOpen, setIsLotModalOpen] = useState(false);
	const [selectedLotId, setSelectedLotId] = useState<string | null>(null);
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

	const [draftSearchTerm, setDraftSearchTerm] = useState("");
	const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
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
					appliedSearchTerm === "" ||
					item.code.toLowerCase().includes(appliedSearchTerm.toLowerCase())
				);
			});
	}, [GetLots.data, appliedSearchTerm]);

	useEffect(() => {
		setCurrentPage(1);
	}, [appliedSearchTerm]);

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

	const handleApplyFilters = useCallback(
		(event: React.FormEvent) => {
			event.preventDefault();
			setAppliedSearchTerm(draftSearchTerm.trim());
		},
		[draftSearchTerm],
	);

	const handleClearFilters = useCallback(() => {
		setDraftSearchTerm("");
		setAppliedSearchTerm("");
	}, []);

	const handleViewDetail = (lotId: string) => {
		setSelectedLotId(lotId);
		setIsDetailModalOpen(true);
	};

	const columns: TableColumn<LotRow>[] = [
		{ key: "code", label: "Código" },
		{ key: "width_metres", label: "Ancho (m)" },
		{ key: "length_metres", label: "Largo (m)" },
		{
			key: "positions",
			label: "Posiciones",
			render(row) {
				return (
					<span>
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
				const isLastItem =
					paginatedData.length > 0 &&
					paginatedData[paginatedData.length - 1]?.lot_id === row.lot_id;

				return (
					<ContextMenu
						items={[
							{
								label: "Ver detalle",
								onClick: () => handleViewDetail(row.lot_id),
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
							label: "Tramos",
							url: `${baseUrl}/warehouse-admin/management/sections/${warehouseId}/lots/${sectionId}`,
							onClick: (url) => navigate(url),
						},
					]}
				/>
			</div>

			<SectionHeader
				title="Tramos de la sección"
				subtitle="Consulte y registre tramos de la sección seleccionada"
				logoImage={activeLogo}
			/>

			<div className="flex justify-between items-center pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
				<div className="flex flex-col justify-center">
					<h3 className="p-0! m-0!">Acciones</h3>
					<small className="text-gray-500 dark:text-gray-300">
						Registre nuevos tramos
					</small>
				</div>
			</div>

			<div className="w-full dark:bg-[#272b34]! p-4 rounded-md border border-slate-600 dark:border-neutral-600">
				<div className="w-full flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:justify-start">
					<Button
						type="button"
						size="giant"
						label="Registrar Nuevos Tramos"
						icon={<Rows3 size={20} />}
						className={primaryButtonClassName}
						onClick={() => setIsLotModalOpen(true)}
					/>
				</div>
			</div>

			<div className="flex justify-between items-center pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
				<div className="flex flex-col justify-center">
					<h3 className="p-0! m-0!">Filtros</h3>
					<small className="text-gray-500 dark:text-gray-300">
						Filtra por código de tramo
					</small>
				</div>
			</div>

			<form
				onSubmit={handleApplyFilters}
				className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-end"
			>
				<div className="flex flex-col">
					<InputText
						label="Código"
						placeholder="Buscar por código..."
						className={inputClassName}
						labelClassName={labelClassName}
						value={draftSearchTerm}
						onChange={(e) => setDraftSearchTerm(e.target.value)}
					/>
				</div>

				<div className="flex flex-col">
					<Button
						type="submit"
						size="giant"
						className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
						label="Aplicar filtros"
					/>
				</div>

				<div className="flex flex-col">
					<Button
						type="button"
						size="giant"
						className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
						label="Limpiar filtros"
						onClick={handleClearFilters}
					/>
				</div>
			</form>

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
		</m.div>
	);
};
