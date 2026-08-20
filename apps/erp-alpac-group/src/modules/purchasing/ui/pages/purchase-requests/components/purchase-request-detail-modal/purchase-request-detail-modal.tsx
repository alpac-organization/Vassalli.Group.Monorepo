import { useEffect, useState } from "react";
import { Avatar, Badges, Button, Modal } from "@alpac/design-system";
import { usePurchase } from "@app/modules/purchasing/ui/hooks/purchase/usePurchase";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import { Loader } from "@app/shared/components/loaders/loader";
import { RoleEnum } from "@app/core/enums/role.enum";
import { BanIcon, BuildingIcon, CalendarCheckIcon, CalendarIcon, CheckIcon, FileTextIcon, MailIcon, NotebookTextIcon, XIcon } from "lucide-react";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { PurchaseRequestStatusEnum } from "@app/modules/purchasing/domain/enums/purchase-request-status.enum";
import { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import { ConfirmModal } from "@app/shared/components/confirm-modal/confirm-modal";

import type { ConfirmActionType } from "@app/shared/components/confirm-modal/confirm-modal.types";
import type { PurchaseRequestDetailModalProps } from "./purchase-request-detail-modal.types";
import type { GetPurchaseRequestDetailResponse, PurchaseRequestProductInformationList } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import type { ProcessPurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/process-purchase-request-payload";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import { purchaseRequestPriorityBadgeVariants, purchaseRequestStatusBadgeVariants, purchaseRequestTypeBadgeVariants } from "../../purchase-request.variants";
import { PriorityLevelEnum } from "@app/modules/purchasing/domain/enums/purchase-request-priority-level.enum";
import { pdf } from "@react-pdf/renderer";
import { PurchaseRequestPDF } from "../reports/purchase-request-pdf/purchase-request-pdf";

const approveButtonClass = "rounded-md! h-11 px-6! border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 hover:border-emerald-400 dark:hover:border-emerald-500/60 hover:text-emerald-700 dark:hover:text-emerald-300 disabled:opacity-40 shadow-sm transition-all duration-200";
const rejectButtonClass = "rounded-md! h-11 px-6! border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/20 hover:border-red-400 dark:hover:border-red-500/60 hover:text-red-700 dark:hover:text-red-300 shadow-sm transition-all duration-200";
const cancelButtonClass = "rounded-md! h-11 px-6! border border-orange-200 dark:border-orange-500/30 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-500/20 hover:border-orange-400 dark:hover:border-orange-500/60 hover:text-orange-700 dark:hover:text-orange-300 disabled:opacity-40";
const pdfButtonClass = "rounded-md! h-11 px-6! border border-sky-200 dark:border-sky-500/30 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-500/20 hover:border-sky-400 dark:hover:border-sky-500/60 hover:text-sky-700 dark:hover:text-sky-300 disabled:opacity-40 shadow-sm transition-all duration-200";
const sectionTitleClassName = "m-0 pb-2 text-xs font-bold tracking-wider text-slate-500 dark:text-slate-200 border-b border-slate-200 dark:border-neutral-600";

export const PurchaseRequestDetailModal = ({
	isOpen,
	onClose,
	purchaseRequest,
	onRequestSuccess,
	onRequestError,
}: PurchaseRequestDetailModalProps) => {

	const { companyId, moduleCode, role } = useUserStore();
	const { getMappedError } = useMappedError();

	const [confirmModal, setConfirmModal] = useState<{
		isOpen: boolean;
		type: ConfirmActionType;
	}>({
		isOpen: false,
		type: "CANCEL",
	});

	const [actionType, setActionType] = useState<string | null>(null);
	const [message, setMessage] = useState<string>("");
	const [isGeneratingPurchaseRequestPdf, setIsGeneratingPurchaseRequestPdf] = useState(false);

	const {
		GetPurchaseRequestDetails,
		GetPurchaseRequestProducts,
		ProcessPurchaseRequest
	} = usePurchase({
		getPurchaseRequestDetailsPayload: {
			company_id: companyId,
			module_code: moduleCode,
			purchase_request_id: purchaseRequest?.purchase_request_id ?? "",
		},
		getPurchaseRequestProductsPayload: {
			company_id: companyId,
			module_code: moduleCode,
			purchase_request_id: purchaseRequest?.purchase_request_id ?? "",
		},
	});

	const details = GetPurchaseRequestDetails.data as
		| GetPurchaseRequestDetailResponse
		| undefined;

	const productsResponse = GetPurchaseRequestProducts.data as
		| PurchaseRequestProductInformationList
		| undefined;

	const isLoading =
		GetPurchaseRequestDetails.isPending ||
		GetPurchaseRequestDetails.isFetching ||
		GetPurchaseRequestProducts.isPending ||
		GetPurchaseRequestProducts.isFetching;

	const products = productsResponse?.data ?? [];

	const canProcessRequest =
		role === RoleEnum.ADMINISTRATOR || role === RoleEnum.MANAGER;

	const isProcessing = ProcessPurchaseRequest.isPending;

	const currentStatus: string =
		purchaseRequest?.request_status ?? details?.request_status ?? "";

	const isFinalStatus = [
		PurchaseRequestStatusEnum.Approved.textValue,
		PurchaseRequestStatusEnum.Rejected.textValue,
		PurchaseRequestStatusEnum.Canceled.textValue,
		PurchaseRequestStatusEnum.Revision.textValue,
		PurchaseRequestStatusEnum.Finished.textValue
	].includes(currentStatus as Exclude<keyof typeof PurchaseRequestStatusEnum, "Pending">);

	const areActionButtonsDisabled = isProcessing || isFinalStatus;
	const isApproved = currentStatus === PurchaseRequestStatusEnum.Approved.textValue;
	const showProcessActions = canProcessRequest && !areActionButtonsDisabled;
	const showFooter = isApproved || showProcessActions;

	const openConfirm = (type: ConfirmActionType) => {

		const action =
			type === 'APPROVE' ? "Aprobar" :
				type === 'REJECT' ? "Rechazar" :
					type === 'CANCEL' ? "Cancelar" : null;

		setActionType(action);
		setConfirmModal({ isOpen: true, type });
	};

	const closeConfirm = () => {
		if (isProcessing) return;
		setConfirmModal({ isOpen: false, type: "CANCEL" });
	};

	const getSuccessMessage = (type: ConfirmActionType) => {
		if (type === "APPROVE") return "Solicitud aprobada con éxito.";
		if (type === "REJECT") return "Solicitud rechazada con éxito.";
		return "Solicitud cancelada con éxito.";
	};

	useEffect(() => {
		const confirmType: ConfirmActionType = confirmModal.type;

		const message = confirmType === "APPROVE" ?
			`La solicitud será aprovada y pasará al proceso de cotización ¿Está seguro de proceder a ${actionType} la Solicitud?` :
			`¿Está seguro de proceder a ${actionType} la Solicitud?`;

		setMessage(message);

	}, [confirmModal.type]);

	const handleGeneratePurchaseRequestPdf = async () => {
		if (!details || !products) return;

		try {
			setIsGeneratingPurchaseRequestPdf(true);
			const blob = await pdf(<PurchaseRequestPDF data={{ ...details, products }} />);
			const url = URL.createObjectURL(await blob.toBlob());
			window.open(url, "_blank");
		} catch (error) {
			onRequestError?.("Error al generar el PDF de la solicitud de compra.");
		} finally {
			setIsGeneratingPurchaseRequestPdf(false);
		}
	}

	const handleProcessPurchaseRequest = (type: ConfirmActionType, reason?: string) => {

		const purchaseRequestStatus = new Map();

		purchaseRequestStatus.set("CANCEL", PurchaseRequestStatusEnum.Canceled.value);
		purchaseRequestStatus.set("APPROVE", PurchaseRequestStatusEnum.Approved.value);
		purchaseRequestStatus.set("REJECT", PurchaseRequestStatusEnum.Rejected.value);

		const purchaseRequestId =
			purchaseRequest?.purchase_request_id || details?.purchase_request_id;

		if (!purchaseRequestId) return;

		const payload: ProcessPurchaseRequestPayload = {
			company_id: companyId,
			module_code: moduleCode,
			purchase_request_id: purchaseRequestId,
			new_status: Number(purchaseRequestStatus.get(type)),
			... (!!reason ? { reason_rejection: reason } : {})
		};

		ProcessPurchaseRequest.mutate(payload, {
			onSuccess() {
				setConfirmModal({ isOpen: false, type: "CANCEL" });
				onRequestSuccess?.(getSuccessMessage(type));
				onClose();
			},
			onError(error) {
				const mappedError = getMappedError(error);
				onRequestError?.(mappedError.description);
			},
		});
	};

	return (
		<>
			{isOpen && isLoading && (
				<Loader title="Cargando detalle de la solicitud..." />
			)}

			<Modal
				isOpen={isOpen}
				onClose={onClose}
				variant="default"
				size="7xl"
				panelClassName={[
					"flex max-h-[min(94dvh,50rem)] flex-col overflow-hidden",
					"!mx-2 !my-2 sm:!mx-4 sm:!my-6",
					"rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
				].join(" ")}

				contentClassName="flex min-h-0 flex-1 flex-col"
			>
				<div className="flex min-h-0 min-w-0 flex-1 flex-col">
					{isLoading ? (
						<div className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
							Cargando detalle...
						</div>
					) : !details ? (
						<div className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
							No se encontró información de la solicitud.
						</div>
					) : (
						<>
							<div className="scrollbar-dashboard min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
								<div className="flex flex-col gap-5 pb-2">
									<section className="flex flex-col gap-3">

										<h4 className={sectionTitleClassName}>
											Información general
										</h4>

										<div className="grid grid-cols-1 p-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

											<DetailField
												label="Estado"
												value={
													<Badges
														label={
															PurchaseRequestStatusEnum[
																details?.request_status as (keyof typeof PurchaseRequestStatusEnum)
															]?.label ?? details?.request_status
														}
														color={
															purchaseRequestStatusBadgeVariants[
																details?.request_status as keyof typeof purchaseRequestStatusBadgeVariants
															]?.badgeColor ??
															purchaseRequestStatusBadgeVariants.default.badgeColor
														}
													/>
												}
											/>

											<DetailField
												label="Tipo"
												value={
													<Badges
														label={
															PurchaseRequestEnum[
																details.request_type as (keyof typeof PurchaseRequestEnum)
															]?.label ?? details.request_type
														}
														color={
															purchaseRequestTypeBadgeVariants[
																details.request_type as keyof typeof purchaseRequestTypeBadgeVariants
															]?.badgeColor ??
															purchaseRequestTypeBadgeVariants.default.badgeColor
														}
													/>
												}
											/>

											<DetailField
												label="Prioridad"
												value={
													<Badges
														label={
															PriorityLevelEnum[
																details?.priority_level as (keyof typeof PriorityLevelEnum)
															]?.label ?? details?.priority_level
														}
														color={
															purchaseRequestPriorityBadgeVariants[
																details?.priority_level as keyof typeof purchaseRequestPriorityBadgeVariants
															]?.badgeColor ??
															purchaseRequestPriorityBadgeVariants.default.badgeColor
														}
													/>
												}
											/>

										</div>

										<div className="grid grid-cols-1 p-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
											<DetailField
												label="Fecha de Registro"
												value={formatDateToSpanishWords(details?.request_date ?? "")}
												icon={<CalendarIcon size={18} />}
											/>

											<DetailField
												label="Fecha de revisión"
												value={formatDateToSpanishWords(details?.revision_date ?? "")}
												icon={<CalendarCheckIcon size={18} />}
											/>

											<DetailField
												label="Observaciones"
												value={`${details?.observations}`}
												containerClass={(details?.observations?.length && details?.observations?.length > 80) ? "col-span-3" : ""}
												icon={<NotebookTextIcon size={18} />}
											/>


											{details.reason_rejection ? (
												<DetailField
													label="Motivo de rechazo"
													value={`${details?.reason_rejection}`}
													containerClass={(details?.reason_rejection?.length && details?.reason_rejection?.length > 80) ? "col-span-3" : ""}
													icon={<BanIcon size={18} />}
												/>
											) : null}
										</div>

									</section>

									<section className="flex flex-col gap-3">
										<h4 className={sectionTitleClassName}>
											Solicitante y sucursal
										</h4>
										<div className="grid grid-cols-1 p-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
											<DetailField
												label="Solicitante"
												value={details?.creator_user_information?.fullname ?? ""}
												icon={<Avatar label={details?.creator_user_information?.fullname ?? ""} hasLabel={false} />}
											/>
											<DetailField
												label="Email"
												value={details?.creator_user_information?.email ?? ""}
												icon={<MailIcon size={18} />}
											/>
											<DetailField
												label="Sucursal"
												value={details?.branch_information?.branch_name ?? ""}
												icon={<BuildingIcon size={18} />}
											/>
										</div>
									</section>

									<section className="flex flex-col gap-3">
										<h4 className={sectionTitleClassName}>
											Productos
										</h4>
									</section>

									<div className="overflow-hidden rounded-lg border border-slate-200 dark:border-neutral-700">
										<div className="hidden border-b border-slate-200 bg-slate-100 sm:grid sm:grid-cols-6 dark:border-neutral-700 dark:bg-neutral-800">
											<div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
												Producto
											</div>
											<div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
												Descripción
											</div>
											<div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
												Cantidad
											</div>
											<div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
												Unidad
											</div>
											<div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
												Categoría
											</div>
											<div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
												Justificación
											</div>
										</div>

										<div className="flex flex-col divide-y divide-slate-100 dark:divide-neutral-700">
											{products.length === 0 ? (
												<div className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
													No hay productos registrados.
												</div>
											) : (
												products.map((product, index) => (
													<div
														key={`${product?.purchase_request_item_id}-${product.product_details.product_id}-${index}`}
														className="grid grid-cols-1 gap-1 px-3 py-3 sm:grid-cols-6 sm:items-center sm:gap-0"
													>
														<span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:hidden">
															Producto
														</span>
														<span className="text-sm font-medium text-slate-700 dark:text-slate-200">
															{product.product_details.product_name?.trim() || "—"}
														</span>

														<span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:hidden">
															Descripción
														</span>
														<span className="text-sm text-slate-700 dark:text-slate-200">
															{product.description?.trim() || "—"}
														</span>

														<span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:hidden">
															Cantidad
														</span>
														<span className="text-sm text-slate-700 dark:text-slate-200">
															{product.quantity}
															{product.quantity_unit != null
																? ` × ${product.quantity_unit}`
																: ""}
														</span>

														<span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:hidden">
															Unidad
														</span>
														<span className="text-sm text-slate-700 dark:text-slate-200">
															{product.unit_measure_information.name?.trim() ||
																product.unit_measure_information.symbol?.trim() ||
																"—"}
														</span>

														<span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:hidden">
															Categoría
														</span>
														<span className="text-sm text-slate-700 dark:text-slate-200">
															{product.product_details.category_information.name?.trim() ||
																"—"}
														</span>

														<span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:hidden">
															Justificación
														</span>
														<span className="text-sm text-slate-700 dark:text-slate-200">
															{product.justification?.trim() || "—"}
														</span>
													</div>
												))
											)}
										</div>
									</div>

									<section className="flex flex-col gap-3">
										<div className="grid grid-cols-1 p-1 gap-4 sm:grid-cols-2">
											<DetailField
												label="Revisado por"
												value={details?.reviewer_user_information?.fullname}
												icon={<Avatar label={details?.reviewer_user_information?.fullname ?? ""} hasLabel={false} />}
											/>

											<DetailField
												label="Email del revisor"
												value={details?.reviewer_user_information?.email}
												icon={<MailIcon size={18} />}
											/>
										</div>
									</section>
								</div>
							</div>

							{showFooter && (
								<div className="-mx-4 -mb-4 mt-0 shrink-0 border-t border-t-slate-300 bg-white px-4 py-4 dark:border-t-neutral-600 dark:bg-[#272b34] sm:-mx-6 sm:-mb-6 sm:px-6 rounded-b-xl">
									<div className="flex justify-end gap-3">
										{isApproved && (
											<Button
												type="button"
												label="Descargar PDF"
												className={pdfButtonClass}
												icon={<FileTextIcon size={20} />}
												isHiddenLabelOnMobile
												disabled={!details || isGeneratingPurchaseRequestPdf}
												isLoading={isGeneratingPurchaseRequestPdf}
												onClick={handleGeneratePurchaseRequestPdf}
											/>
										)}
										{showProcessActions && (
											<>
												<Button
													type="button"
													label="Cancelar"
													className={cancelButtonClass}
													icon={<BanIcon size={20} />}
													isHiddenLabelOnMobile
													disabled={areActionButtonsDisabled}
													isLoading={isProcessing && confirmModal.type === "CANCEL"}
													onClick={() => openConfirm("CANCEL")}
												/>
												<Button
													type="button"
													label="Rechazar"
													className={rejectButtonClass}
													icon={<XIcon size={20} />}
													isHiddenLabelOnMobile
													disabled={areActionButtonsDisabled}
													isLoading={isProcessing && confirmModal.type === "REJECT"}
													onClick={() => openConfirm("REJECT")}
												/>
												<Button
													type="button"
													label="Aprobar"
													className={approveButtonClass}
													icon={<CheckIcon size={20} />}
													isHiddenLabelOnMobile
													disabled={areActionButtonsDisabled}
													isLoading={isProcessing && confirmModal.type === "APPROVE"}
													onClick={() => openConfirm("APPROVE")}
												/>
											</>
										)}
									</div>
								</div>
							)}
						</>
					)}
				</div>
			</Modal>

			<ConfirmModal
				title={message}
				buttonActionLabel={actionType!}
				buttonActionClass={
					confirmModal.type === "APPROVE"
						? approveButtonClass
						: confirmModal.type === "REJECT"
							? rejectButtonClass
							: cancelButtonClass
				}
				buttonCancelClass="rounded-md! h-11 px-6! hover:bg-slate-200 bg-slate-500 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
				isOpen={confirmModal.isOpen}
				onClose={closeConfirm}
				type={confirmModal.type}
				isLoading={isProcessing}
				disabled={isProcessing}
				handleFinalAction={handleProcessPurchaseRequest}
				hasObservation={confirmModal.type === "REJECT"}
				isObservationRequired
				observationLabel="Razón / Motivo"
			/>
		</>
	);
};
