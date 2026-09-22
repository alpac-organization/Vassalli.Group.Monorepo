import { useEffect, useState } from "react";
import { Avatar, Badges, Button, Modal } from "@alpac/design-system";
import { usePurchase } from "@app/modules/purchasing/ui/hooks/purchase/usePurchase";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import { RoleEnum } from "@app/core/enums/role.enum";
import { BanIcon, BuildingIcon, CalendarCheckIcon, CalendarIcon, CheckIcon, FileTextIcon, MailIcon, NotebookTextIcon, XIcon } from "lucide-react";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { PurchaseRequestStatusEnum } from "@app/modules/purchasing/domain/enums/purchase-request-status.enum";
import { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import { ConfirmModal } from "@app/shared/components/confirm-modal/confirm-modal";
import { sectionTitleClassName } from "@app/modules/purchasing/ui/pages/purchase-requests/components/purchase-request-detail-modal/utils/styles.purchasing";
import type { ConfirmActionType } from "@app/shared/components/confirm-modal/confirm-modal.types";
import type { PurchaseRequestDetailModalProps } from "@app/modules/purchasing/ui/pages/purchase-requests/components/purchase-request-detail-modal/purchase-request-detail-modal.types";
import type { GetPurchaseRequestDetailResponse, PurchaseRequestProductInformationList } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import type { ProcessPurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/process-purchase-request-payload";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import { ImagePreviewGallery, type ImagePayload } from "@app/shared/components/image-preview-gallery/image-preview-gallery";
import { purchaseRequestPriorityBadgeVariants, purchaseRequestStatusBadgeVariants, purchaseRequestTypeBadgeVariants } from "@app/modules/purchasing/ui/pages/purchase-requests/purchase-request.variants";
import { PriorityLevelEnum } from "@app/modules/purchasing/domain/enums/purchase-request-priority-level.enum";
import { pdf } from "@react-pdf/renderer";
import { PurchaseRequestPDF } from "@app/modules/purchasing/ui/pages/purchase-requests/components/reports/purchase-request-pdf/purchase-request-pdf";
import { PurchaseRequestProductsTable } from "@app/modules/purchasing/ui/pages/purchase-requests/components/purchase-request-products-table/purchase-request-products-table";
import { approveButtonClass, cancelButtonClass, getConfirmButtonClass, getSuccessMessage, 
	pdfButtonClass, rejectButtonClass, getActionText, 
	getConfirmQuestion, LoadingMessage } from "@app/modules/purchasing/ui/pages/purchase-requests/components/purchase-request-detail-modal/utils/styles.purchasing";

export const PurchaseRequestDetailModal = ({
	isOpen,
	onClose,
	purchaseRequest,
	onRequestSuccess,
	onRequestError
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
	const [imagesModal, setImagesModal] = useState<{
		productName: string;
		images: ImagePayload[];
	} | null>(null);

	const {
		GetPurchaseRequestDetails,
		GetPurchaseRequestProducts,
		ProcessPurchaseRequest,
		GetPurchaseRequestDocument,
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

	const isGeneratingDocument =
		isGeneratingPurchaseRequestPdf || GetPurchaseRequestDocument.isPending;

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
	const showProcessActions = canProcessRequest && !areActionButtonsDisabled;
	const showFooter = Boolean(details);

	useEffect(() => {
		if (!isOpen) setImagesModal(null);
	}, [isOpen]);

	const openConfirm = (type: ConfirmActionType) => {

		const action = getActionText(type);

		setActionType(action);

		setConfirmModal({ isOpen: true, type });
	};

	const closeConfirm = () => {
		if (isProcessing) return;
		setConfirmModal({ isOpen: false, type: "CANCEL" });
	};

	useEffect(() => {
		const confirmType: ConfirmActionType = confirmModal.type;

		const message = getConfirmQuestion(confirmType);

		setMessage(message);

	}, [confirmModal.type]);

	const handleGeneratePurchaseRequestPdf = async () => {
		if (!details) return;

		// El consolidado mensual se genera desde MonthlyMaterialTab.
		if (details.request_type === PurchaseRequestEnum.Monthly.textValue) {
			try {
				setIsGeneratingPurchaseRequestPdf(true);
				const blob = await pdf(
					<PurchaseRequestPDF data={{ ...details, products }} />,
				).toBlob();
				const url = URL.createObjectURL(blob);
				window.open(url, "_blank");
			} catch (error) {
				onRequestError?.("Error al generar el PDF de la solicitud de compra." + error);
			} finally {
				setIsGeneratingPurchaseRequestPdf(false);
			}
			return;
		}

		const purchaseRequestId = purchaseRequest?.purchase_request_id || details?.purchase_request_id;
		if (!purchaseRequestId) return;

		const documentTypeValue =
			details.request_type === PurchaseRequestEnum.Eventual.textValue
				? PurchaseRequestEnum.Eventual.value
				: PurchaseRequestEnum.Requisition.value;

		GetPurchaseRequestDocument.mutate(
			{
				company_id: companyId,
				module_code: moduleCode,
				document_type: documentTypeValue,
				purchase_request_id: purchaseRequestId,
			},
			{
				onSuccess: (response) => {
					if (response?.document_url) {
						window.open(response.document_url, "_blank", "noopener,noreferrer");
					}
				},
				onError: () => {
					onRequestError?.("Error al generar el documento de la solicitud de compra.");
				},
			},
		);
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
			... (reason ? { reason_rejection: reason } : {})
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
			<LoadingMessage isOpen={isOpen} isLoading={isLoading} />

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

									<PurchaseRequestProductsTable
										products={products}
										onViewImages={setImagesModal}
									/>

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
										{Boolean(details) && (
											<Button
												type="button"
												label="Descargar PDF"
												className={pdfButtonClass}
												icon={<FileTextIcon size={20} />}
												isHiddenLabelOnMobile
												disabled={!details || isGeneratingDocument}
												isLoading={isGeneratingDocument}
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

			<Modal
				isOpen={Boolean(imagesModal)}
				onClose={() => setImagesModal(null)}
				title={`Imágenes · ${imagesModal?.productName ?? "producto"}`}
				variant="default"
				size="4xl"
				panelClassName="!max-w-4xl w-[min(calc(100vw-1rem),56rem)]"
			>
				{imagesModal && (
					<ImagePreviewGallery
						images={imagesModal.images}
						title=""
						imageAlt={`Imagen de ${imagesModal.productName}`}
					/>
				)}
			</Modal>

			<ConfirmModal
				title={message}
				buttonActionLabel={actionType!}
				buttonActionClass={getConfirmButtonClass(confirmModal.type)}
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
