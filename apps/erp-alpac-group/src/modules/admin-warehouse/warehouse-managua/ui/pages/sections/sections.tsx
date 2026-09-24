import { m } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SectionsHeader } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/sections-header/sections-header";
import { SectionsTable } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/sections-table/sections-table";
import { SectionModal } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/section-modal/section-modal";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { Loader } from "@app/shared/components/loaders/loader";
import { ConfirmModal } from "@app/shared/components/confirm-modal/confirm-modal";
import { SectionViewer } from "./components/section-viewer/section-viewer";
import { useSection } from "../../hooks/useSection";
import type { SectionDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/sections/get-sections-res";
import type { DeleteSectionRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/sections/delete-section-req";
import { Button } from "@alpac/design-system";
import { LayoutGrid } from "lucide-react";

const PAGE_SIZE = 10;

const deleteButtonClass =
	"rounded-md! h-11 px-6! border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/20 hover:border-red-400 dark:hover:border-red-500/60 hover:text-red-700 dark:hover:text-red-300 shadow-sm transition-all duration-200";
const cancelButtonClass =
	"rounded-md! h-11 px-6! hover:bg-slate-200 bg-slate-500 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600";

export function SectionsPage() {

	const navigate = useNavigate();
	const { getMappedError } = useMappedError();

	const { companyId, moduleCode } = useUserStore();
	const { warehouseId = "" } = useParams<{ warehouseId: string }>();
	const { baseUrl } = useBaseUrl();
	const {
		handleRequestError,
		handleRequestSuccess,
		AlertComponent,
	} = useAlertState();
	const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [editingSection, setEditingSection] = useState<SectionDto | null>(null);
	const [sectionToDelete, setSectionToDelete] = useState<SectionDto | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

	const { GetSections, DeleteSection } = useSection({
		getSectionsPayload: {
			company_id: companyId,
			module_code: moduleCode,
			warehouse_id: warehouseId,
			page_number: currentPage,
			page_size: PAGE_SIZE,
		},
	});

	const sectionsData = GetSections.data?.data ?? [];
	const totalRecords = GetSections.data?.total ?? 0;

	useEffect(() => {
		if (!GetSections.isError || !GetSections.error) return;
		try {
			const error = GetSections.error;
			const mappedError = getMappedError(error);
			handleRequestError(mappedError?.description || "Error al cargar las secciones");
		} catch {
			handleRequestError("Error al cargar las secciones");
		}
	}, [
		GetSections.isError,
		GetSections.error,
		getMappedError,
		handleRequestError,
	]);

	const handleViewLots = useCallback(
		(section: SectionDto) => {
			navigate(
				`${baseUrl}/warehouse-admin/management/sections/${warehouseId}/lots/${section.section_id}`,
			);
		},
		[baseUrl, navigate, warehouseId],
	);

	const handleViewRacks = useCallback(
		(section: SectionDto) => {
			navigate(
				`${baseUrl}/warehouse-admin/management/sections/${warehouseId}/racks/${section.section_id}`,
			);
		},
		[baseUrl, navigate, warehouseId],
	);

	const handleSelectRow = (section: SectionDto) => {
		setSelectedSectionId(section.section_id);
	};

	const handleUpdateSection = (section: SectionDto) => {
		setEditingSection(section);
		setIsSectionModalOpen(true);
	};

	const handleDeleteSection = (section: SectionDto) => {
		setSectionToDelete(section);
		setIsDeleteModalOpen(true);
	};

	const handleConfirmDeleteSection = () => {
		if (!sectionToDelete) return;

		const payload: DeleteSectionRequest = {
			company_id: companyId,
			module_code: moduleCode,
			warehouse_id: warehouseId,
			section_id: sectionToDelete.section_id,
		};

		DeleteSection.mutate(payload, {
			onSuccess() {
				setIsDeleteModalOpen(false);
				setSectionToDelete(null);
				if (selectedSectionId === sectionToDelete.section_id) {
					setSelectedSectionId(null);
				}
				handleRequestSuccess("Sección eliminada exitosamente.");
			},
			onError(error) {
				const mappedError = getMappedError(error);
				handleRequestError(mappedError.description);
			},
		});
	};

	const handleCloseSectionModal = () => {
		setIsSectionModalOpen(false);
		setEditingSection(null);
	};

	return (
		<m.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.5 }}
			className="flex flex-col gap-4 sm:gap-6 min-w-0 w-full">

			{GetSections.isPending && <Loader title="Cargando secciones..." />}

			{AlertComponent}

			<SectionsHeader
				warehouseId={warehouseId}
				warehouseCode="BODEGA_005"
				location="ALPAC Managua"
				totalArea={37 * 61}
				sectionQuantity={totalRecords}
				ocuppation={0}
				registerButton={
					<Button
						type="button"
						size="giant"
						label="Registrar Nueva Sección"
						icon={<LayoutGrid size={20} />}
						className="w-full! lg:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
						onClick={() => {
							setEditingSection(null);
							setIsSectionModalOpen(true);
						}}
					/>
				} />

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_800px] lg:h-[calc(100vh-330px)] min-h-0">

				<SectionsTable
					data={sectionsData}
					currentPage={currentPage}
					totalRecords={totalRecords}
					pageSize={PAGE_SIZE}
					onPageChange={setCurrentPage}
					onViewLots={handleViewLots}
					onViewRacks={handleViewRacks}
					onSelectRow={handleSelectRow}
					onUpdateSection={handleUpdateSection}
					onDeleteSection={handleDeleteSection}					
					isFetching={GetSections.isFetching}
					height={"100%"}
					minHeight={"300px"}
				/>

				<SectionViewer
					className="min-h-0 min-w-0 overflow-y-auto"
					sections={sectionsData}
					selectedSectionId={selectedSectionId}
				/>

			</div>

			<SectionModal
				isOpen={isSectionModalOpen}
				warehouseId={warehouseId}
				section={editingSection}
				onClose={handleCloseSectionModal}
			/>

			<ConfirmModal
				type="DELETE"
				title={`¿Está seguro que desea eliminar la sección ${sectionToDelete?.section_code ?? ""}?`}
				isOpen={isDeleteModalOpen}
				handleFinalAction={(actionType) => {
					if (actionType === "DELETE") handleConfirmDeleteSection();
				}}
				onClose={() => {
					if (DeleteSection.isPending) return;
					setIsDeleteModalOpen(false);
					setSectionToDelete(null);
				}}
				buttonActionLabel="Eliminar"
				buttonActionClass={deleteButtonClass}
				buttonCancelClass={cancelButtonClass}
				isLoading={DeleteSection.isPending}
				disabled={DeleteSection.isPending}
			/>
		</m.div>
	);
}
