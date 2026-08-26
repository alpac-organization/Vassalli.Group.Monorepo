import { useCallback, useEffect, useState } from "react";
import { Button, DataTable, Dropdown, InputText, Pagination, type TableColumn } from "@alpac/design-system";
import { PackagePlusIcon } from "lucide-react";
import { PurchaseRequestModal } from "@app/modules/purchasing/ui/pages/purchase-requests/components/purchase-request-modal/purchase-request-modal";
import { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import { PurchaseRequestStatusEnum, PurchaseRequestStatusOptions } from "@app/modules/purchasing/domain/enums/purchase-request-status.enum";
import { usePurchase } from "@app/modules/purchasing/ui/hooks/purchase/usePurchase";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { Loader } from "@app/shared/components/loaders/loader";
import { RoleEnum } from "@app/core/enums/role.enum";
import { PurchaseRequestDetailModal } from "@app/modules/purchasing/ui/pages/purchase-requests/components/purchase-request-detail-modal/purchase-request-detail-modal";
import { ConfirmModal } from "@app/shared/components/confirm-modal/confirm-modal";
import { useMappedError } from "@app/shared/hooks/useMappedError";

import { type RequisitionContextMenu, type RequisitionTabProps } from "./requisition-tab.types";
import type { DeletePurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/delete-purchase-request-payload";
import type { GetPurchaseRequestResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-response";
import type { GetPurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-request-payload";
import { getPurchaseRequestColumnConfig } from "@app/modules/purchasing/ui/pages/purchase-requests/utils/purchase-request-table-config";

const inputClassName =
	"w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const dropdownClassName =
	"w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";
const labelClassName = "text-black! dark:text-white!";
const deleteButtonClass = "rounded-md! h-11 px-6! border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/20 hover:border-red-400 dark:hover:border-red-500/60 hover:text-red-700 dark:hover:text-red-300 shadow-sm transition-all duration-200";
const cancelButtonClass = "rounded-md! h-11 px-6! hover:bg-slate-200 bg-slate-500 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600";
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

	const { companyId, moduleCode, role } = useUserStore();
	const { getMappedError } = useMappedError();
	const [isRequisitionModalOpen, setIsRequisitionModalOpen] = useState(false);
	const [isRequisitionDetailModalOpen, setIsRequisitionDetailModalOpen] = useState(false);
	const [isDeleteRequisitionModalOpen, setisDeleteRequisitionModalOpen] = useState(false);
	const [requisitionNumber, setRequisitionNumber] = useState("");
	const [status, setStatus] = useState<number | null>(null);
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

	const { GetPurchaseRequests, DeletePurchaseRequest } = usePurchase({
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
		setRequisitionNumber("");
		setStatus(null);
	}, [currentBranchId, companyId, moduleCode]);

	const getBaseOptions = (row: GetPurchaseRequestResponse): RequisitionContextMenu[] =>
		[
			{ id: "edit", label: "Editar", onClick: () => onEditRequisition(row) },
			{ id: "viewDatail", label: "Ver detalle", onClick: () => onViewDetails(row) },
			{ id: "delete", label: "Eliminar", onClick: () => onDeleteRequisition(row) },
		];

	const administratorOptions = (row: GetPurchaseRequestResponse): RequisitionContextMenu[] => {

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

	const managerOptions = (row: GetPurchaseRequestResponse): RequisitionContextMenu[] => {

		const isAllowedStatus = allowedStatus.includes(row.request_status);
		if (!isAllowedStatus) return [];

		const options = getBaseOptions(row).filter(item => (item.id === "viewDatail"));

		return options;
	}

	const operatorOptions = (row: GetPurchaseRequestResponse): RequisitionContextMenu[] => {

		const isAllowedStatus = allowedStatus.includes(row.request_status);
		if (!isAllowedStatus) return [];

		const options = getBaseOptions(row).filter(item => (item.id === "viewDatail"));

		return options;
	}

	const mapContextMenuOptions = new Map<RoleEnum, (row: GetPurchaseRequestResponse) => RequisitionContextMenu[]>([
		[RoleEnum.ADMINISTRATOR, administratorOptions],
		[RoleEnum.MANAGER, managerOptions],
		[RoleEnum.OPERATOR, operatorOptions]
	]);

	const contexMenuOptions: ((row: GetPurchaseRequestResponse) => RequisitionContextMenu[]) =
		mapContextMenuOptions.get(role as RoleEnum)!;

	const handleApplyFilters = () => {
		setFilters((prev) => ({
			...prev,
			company_id: companyId,
			module_code: moduleCode,
			branch_id: isAdministrator ? undefined : currentBranchId,
			request_type: Number(PurchaseRequestEnum.Requisition.value),
			code: requisitionNumber.trim() || undefined,
			page_number: 1,
			page_size: PAGE_SIZE,
			status: status || undefined
		}));
	};

	const handleClearFilters = () => {
		setRequisitionNumber("");
		setStatus(null);
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

	const onDeleteRequisition = (data: GetPurchaseRequestResponse) => {
		setRequisitionDetail(data);
		setisDeleteRequisitionModalOpen(true)
	};

	const handleDeleteRequisition = () => {
		const purchaseRequestId = requisitionDetail?.purchase_request_id;
		if (!purchaseRequestId) return;

		const payload: DeletePurchaseRequestPayload = {
			company_id: companyId,
			module_code: moduleCode,
			purchase_request_id: purchaseRequestId,
		};

		DeletePurchaseRequest.mutate(payload, {
			onSuccess() {
				setisDeleteRequisitionModalOpen(false);
				setRequisitionDetail(null);
				onRequestSuccess("Requisición eliminada con éxito.");
			},
			onError(error) {
				const mappedError = getMappedError(error);
				onRequestError(mappedError.description);
			},
		});
	};

	const columnConfig: TableColumn<GetPurchaseRequestResponse>[] =
		getPurchaseRequestColumnConfig(contexMenuOptions, PurchaseRequestEnum.Requisition);

	return (
		<div>
			{(GetPurchaseRequests.isPending || GetPurchaseRequests.isFetching) && (
				<Loader title="Cargando requisiciones..." />
			)}

			<Button
				type="button"
				size="giant"
				label="Crear Requisición"
				icon={<PackagePlusIcon size={20} />}
				className="w-full! md:w-auto! mb-4! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
				onClick={() => {
					setIsRequisitionModalOpen(true);
				}}
			/>

			<div className="flex justify-between items-center pt-4 pb-4 border-t border-t-slate-600 dark:border-t-neutral-600">
				<div className="flex flex-col justify-center">
					<h3 className="p-0! m-0!">Filtros</h3>
				</div>
			</div>

			<form
				onSubmit={(event) => {
					event.preventDefault();
					handleApplyFilters();
				}}
				className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-end mb-4!"
			>
				<InputText
					label="N° Requisición"
					placeholder="Ej. ALP-MGA-REQ-01"
					className={inputClassName}
					labelClassName={labelClassName}
					value={requisitionNumber}
					onChange={(event) => setRequisitionNumber(event.target.value)}
				/>

				<Dropdown
					label="Estado"
					placeholder="Seleccione..."
					appearance="dark"
					options={PurchaseRequestStatusOptions ?? []}
					value={status}
					onChange={(value) => setStatus(value)}
					className={dropdownClassName}
					labelClassName={labelClassName}
					valueClassName={labelClassName}
				/>

				<Button
					type="submit"
					size="giant"
					label="Aplicar filtros"
					className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
				/>

				<Button
					type="button"
					size="giant"
					label="Limpiar filtros"
					onClick={handleClearFilters}
					className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
				/>
			</form>

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
			/>

			<PurchaseRequestDetailModal
				isOpen={isRequisitionDetailModalOpen}
				onClose={() => setIsRequisitionDetailModalOpen(false)}
				purchaseRequest={requisitionDetail}
				onRequestSuccess={onRequestSuccess}
				onRequestError={onRequestError}
			/>

			<ConfirmModal
				type="DELETE"
				title="¿Está seguro que desea eliminar requisición?"
				isOpen={isDeleteRequisitionModalOpen}
				handleFinalAction={(actionType) => {
					if (actionType === "DELETE") handleDeleteRequisition();
				}}
				onClose={() => {
					if (DeletePurchaseRequest.isPending) return;
					setisDeleteRequisitionModalOpen(false);
				}}
				buttonActionLabel="Eliminar"
				buttonActionClass={deleteButtonClass}
				buttonCancelClass={cancelButtonClass}
				isLoading={DeletePurchaseRequest.isPending}
				disabled={DeletePurchaseRequest.isPending}
			/>

		</div>
	);
};
