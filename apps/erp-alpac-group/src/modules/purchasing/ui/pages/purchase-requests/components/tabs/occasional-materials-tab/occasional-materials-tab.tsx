import { useCallback, useEffect, useMemo, useState } from "react";
import { Badges, Button, ContextMenu, DataTable, Dropdown, InputText, Pagination, type TableColumn } from "@alpac/design-system";
import { PackagePlusIcon } from "lucide-react";
import { PurchaseRequestModal } from "../../purchase-request-modal/purchase-request-modal";
import { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import { PurchaseRequestStatusEnum, PurchaseRequestStatusOptions } from "@app/modules/purchasing/domain/enums/purchase-request-status.enum";
import { usePurchase } from "@app/modules/purchasing/ui/hooks/purchase/usePurchase";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { Loader } from "@app/shared/components/loaders/loader";
import { RoleEnum } from "@app/core/enums/role.enum";
import { PurchaseRequestDetailModal } from "../../purchase-request-detail-modal/purchase-request-detail-modal";
import { statusBadgeColor } from "@app/modules/purchasing/ui/pages/purchase-requests/utils/statusBadgeColor";
import { typeBadgeColor } from "@app/modules/purchasing/ui/pages/purchase-requests/utils/typeBadgeColor";
import { ConfirmModal } from "@app/shared/components/confirm-modal/confirm-modal";

import type { GetPurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-request-payload";
import type { GetPurchaseRequestResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-response";
import type { OccasionalMaterialContextMenu, OccasionalMaterialTabProps } from "./occasional-materials-tab.types";
import type { DeletePurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/delete-purchase-request-payload";
import { useMappedError } from "@app/shared/hooks/useMappedError";

const inputClassName =
	"w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const dropdownClassName =
	"w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";
const labelClassName = "text-black! dark:text-white!";
const contextMenuButton = "rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";
const deleteButtonClass = "rounded-md! h-11 px-6! border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/20 hover:border-red-400 dark:hover:border-red-500/60 hover:text-red-700 dark:hover:text-red-300 shadow-sm transition-all duration-200";
const cancelButtonClass = "rounded-md! h-11 px-6! hover:bg-slate-200 bg-slate-500 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600";
const PAGE_SIZE = 5;

export const OccasionalMaterialTab = ({
	currentBranchId,
	onRequestError,
	onRequestSuccess,
}: OccasionalMaterialTabProps) => {
	const { companyId, moduleCode, role } = useUserStore();
	const { getMappedError } = useMappedError();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [requestNumber, setRequestNumber] = useState("");
	const [status, setStatus] = useState<number | null>(null);
	const [requestDetail, setRequestDetail] = useState<GetPurchaseRequestResponse | null>(null);

	const [filters, setFilters] = useState<GetPurchaseRequestPayload>({
		company_id: companyId,
		module_code: moduleCode,
		branch_id: currentBranchId,
		request_type: Number(PurchaseRequestEnum.Eventual.value),
		page_number: 1,
		page_size: PAGE_SIZE,
	});

	const { GetPurchaseRequests, DeletePurchaseRequest } = usePurchase({
		getPurchaseRequestsPayload: {
			...filters,
			company_id: companyId,
			module_code: moduleCode,
			branch_id: currentBranchId,
			request_type: Number(PurchaseRequestEnum.Eventual.value),
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
			branch_id: currentBranchId,
			request_type: Number(PurchaseRequestEnum.Eventual.value),
			page_number: 1,
			page_size: PAGE_SIZE,
		});
		setRequestNumber("");
		setStatus(null);
	}, [currentBranchId, companyId, moduleCode]);

	const getBaseOptions = (row: GetPurchaseRequestResponse): OccasionalMaterialContextMenu[] =>
		[
			{ id: "edit", label: "Editar", onClick: () => onEditRequest(row) },
			{ id: "viewDatail", label: "Ver detalle", onClick: () => onViewDetails(row) },
			{ id: "delete", label: "Eliminar", onClick: () => onDeleteRequest(row) },
		];

	const administratorOptions = (row: GetPurchaseRequestResponse): OccasionalMaterialContextMenu[] => {

		const isApproved = row.request_status === PurchaseRequestStatusEnum.Approved.textValue;
		const isRejected = row.request_status === PurchaseRequestStatusEnum.Rejected.textValue;
		const isCanceled = row.request_status === PurchaseRequestStatusEnum.Canceled.textValue;

		const isProcessed = isApproved || isRejected || isCanceled;


		const options = getBaseOptions(row)
			.filter(item =>
				(item.id === "edit" && !isProcessed) ||
				(item.id === "delete" && !isProcessed) ||
				item.id === "viewDatail"
			);

		return options.filter(item => item.id);
	}

	const managerOptions = (row: GetPurchaseRequestResponse): OccasionalMaterialContextMenu[] => {

		const options = getBaseOptions(row)
			.filter(item => item.id === "viewDatail");

		return options.filter(item => item.id);
	}

	const operatorOptions = (row: GetPurchaseRequestResponse): OccasionalMaterialContextMenu[] => {

		const options = getBaseOptions(row)
			.filter(item => item.id === "viewDatail");

		return options.filter(item => item.id);
	}

	const mapContextMenuOptions = new Map<RoleEnum, (row: GetPurchaseRequestResponse) => OccasionalMaterialContextMenu[]>([
		[RoleEnum.ADMINISTRATOR, administratorOptions],
		[RoleEnum.MANAGER, managerOptions],
		[RoleEnum.OPERATOR, operatorOptions],
	]);

	const contexMenuOptions: ((row: GetPurchaseRequestResponse) => OccasionalMaterialContextMenu[]) =
		mapContextMenuOptions.get(role as RoleEnum)!;

	const handleApplyFilters = () => {
		setFilters((prev) => ({
			...prev,
			company_id: companyId,
			module_code: moduleCode,
			branch_id: currentBranchId,
			request_type: Number(PurchaseRequestEnum.Eventual.value),
			code: requestNumber.trim() || undefined,
			page_number: 1,
			page_size: PAGE_SIZE,
			status: status || undefined
		}));
	};

	const handleClearFilters = () => {
		setRequestNumber("");
		setStatus(null);
		setFilters({
			company_id: companyId,
			module_code: moduleCode,
			branch_id: currentBranchId,
			request_type: Number(PurchaseRequestEnum.Eventual.value),
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

	const onEditRequest = (data: GetPurchaseRequestResponse) => {
		console.log(data);
		setIsModalOpen(true);
	};

	const onViewDetails = (data: GetPurchaseRequestResponse) => {
		setRequestDetail(data);
		setIsDetailModalOpen(true);
	};

	const onDeleteRequest = (data: GetPurchaseRequestResponse) => {
		console.log(data);
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
				onRequestSuccess("Solicitud eventual eliminada con éxito.");
			},
			onError(error) {
				const mappedError = getMappedError(error);
				onRequestError(mappedError.description);
			},
		});
	};

	const columnConfig: TableColumn<GetPurchaseRequestResponse>[] = useMemo(
		() => [
			{ key: "code", label: "Código" },
			{ key: "request_date", label: "Fecha de Solicitud" },
			{
				key: "request_status",
				label: "Estado",
				render: (row: GetPurchaseRequestResponse) => {
					const statusLabel =
						Object.values(PurchaseRequestStatusEnum).find(
							(item) => item.textValue === row.request_status,
						)?.label ?? row.request_status;

					return (
						<Badges
							label={statusLabel}
							color={statusBadgeColor(row.request_status)}
						/>
					);
				},
			},
			{
				key: "request_type",
				label: "Tipo",
				render: (row: GetPurchaseRequestResponse) => {
					const typeLabel =
						Object.values(PurchaseRequestEnum).find(
							(type) => type.textValue === row.request_type,
						)?.label ?? row.request_type;

					return (
						<Badges
							label={typeLabel}
							color={typeBadgeColor(row.request_type)}
						/>
					);
				},
			},
			{ key: "revision_date", label: "Fecha de revisión" },
			{
				key: "actions",
				label: "Acciones",
				render: (row: GetPurchaseRequestResponse) => (
					<ContextMenu
						items={contexMenuOptions(row)}
						triggerClassName={contextMenuButton}
					/>
				),
			},
		],
		[],
	);

	return (
		<div>
			{(GetPurchaseRequests.isPending || GetPurchaseRequests.isFetching) && (
				<Loader title="Cargando solicitudes eventuales..." />
			)}

			<Button
				type="button"
				size="giant"
				label="Crear Solicitud Eventual"
				icon={<PackagePlusIcon size={20} />}
				className="w-full! md:w-auto! mb-4! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
				onClick={() => {
					setIsModalOpen(true);
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
					label="N° Solicitud"
					placeholder="Ej. ALP-MGA-EVE-01"
					className={inputClassName}
					labelClassName={labelClassName}
					value={requestNumber}
					onChange={(event) => setRequestNumber(event.target.value)}
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
					title="Lista de solicitudes eventuales"
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
				requestType={PurchaseRequestEnum.Eventual}
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
				title="¿Está seguro que desea eliminar la solicitud eventual?"
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
