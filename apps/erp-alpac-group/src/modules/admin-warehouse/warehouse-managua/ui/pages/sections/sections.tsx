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
import { SectionViewer } from "./components/section-viewer/section-viewer";
import { useSection } from "../../hooks/useSection";
import { Button } from "@alpac/design-system";
import { LayoutGrid } from "lucide-react";
import type { SectionDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/sections/get-sections-res";

const PAGE_SIZE = 10;

export function SectionsPage() {

	const navigate = useNavigate();
	const { getMappedError } = useMappedError();

	const { companyId, moduleCode } = useUserStore();
	const { warehouseId = "" } = useParams<{ warehouseId: string }>();
	const { baseUrl } = useBaseUrl();
	const { handleRequestError, AlertComponent } = useAlertState();
	const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	const { GetSections } = useSection({
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

	return (
		<m.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.5 }}
			className="flex flex-col gap-4 sm:gap-6 min-w-0 w-full">

			{GetSections.isPending && <Loader title="Cargando secciones..." />}

			{AlertComponent}

			<SectionsHeader warehouseId={warehouseId} />

			<Button
				type="button"
				size="giant"
				label="Registrar Nueva Sección"
				icon={<LayoutGrid size={20} />}
				className="w-full! md:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
				onClick={() => setIsSectionModalOpen(true)}
			/>

			<div className="grid grid-cols-2 gap-4 h-svh">

				<SectionsTable
					data={sectionsData}
					currentPage={currentPage}
					totalRecords={totalRecords}
					pageSize={PAGE_SIZE}
					onPageChange={setCurrentPage}
					onViewLots={handleViewLots}
					onViewRacks={handleViewRacks}
					isFetching={GetSections.isFetching}
				/>

				<SectionViewer
					className="min-h-0 min-w-0 overflow-y-auto"
					companyId={companyId}
					moduleCode={moduleCode}
					warehouseId={warehouseId}
					sections={sectionsData}
				/>
			</div>

			<SectionModal
				isOpen={isSectionModalOpen}
				warehouseId={warehouseId}
				onClose={() => setIsSectionModalOpen(false)}
			/>
		</m.div>
	);
}
