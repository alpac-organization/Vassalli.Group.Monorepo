import { Alert, AnimatedAlertWrapper, Button, DataTable, Dropdown, InputText, Pagination, type TableColumn } from "@alpac/design-system";
import { ArrowLeft, LayoutGrid, Rows3, Rows4 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SectionModal } from "./components/section-modal/section-modal";
import { useWarehouseLayout } from "@app/modules/warehouse/ui/hooks/useWarehouseLayout";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
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

type SectionRow = {
	section_id: string;
	section_code: string;
	section_name: string;
	section_type: string | null;
	storage_type: string | null;
	is_active: boolean;
};

export const ManageSectionsPage = () => {
	const { warehouseId } = useParams<{ warehouseId: string }>();
	const navigate = useNavigate();
	const { baseUrl } = useBaseUrl();
	const { companyId, moduleCode } = useUserStore();
	const { getMappedError } = useMappedError();
	const { alertState, handleCloseAlert, handleRequestError } = useAlertState();

	const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);

	const [searchTerm, setSearchTerm] = useState("");
	const [filterType, setFilterType] = useState("");
	const [filterStorage, setFilterStorage] = useState("");
	const [filterStatus, setFilterStatus] = useState("");

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
					searchTerm === "" ||
					item.section_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					item.section_code.toLowerCase().includes(searchTerm.toLowerCase());

				const matchesType = filterType === "" || item.section_type === filterType;

				const matchesStorage = filterStorage === "" || item.storage_type === filterStorage;

				let matchesStatus = true;
				if (filterStatus === "Activa") {
					matchesStatus = item.is_active === true;
				} else if (filterStatus === "Inactiva") {
					matchesStatus = item.is_active === false;
				}

				return matchesSearch && matchesType && matchesStorage && matchesStatus;
			});
	}, [GetSections.data, searchTerm, filterType, filterStorage, filterStatus]);

	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm, filterType, filterStorage, filterStatus]);

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
							className="w-full min-w-0 shrink-0 text-[14px]! rounded-md! bg-alpac-primary-500 text-white! sm:w-auto!"
						/>
						<Button
							type="button"
							size="medium"
							label="Ver racks"
							icon={<Rows4 size={16} />}
							onClick={() => handleGoToRacks(row.section_id)}
							className="w-full min-w-0 shrink-0 text-[14px]! rounded-md! bg-slate-600! dark:bg-slate-700! text-white! sm:w-auto!"
						/>
					</div>
				);
			},
		},
	];

	return (
		<div className="space-y-4 p-6 bg-[#14161c] min-h-screen">
			{GetSections.isLoading && <Loader title="Cargando secciones..." />}

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
						onClick={() => navigate(`${baseUrl}/warehouse-admin/management`)}
						className="w-full min-w-0 shrink-0 text-[14px]! rounded-md! bg-white! dark:bg-transparent! text-slate-700! dark:text-slate-300! border! border-slate-300! dark:border-slate-600! hover:bg-slate-50! dark:hover:bg-slate-700/30! sm:w-auto!"
					/>
					<div className="flex items-center gap-4">
						<h1 className="text-2xl font-bold text-white tracking-tight">Secciones de la bodega</h1>
						<span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium">
							{sectionsData.length} registros
						</span>
					</div>
				</div>

				<Button
					type="button"
					size="giant"
					label="Registrar Nueva Sección"
					icon={<LayoutGrid size={20} />}
					className="w-full! md:w-auto! mt-4! sm:mt-0! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
					onClick={() => setIsSectionModalOpen(true)}
				/>
			</div>

			<div className="bg-[#1b1e27] border border-[#2a2d3d] rounded-xl p-4 mb-6 flex flex-col md:flex-row items-center gap-4">
				<div className="relative flex-1 w-full">
					<InputText
						placeholder="Buscar por nombre o código..."
						className="w-full! bg-[#14161c]! border! border-[#2a2d3d]! text-slate-200! rounded-lg! focus:ring-indigo-500! focus:border-indigo-500! placeholder-slate-500!"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>

				<div className="w-full md:w-52">
					<Dropdown
						placeholder="Todos los tipos"
						appearance="dark"
						className="w-full! bg-[#14161c]! border! border-[#2a2d3d]! text-slate-200! rounded-lg! focus:ring-indigo-500! focus:border-indigo-500!"
						value={filterType}
						onChange={(val) => setFilterType(val)}
						options={[
							{ value: "", label: "Todos los tipos" },
							...SectionTypeOptions,
						]}
					/>
				</div>

				<div className="w-full md:w-52">
					<Dropdown
						placeholder="Todo almacenamiento"
						appearance="dark"
						className="w-full! bg-[#14161c]! border! border-[#2a2d3d]! text-slate-200! rounded-lg! focus:ring-indigo-500! focus:border-indigo-500!"
						value={filterStorage}
						onChange={(val) => setFilterStorage(val)}
						options={[
							{ value: "", label: "Todo almacenamiento" },
							...SectionStorageTypeOptions,
						]}
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
							{ value: "Activa", label: "Activa" },
							{ value: "Inactiva", label: "Inactiva" },
						]}
					/>
				</div>
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
		</div>
	);
};