import { m } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@alpac/design-system";
import { Rows3 } from "lucide-react";
import { useParams } from "react-router-dom";
import { LotsHeader } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/components/lots-header/lots-header";
import { LotsFiltersBar } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/components/lots-filters/lots-filters";
import { LotsTable } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/components/lots-table/lots-table";
import { LotViewer } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/components/lot-viewer/lot-viewer";
import { LotModal } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/lot-modal/lot-modal";
import { LotDetailModal } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/lot-detail-modal/lot-detail-modal";
import { EMPTY_LOT_FILTERS, type LotFilters } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/types/lots.types";
import { filtersToGetLotsParams } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/utils/filter-lots";
import { useLot } from "@app/modules/admin-warehouse/warehouse-managua/ui/hooks/useLot";
import { useSection } from "@app/modules/admin-warehouse/warehouse-managua/ui/hooks/useSection";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { Loader } from "@app/shared/components/loaders/loader";
import { useWarehouse } from "@app/modules/warehouse/ui/hooks/useWarehouse";
import { mapWarehouseDetailsToLayout } from "../sections/utils/warehouse-details.mapper";

import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { LotDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";
import type { GetLotsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-lots-req";

const PAGE_SIZE = 10;

export function TramosPage() {
	const { warehouseId = "", sectionId = "" } = useParams<{
		warehouseId: string;
		sectionId: string;
	}>();
	const { companyId, moduleCode } = useUserStore();
	const { getMappedError } = useMappedError();
	const { AlertComponent, handleRequestError } = useAlertState();

	const [isLotModalOpen, setIsLotModalOpen] = useState(false);
	const [selectedLot, setSelectedLot] = useState<LotDto | null>(null);
	const [detailLot, setDetailLot] = useState<LotDto | null>(null);
	const [isLotDetailModalOpen, setIsLotDetailModalOpen] = useState(false);
	const [appliedFilters, setAppliedFilters] = useState<LotFilters>(EMPTY_LOT_FILTERS);
	const [currentPage, setCurrentPage] = useState(1);

	const getLotsPayload = useMemo<GetLotsRequest>(
		() => ({
			company_id: companyId,
			module_code: moduleCode,
			warehouse_id: warehouseId,
			section_id: sectionId,
			...filtersToGetLotsParams(appliedFilters),
			page_number: currentPage,
			page_size: PAGE_SIZE,
		}),
		[companyId, moduleCode, warehouseId, sectionId, appliedFilters, currentPage],
	);

	const getSectionDetailsPayload = useMemo(
		() => ({
			company_id: companyId,
			module_code: moduleCode,
			warehouse_id: warehouseId,
			section_id: sectionId,
		}),
		[companyId, moduleCode, warehouseId, sectionId],
	);

	const { GetWarehouseDetails } = useWarehouse({
		getWarehouseDetailsPayload: {
			company_id: companyId,
			module_code: moduleCode,
			warehouse_id: warehouseId,
		},
	});

	const { GetSectionDetails } = useSection({
		getSectionDetailsPayload,
	});

	const { GetLots } = useLot({
		getLotsPayload,
	});

	const tramosData = useMemo(() => GetLots.data?.data ?? [], [GetLots.data]);
	const totalRecords = GetLots.data?.total ?? 0;
	const warehouseDetails = GetWarehouseDetails.data;
	const warehouseLayout = warehouseDetails
		? mapWarehouseDetailsToLayout(warehouseDetails)
		: undefined;

	const sectionCode = GetSectionDetails.data?.section_code ?? null;
	const sectionWidth = GetSectionDetails.data?.capacity?.width ?? 0;
	const sectionLength = GetSectionDetails.data?.capacity?.length ?? 0;
	const sectionPositionX = GetSectionDetails.data?.coordinates?.position_x ?? 0;
	const sectionPositionY = GetSectionDetails.data?.coordinates?.position_y ?? 0;
	const sectionIsActive = GetSectionDetails.data?.is_active ?? true;
	const sectionTotalArea = GetSectionDetails.data?.capacity?.total_area_m2 ?? 0;

	useEffect(() => {
		if (!GetLots.isError || !GetLots.error) return;
		const mappedError = getMappedError(GetLots.error as ApiErrorResponse);
		handleRequestError(mappedError.description);
	}, [GetLots.isError, GetLots.error, getMappedError, handleRequestError]);

	useEffect(() => {
		if (!GetWarehouseDetails.isError || !GetWarehouseDetails.error) return;
		const mappedError = getMappedError(
			GetWarehouseDetails.error as ApiErrorResponse,
		);
		handleRequestError(mappedError.description);
	}, [
		GetWarehouseDetails.isError,
		GetWarehouseDetails.error,
		getMappedError,
		handleRequestError,
	]);

	const handleApplyFilters = useCallback((filters: LotFilters) => {
		setAppliedFilters(filters);
		setCurrentPage(1);
	}, []);

	const handleClearFilters = useCallback(() => {
		setAppliedFilters(EMPTY_LOT_FILTERS);
		setCurrentPage(1);
	}, []);

	const handlePageChange = useCallback((page: number) => {
		setCurrentPage(page);
		setSelectedLot(null);
	}, []);

	const handleSelectRow = useCallback((lot: LotDto) => {
		setSelectedLot(lot);
	}, []);

	const handleViewDetail = useCallback((lot: LotDto) => {
		setDetailLot(lot);
		setSelectedLot(lot);
		setIsLotDetailModalOpen(true);
	}, []);

	return (
		<m.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.5 }}
			className="flex flex-col gap-4 min-w-0 w-full"
		>
			{(GetLots.isPending ||
				GetWarehouseDetails.isPending ||
				GetSectionDetails.isPending) && (
					<Loader title="Cargando tramos..." />
				)}

			{AlertComponent}

			<LotsHeader
				warehouseId={warehouseId}
				sectionId={sectionId}
				lotQuantity={totalRecords}
				sectionCode={sectionCode ?? ""}
				totalArea={sectionTotalArea}
				registerButton={
					<Button
						type="button"
						size="giant"
						label="Registrar Nuevos Tramos"
						icon={<Rows3 size={20} />}
						className="w-full! md:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
						onClick={() => setIsLotModalOpen(true)}
					/>
				}
			/>

			<LotsFiltersBar
				onApply={handleApplyFilters}
				onClear={handleClearFilters}
			/>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_800px] lg:h-[calc(100vh-330px)] min-h-0">
				<LotsTable
					data={tramosData}
					currentPage={currentPage}
					totalRecords={totalRecords}
					pageSize={PAGE_SIZE}
					selectedLot={selectedLot}
					onPageChange={handlePageChange}
					onViewDetail={handleViewDetail}
					onSelectRow={handleSelectRow}
					isFetching={GetLots.isFetching}
					height={"100%"}
					minHeight={"300px"}
				/>

				<LotViewer
					className="min-h-0 min-w-0 overflow-y-auto"
					warehouse={warehouseLayout}
					lots={tramosData}
					selectedLot={selectedLot}
					onSelectLot={handleSelectRow}
					sectionCode={sectionCode}
					sectionWidth={sectionWidth}
					sectionLength={sectionLength}
					sectionPositionX={sectionPositionX}
					sectionPositionY={sectionPositionY}
					sectionIsActive={sectionIsActive}
				/>
			</div>

			<LotModal
				isOpen={isLotModalOpen}
				warehouseId={warehouseId}
				sectionId={sectionId}
				sectionWidth={sectionWidth}
				sectionLength={sectionLength}
				onClose={() => setIsLotModalOpen(false)}
			/>

			<LotDetailModal
				isOpen={isLotDetailModalOpen}
				warehouseId={warehouseId}
				sectionId={sectionId}
				lot={detailLot}
				onClose={() => {
					setIsLotDetailModalOpen(false);
					setDetailLot(null);
				}}
			/>
		</m.div>
	);
}
