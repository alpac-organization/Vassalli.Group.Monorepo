import { useCallback, useEffect, useState } from "react";
import { Button, DataTable, Pagination, type TableColumn } from "@alpac/design-system";
import { FileTextIcon, PackagePlusIcon } from "lucide-react";
import { PurchaseRequestModal } from "@app/modules/purchasing/ui/pages/purchase-requests/components/purchase-request-modal/purchase-request-modal";
import { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import { PurchaseRequestStatusEnum } from "@app/modules/purchasing/domain/enums/purchase-request-status.enum";
import { usePurchase } from "@app/modules/purchasing/ui/hooks/purchase/usePurchase";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { Loader } from "@app/shared/components/loaders/loader";
import { RoleEnum } from "@app/core/enums/role.enum";
import { CompanyMatadata, type CompanyType } from "@app/core/enums/company.enum";
import { PurchaseRequestDetailModal } from "@app/modules/purchasing/ui/pages/purchase-requests/components/purchase-request-detail-modal/purchase-request-detail-modal";
import { ConfirmModal } from "@app/shared/components/confirm-modal/confirm-modal";
import { PurchaseRequestFilters } from "@app/modules/purchasing/ui/pages/purchase-requests/components/purchase-request-filters/purchase-request-filters";
import { generateMonthlyStationeryReportMockPdf } from "@app/modules/purchasing/ui/pages/purchase-requests/components/reports/monthly-stationery-report-pdf/monthly-stationery-report-pdf.generate";

import type { GetPurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-request-payload";
import type { GetPurchaseRequestResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-response";
import type { MonthlyMaterialContextMenu, MonthlyMaterialTabProps } from "./monthly-materials-tab.types";
import type { DeletePurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/delete-purchase-request-payload";
import type { PurchaseRequestFilterForm } from "@app/modules/purchasing/ui/pages/purchase-requests/components/purchase-request-filters/purchase-request-filters.types";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { getPurchaseRequestColumnConfig } from "@app/modules/purchasing/ui/pages/purchase-requests/utils/purchase-request-table-config";
import { toYearMonthObject } from "@app/shared/utils/date.utils";
import { deleteButtonClass, cancelButtonClass, PAGE_SIZE, allowedStatus } from "@app/modules/purchasing/ui/pages/purchase-requests/components/tabs/monthly-materials-tab/constants/purchase-req-status";


export const MonthlyMaterialTab = ({
	currentBranchId,
	onRequestError,
	onRequestSuccess,
}: MonthlyMaterialTabProps) => {

	const { companyId, moduleCode, role, companyAlias } = useUserStore();
	const companyAcronym =
		CompanyMatadata[companyAlias.toUpperCase() as CompanyType]?.acronym ??
		CompanyMatadata.ALPAC.acronym;
	const { getMappedError } = useMappedError();
	const isAdministrator = role === RoleEnum.ADMINISTRATOR;
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isGeneratingStationeryReport, setIsGeneratingStationeryReport] = useState(false);
	const [requestDetail, setRequestDetail] = useState<GetPurchaseRequestResponse | null>(null);

	const getDefaultFilters = (): GetPurchaseRequestPayload => ({
		company_id: companyId,
		module_code: moduleCode,
		...(isAdministrator ? {} : { branch_id: currentBranchId }),
		request_type: Number(PurchaseRequestEnum.Monthly.value),
		page_number: 1,
		page_size: PAGE_SIZE,
	});

	const [filters, setFilters] = useState<GetPurchaseRequestPayload>(getDefaultFilters);

	const { GetPurchaseRequests, DeletePurchaseRequest } = usePurchase({
		getPurchaseRequestsPayload: {
			...filters,
			company_id: companyId,
			module_code: moduleCode,
			branch_id: isAdministrator ? undefined : currentBranchId,
			request_type: Number(PurchaseRequestEnum.Monthly.value),
			page_size: PAGE_SIZE,
		},
	});

	const purchaseRequests = GetPurchaseRequests.data?.data ?? [];
	const totalRecords = GetPurchaseRequests.data?.total ?? 0;
	const currentPage = filters.page_number ?? 1;

	useEffect(() => {
		setFilters(getDefaultFilters());
	}, [currentBranchId, companyId, moduleCode]);

	const getBaseOptions = (row: GetPurchaseRequestResponse): MonthlyMaterialContextMenu[] =>
		[
			{ id: "edit", label: "Editar", onClick: () => onEditRequest(row) },
			{ id: "viewDatail", label: "Ver detalle", onClick: () => onViewDetails(row) },
			{ id: "delete", label: "Eliminar", onClick: () => onDeleteRequest(row) },
		];

	const administratorOptions = (row: GetPurchaseRequestResponse): MonthlyMaterialContextMenu[] => {

		const isAllowedStatus = allowedStatus.includes(row.request_status);

		if (!isAllowedStatus) return [];

		const canModify = row.request_status === PurchaseRequestStatusEnum.Pending.textValue;

		const options = getBaseOptions(row)
			.filter(item =>
				(item.id === "edit" && canModify) ||
				(item.id === "delete" && canModify) ||
				(item.id === "viewDatail")
			);

		return options;
	}

	const managerOptions = (row: GetPurchaseRequestResponse): MonthlyMaterialContextMenu[] => {

		const isAllowedStatus = allowedStatus.includes(row.request_status);
		if (!isAllowedStatus) return [];

		const options = getBaseOptions(row).filter(item => (item.id === "viewDatail"));

		return options;
	}

	const operatorOptions = (row: GetPurchaseRequestResponse): MonthlyMaterialContextMenu[] => {

		const isAllowedStatus = allowedStatus.includes(row.request_status);
		if (!isAllowedStatus) return [];

		const options = getBaseOptions(row).filter(item => (item.id === "viewDatail"));

		return options;
	}

	const mapContextMenuOptions = new Map<RoleEnum, (row: GetPurchaseRequestResponse) => MonthlyMaterialContextMenu[]>([
		[RoleEnum.ADMINISTRATOR, administratorOptions],
		[RoleEnum.MANAGER, managerOptions],
		[RoleEnum.OPERATOR, operatorOptions],
	]);

	const contexMenuOptions: ((row: GetPurchaseRequestResponse) => MonthlyMaterialContextMenu[]) =
		mapContextMenuOptions.get(role as RoleEnum)!;

	const handleApplyFilters = (data: PurchaseRequestFilterForm) => {
		const { year, month } = toYearMonthObject(data.date);

		setFilters({
			company_id: companyId,
			module_code: moduleCode,
			...(isAdministrator ? {} : { branch_id: currentBranchId }),
			request_type: Number(PurchaseRequestEnum.Monthly.value),
			code: data.code?.trim() || undefined,
			status: data.status || undefined,
			area_id: data.area_id || undefined,
			year,
			month,
			page_number: 1,
			page_size: PAGE_SIZE,
		});
	};

	const handleClearFilters = () => {
		setFilters(getDefaultFilters());
	};

	const handlePageChange = useCallback((page: number) => {
		setFilters((prev) => ({
			...prev,
			page_number: page,
		}));
	}, []);

	const onEditRequest = (data: GetPurchaseRequestResponse) => {
		setRequestDetail(data);
		setIsModalOpen(true);
	};

	const onViewDetails = (data: GetPurchaseRequestResponse) => {
		setRequestDetail(data);
		setIsDetailModalOpen(true);
	};

	const onDeleteRequest = (data: GetPurchaseRequestResponse) => {
		setRequestDetail(data);
		setIsDeleteModalOpen(true);
	};

	const handleDeleteRequest = () => {
		const purchaseRequestId = requestDetail?.purchase_request_id;
		if (!purchaseRequestId) return;

		const payload: DeletePurchaseRequestPayload = {
			company_id: companyId,
			module_code: moduleCode,
			purchase_request_id: purchaseRequestId,
		};

		DeletePurchaseRequest.mutate(payload, {
			onSuccess() {
				setIsDeleteModalOpen(false);
				setRequestDetail(null);
				onRequestSuccess("Solicitud mensual eliminada con éxito.");
			},
			onError(error) {
				const mappedError = getMappedError(error);
				onRequestError(mappedError.description);
			},
		});
	};

	const handleGenerateStationeryReport = async () => {
		setIsGeneratingStationeryReport(true);
		try {
			await generateMonthlyStationeryReportMockPdf();
		} catch {
			onRequestError("Error al generar el reporte de papelería y útiles.");
		} finally {
			setIsGeneratingStationeryReport(false);
		}
	};

	const columnConfig: TableColumn<GetPurchaseRequestResponse>[] =
		getPurchaseRequestColumnConfig(contexMenuOptions, PurchaseRequestEnum.Monthly);

	return (
		<div>
			{(GetPurchaseRequests.isPending || GetPurchaseRequests.isFetching) && (
				<Loader title="Cargando solicitudes mensuales..." />
			)}

			<div className="mb-4 flex flex-col gap-4 md:flex-row md:flex-wrap md:items-end">
				<Button
					type="button"
					size="giant"
					label="Crear Solicitud Mensual"
					icon={<PackagePlusIcon size={20} />}
					className="w-full! md:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
					onClick={() => {
						setRequestDetail(null);
						setIsModalOpen(true);
					}}
				/>

				<Button
					type="button"
					size="giant"
					label="Generar reporte papelería"
					icon={<FileTextIcon size={20} />}
					className="w-full! md:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
					disabled={isGeneratingStationeryReport}
					isLoading={isGeneratingStationeryReport}
					onClick={handleGenerateStationeryReport}
				/>
			</div>

			<PurchaseRequestFilters
				codeLabel="N° Solicitud"
				codePlaceholder={`Ej. ${companyAcronym}-MGA-MEN-01`}
				isAdministrator={isAdministrator}
				currentBranchId={currentBranchId}
				onApplyFilters={handleApplyFilters}
				onClearFilters={handleClearFilters}
			/>

			<div className="flex flex-col gap-4">

				<DataTable
					title="Lista de solicitudes mensuales"
					data={purchaseRequests}
					columns={columnConfig}
					pagination={
						<Pagination
							currentPage={currentPage}
							pageSize={PAGE_SIZE}
							totalRecords={totalRecords}
							onPageChange={handlePageChange}
							disabled={GetPurchaseRequests.isFetching}
						/>
					}
				/>
			</div>

			<PurchaseRequestModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onRequestSuccess={onRequestSuccess}
				onRequestError={onRequestError}
				currentBranchId={currentBranchId}
				requestType={PurchaseRequestEnum.Monthly}
				purchaseRequest={requestDetail}
			/>

			<PurchaseRequestDetailModal
				isOpen={isDetailModalOpen}
				onClose={() => setIsDetailModalOpen(false)}
				purchaseRequest={requestDetail}
				onRequestSuccess={onRequestSuccess}
				onRequestError={onRequestError}
			/>

			<ConfirmModal
				type="DELETE"
				title="¿Está seguro que desea eliminar la solicitud mensual?"
				isOpen={isDeleteModalOpen}
				handleFinalAction={(actionType) => {
					if (actionType === "DELETE") handleDeleteRequest();
				}}
				onClose={() => setIsDeleteModalOpen(false)}
				buttonActionLabel="Eliminar"
				buttonActionClass={deleteButtonClass}
				buttonCancelClass={cancelButtonClass}
			/>
		</div>
	);
};
