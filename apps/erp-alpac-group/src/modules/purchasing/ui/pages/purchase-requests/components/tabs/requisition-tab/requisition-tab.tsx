import { useCallback, useEffect, useState } from "react";
import { Button, DataTable, Pagination, type TableColumn } from "@alpac/design-system";
import { PackagePlusIcon } from "lucide-react";
import { PurchaseRequestModal } from "@app/modules/purchasing/ui/pages/purchase-requests/components/purchase-request-modal/purchase-request-modal";
import { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import { PurchaseRequestStatusEnum } from "@app/modules/purchasing/domain/enums/purchase-request-status.enum";
import { usePurchase } from "@app/modules/purchasing/ui/hooks/purchase/usePurchase";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { Loader } from "@app/shared/components/loaders/loader";
import { RoleEnum } from "@app/core/enums/role.enum";
import { CompanyMatadata, type CompanyType } from "@app/core/enums/company.enum";
import { PurchaseRequestDetailModal } from "@app/modules/purchasing/ui/pages/purchase-requests/components/purchase-request-detail-modal/purchase-request-detail-modal";
import { AnnulModal } from "@app/shared/components/annul-modal/annul-modal";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { PurchaseRequestFilters } from "@app/modules/purchasing/ui/pages/purchase-requests/components/purchase-request-filters/purchase-request-filters";

import { type RequisitionContextMenu, type RequisitionTabProps } from "./requisition-tab.types";
import type { GetPurchaseRequestResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-response";
import type { GetPurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-request-payload";
import type { PurchaseRequestFilterForm } from "@app/modules/purchasing/ui/pages/purchase-requests/components/purchase-request-filters/purchase-request-filters.types";
import { getPurchaseRequestColumnConfig } from "@app/modules/purchasing/ui/pages/purchase-requests/utils/purchase-request-table-config";
import { toYearMonthObject } from "@app/shared/utils/date.utils";
const PAGE_SIZE = 5;


const allowedStatus: string[] = [
	PurchaseRequestStatusEnum.Pending.textValue,
	PurchaseRequestStatusEnum.Approved.textValue,
	PurchaseRequestStatusEnum.Rejected.textValue,
	PurchaseRequestStatusEnum.Canceled.textValue,
	PurchaseRequestStatusEnum.Revision.textValue,
	PurchaseRequestStatusEnum.Finished.textValue
];

export const RequisitionTab = ({
	currentBranchId,
	onRequestError,
	onRequestSuccess,
}: RequisitionTabProps) => {

	const { companyId, moduleCode, role, companyAlias } = useUserStore();
	const companyAcronym =
		CompanyMatadata[companyAlias.toUpperCase() as CompanyType]?.acronym ??
		CompanyMatadata.ALPAC.acronym;
	const { getMappedError } = useMappedError();
	const [isRequisitionModalOpen, setIsRequisitionModalOpen] = useState(false);
	const [isRequisitionDetailModalOpen, setIsRequisitionDetailModalOpen] = useState(false);
	const [isAnnulModalOpen, setIsAnnulModalOpen] = useState(false);
	const [requisitionDetail, setRequisitionDetail] = useState<GetPurchaseRequestResponse | null>(null);

	const isAdministrator = role === RoleEnum.ADMINISTRATOR;


	const [filters, setFilters] = useState<GetPurchaseRequestPayload>({
		company_id: companyId,
		module_code: moduleCode,
		...(isAdministrator ? {} : { branch_id: currentBranchId }),
		request_type: Number(PurchaseRequestEnum.Requisition.value),
		page_number: 1,
		page_size: PAGE_SIZE,
	});


	const { GetPurchaseRequests, AnnulPurchaseRequest } = usePurchase({
		getPurchaseRequestsPayload: {
			...filters,
			company_id: companyId,
			module_code: moduleCode,
			branch_id: isAdministrator ? undefined : currentBranchId,
			request_type: Number(PurchaseRequestEnum.Requisition.value),
			page_size: PAGE_SIZE,
		},
	});

	const purchaseRequests = GetPurchaseRequests.data?.data ?? [];
	const totalRecords = GetPurchaseRequests.data?.total ?? 0;
	const currentPage = filters.page_number ?? 1;

	useEffect(() => {
		setFilters({
			company_id: companyId,
			module_code: moduleCode,
			...(isAdministrator ? {} : { branch_id: currentBranchId }),
			request_type: Number(PurchaseRequestEnum.Requisition.value),
			page_number: 1,
			page_size: PAGE_SIZE,
		});
	}, [currentBranchId, companyId, moduleCode]);

	const getBaseOptions = (row: GetPurchaseRequestResponse): RequisitionContextMenu[] =>
		[
			{ id: "edit", label: "Editar", onClick: () => onEditRequisition(row) },
			{ id: "viewDatail", label: "Ver detalle", onClick: () => onViewDetails(row) },
			{ id: "annul", label: "Anular", onClick: () => onAnnulRequisition(row) },
		];

	const administratorOptions = (row: GetPurchaseRequestResponse): RequisitionContextMenu[] => {

		const isAllowedStatus = allowedStatus.includes(row.request_status);

		if (!isAllowedStatus) return [];

		const canModify = row.request_status === PurchaseRequestStatusEnum.Pending.textValue;
		const canAnnul =
			row.request_status !== PurchaseRequestStatusEnum.Rejected.textValue &&
			row.request_status !== PurchaseRequestStatusEnum.Canceled.textValue &&
			row.request_status !== PurchaseRequestStatusEnum.Finished.textValue;

		const options = getBaseOptions(row)
			.filter(item =>
				(item.id === "edit" && canModify) ||
				(item.id === "annul" && canAnnul) ||
				(item.id === "viewDatail")
			);

		return options;
	}

	const managerOptions = (row: GetPurchaseRequestResponse): RequisitionContextMenu[] => {

		const isAllowedStatus = allowedStatus.includes(row.request_status);
		if (!isAllowedStatus) return [];

		const canAnnul =
			row.request_status !== PurchaseRequestStatusEnum.Rejected.textValue &&
			row.request_status !== PurchaseRequestStatusEnum.Canceled.textValue &&
			row.request_status !== PurchaseRequestStatusEnum.Finished.textValue;

		const options = getBaseOptions(row).filter(item =>
			item.id === "viewDatail" ||
			(item.id === "annul" && canAnnul)
		);

		return options;
	}

	const operatorOptions = (row: GetPurchaseRequestResponse): RequisitionContextMenu[] => {

		const isAllowedStatus = allowedStatus.includes(row.request_status);
		if (!isAllowedStatus) return [];

		const canAnnul =
			row.request_status === PurchaseRequestStatusEnum.Pending.textValue ||
			row.request_status === PurchaseRequestStatusEnum.Approved.textValue;

		const options = getBaseOptions(row).filter(item =>
			item.id === "viewDatail" ||
			(item.id === "annul" && canAnnul)
		);

		return options;
	}

	const mapContextMenuOptions = new Map<RoleEnum, (row: GetPurchaseRequestResponse) => RequisitionContextMenu[]>([
		[RoleEnum.ADMINISTRATOR, administratorOptions],
		[RoleEnum.MANAGER, managerOptions],
		[RoleEnum.OPERATOR, operatorOptions]
	]);

	const contexMenuOptions: ((row: GetPurchaseRequestResponse) => RequisitionContextMenu[]) =
		mapContextMenuOptions.get(role as RoleEnum) ?? (() => []);

	const handleApplyFilters = (data: PurchaseRequestFilterForm) => {
		const { year, month } = toYearMonthObject(data.date);

		setFilters((prev) => ({
			...prev,
			company_id: companyId,
			module_code: moduleCode,
			branch_id: isAdministrator ? undefined : currentBranchId,
			request_type: Number(PurchaseRequestEnum.Requisition.value),
			code: data?.code?.trim(),
			year,
			month,
			page_number: 1,
			page_size: PAGE_SIZE,
			status: data.status || undefined,
			area_id: data.area_id || undefined,
		}));
	};

	const handleClearFilters = () => {
		setFilters({
			company_id: companyId,
			module_code: moduleCode,
			...(isAdministrator ? {} : { branch_id: currentBranchId }),
			request_type: Number(PurchaseRequestEnum.Requisition.value),
			page_number: 1,
			page_size: PAGE_SIZE,
		});
	};

	const handlePageChange = useCallback((page: number) => {
		setFilters((prev) => ({
			...prev,
			page_number: page,
		}));
	}, []);

	const onEditRequisition = (data: GetPurchaseRequestResponse) => {
		setRequisitionDetail(data);
		setIsRequisitionModalOpen(true);
	};

	const onViewDetails = (data: GetPurchaseRequestResponse) => {
		setRequisitionDetail(data);
		setIsRequisitionDetailModalOpen(true)
	};

	const onAnnulRequisition = (data: GetPurchaseRequestResponse) => {
		setRequisitionDetail(data);
		setIsAnnulModalOpen(true);
	};

	const handleConfirmAnnul = (data: { scope: number; reason: string }) => {
		const purchaseRequestId = requisitionDetail?.purchase_request_id;
		if (!purchaseRequestId) return;

		AnnulPurchaseRequest.mutate(
			{
				company_id: companyId,
				module_code: moduleCode,
				purchase_request_id: purchaseRequestId,
				reason: data.reason,
			},
			{
				onSuccess() {
					setIsAnnulModalOpen(false);
					setRequisitionDetail(null);
					onRequestSuccess("Solicitud de compra anulada con éxito.");
				},
				onError(error) {
					const mappedError = getMappedError(error);
					onRequestError(mappedError.description ?? "Error al anular la solicitud de compra.");
				},
			}
		);
	};

	const columnConfig: TableColumn<GetPurchaseRequestResponse>[] =
		getPurchaseRequestColumnConfig(contexMenuOptions, PurchaseRequestEnum.Requisition);

	return (
		<div>
			{(GetPurchaseRequests.isPending || GetPurchaseRequests.isFetching) && (
				<Loader title="Cargando requisiciones..." />
			)}

			<div className="mb-4 flex flex-col gap-4 md:flex-row md:flex-wrap md:items-end">
				<Button
					type="button"
					size="giant"
					label="Crear Requisición"
					icon={<PackagePlusIcon size={20} />}
					className="w-full! md:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
					onClick={() => {
						setRequisitionDetail(null);
						setIsRequisitionModalOpen(true);
					}}
				/>
			</div>

			<PurchaseRequestFilters
				codeLabel="N° Requisición"
				codePlaceholder={`Ej. ${companyAcronym}-MGA-REQ-01`}
				isAdministrator={isAdministrator}
				currentBranchId={currentBranchId}
				onApplyFilters={handleApplyFilters}
				onClearFilters={handleClearFilters}
			/>

			<div className="flex flex-col">
				<DataTable
					title="Lista de requisiciones"
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
				isOpen={isRequisitionModalOpen}
				onClose={() => setIsRequisitionModalOpen(false)}
				onRequestSuccess={onRequestSuccess}
				onRequestError={onRequestError}
				currentBranchId={currentBranchId}
				requestType={PurchaseRequestEnum.Requisition}
				purchaseRequest={requisitionDetail}
			/>

			<PurchaseRequestDetailModal
				isOpen={isRequisitionDetailModalOpen}
				onClose={() => setIsRequisitionDetailModalOpen(false)}
				purchaseRequest={requisitionDetail}
				onRequestSuccess={onRequestSuccess}
				onRequestError={onRequestError}
			/>

			<AnnulModal
				isOpen={isAnnulModalOpen}
				title="Anular Solicitud de Compra"
				description={`¿Está seguro que desea anular la solicitud de compra ${requisitionDetail?.code ?? ""}? Esta acción es irreversible.`}
				showScopeSelection={false}
				isSubmitting={AnnulPurchaseRequest.isPending}
				onClose={() => {
					if (AnnulPurchaseRequest.isPending) return;
					setIsAnnulModalOpen(false);
				}}
				onConfirm={handleConfirmAnnul}
			/>

		</div>
	);
};
