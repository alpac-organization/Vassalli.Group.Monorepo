import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, ContextMenu, DataTable, Dropdown, InputText, Pagination, type ContextMenuItem, type TableColumn } from "@alpac/design-system";
import { PackagePlusIcon } from "lucide-react";
import { PurchaseRequestModal } from "../../purchase-request-modal/purchase-request-modal";
import type { OccasionalMaterialTabProps } from "./occasional-materials-tab.types";
import { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import { usePurchase } from "@app/modules/purchasing/ui/hooks/purchase/usePurchase";
import { useUserStore } from "@app/shared/stores/useUserStore";
import type { GetPurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-request-payload";
import type { GetPurchaseRequestResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-response";
import { Loader } from "@app/shared/components/loaders/loader";
import { RoleEnum } from "@app/core/enums/role.enum";

const inputClassName =
	"w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const dropdownClassName =
	"w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";
const labelClassName = "text-black! dark:text-white!";
const PAGE_SIZE = 5;

export const OccasionalMaterialTab = ({
	currentBranchId,
	onRequestError,
	onRequestSuccess,
}: OccasionalMaterialTabProps) => {
	const { companyId, moduleCode, role } = useUserStore();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [requestNumber, setRequestNumber] = useState("");
	const [requesterName, setRequesterName] = useState("");
	const [status, setStatus] = useState<string>("");

	const [filters, setFilters] = useState<GetPurchaseRequestPayload>({
		company_id: companyId,
		module_code: moduleCode,
		branch_id: currentBranchId,
		request_type: Number(PurchaseRequestEnum.Eventual.value),
		page_number: 1,
		page_size: PAGE_SIZE,
	});

	const { GetPurchaseRequests } = usePurchase({
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
		setStatus("");
	}, [currentBranchId, companyId, moduleCode]);

	const administratorOptions = (row: GetPurchaseRequestResponse): ContextMenuItem[] =>
		[
			{ label: "Editar", onClick: () => onEditRequest(row) },
			{ label: "Ver detalle", onClick: () => onViewDetails(row) },
			{ label: "Eliminar", onClick: () => onDeleteRequest(row) }
		];

	const managerOptions = (row: GetPurchaseRequestResponse): ContextMenuItem[] =>
		[
			{ label: "Editar", onClick: () => onDeleteRequest(row) },
			{ label: "Ver detalle", onClick: () => onViewDetails(row) }
		];

	const operatorOptions = (row: GetPurchaseRequestResponse): ContextMenuItem[] =>
		[
			{ label: "Ver detalle", onClick: () => onViewDetails(row) }
		];

	const mapContextMenuOptions = new Map<RoleEnum, (row: GetPurchaseRequestResponse) => ContextMenuItem[]>([
		[RoleEnum.ADMINISTRATOR, administratorOptions],
		[RoleEnum.MANAGER, managerOptions],
		[RoleEnum.OPERATOR, operatorOptions]
	]);

	const contexMenuOptions: ((row: GetPurchaseRequestResponse) => ContextMenuItem[]) =
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
		}));
	};

	const handleClearFilters = () => {
		setRequestNumber("");
		setRequesterName("");
		setStatus("");
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
		console.log(data);
	};

	const onDeleteRequest = (data: GetPurchaseRequestResponse) => {
		console.log(data);
	};

	const columnConfig: TableColumn<GetPurchaseRequestResponse>[] = useMemo(
		() => [
			{ key: "code", label: "Código" },
			{ key: "request_date", label: "Fecha de Solicitud" },
			{ key: "request_status", label: "Estado" },
			{ key: "request_type", label: "Tipo" },
			{ key: "revision_date", label: "Fecha de revisión" },
			{
				key: "actions",
				label: "Acciones",
				render: (row: GetPurchaseRequestResponse) => (
					<ContextMenu items={contexMenuOptions(row)} />
				)
			},
		],
		[],
	);

	return (
		<div>
			{GetPurchaseRequests.isPending && (
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
					placeholder="Ej. EVT-2026-001"
					className={inputClassName}
					labelClassName={labelClassName}
					value={requestNumber}
					onChange={(event) => setRequestNumber(event.target.value)}
				/>

				<InputText
					label="Solicitante"
					placeholder="Ej. Juan Pérez"
					className={inputClassName}
					labelClassName={labelClassName}
					value={requesterName}
					onChange={(event) => setRequesterName(event.target.value)}
				/>

				<Dropdown
					label="Estado"
					placeholder="Seleccione..."
					appearance="dark"
					options={[]}
					value={status}
					onChange={(value) => setStatus(String(value))}
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
		</div>
	);
};
