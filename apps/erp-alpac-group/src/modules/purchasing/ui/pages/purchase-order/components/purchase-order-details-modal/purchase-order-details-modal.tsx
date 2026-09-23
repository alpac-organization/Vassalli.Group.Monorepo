import { Avatar, Badges, Button, Modal } from "@alpac/design-system";
import { BuildingIcon, CalendarCheckIcon, CalendarIcon, MailIcon, NotebookTextIcon, UserIcon } from "lucide-react";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import type { PurchaseOrderDetailsProps } from "@app/modules/purchasing/ui/pages/purchase-order/components/purchase-order-details-modal/purchase-order-details-modal.types";
import { usePurchase } from "@app/modules/purchasing/ui/hooks/purchase/usePurchase";
import { useUserStore } from "@app/shared/stores/useUserStore";
import type { GetPurchaseOrderDetailsResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-order-details-response";
import type { PurchaseRequestProductInformationList } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import { PurchaseRequestStatusEnum } from "@app/modules/purchasing/domain/enums/purchase-request-status.enum";
import { purchaseRequestDestinationBadgeVariants, purchaseRequestPriorityBadgeVariants,
	 purchaseRequestStatusBadgeVariants, purchaseRequestTypeBadgeVariants } from "@app/modules/purchasing/ui/pages/purchase-requests/purchase-request.variants";
import { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import { PriorityLevelEnum } from "@app/modules/purchasing/domain/enums/purchase-request-priority-level.enum";
import { PurchaseRequestDestinationEnum } from "@app/modules/purchasing/domain/enums/purchase-request-destination.enum";
import { Loader } from "@app/shared/components/loaders/loader";
import { PurchaseOrderDocumentModal } from "@app/modules/purchasing/ui/pages/purchase-order/components/purchase-order-document-modal/purchase-order-document-modal";
import { AnalyzedQuoteProductQuotations } from "@app/modules/management/ui/pages/analyzed-quotes/components/analyzed-quote-detail-modal/analyzed-quote-product-quotations";
import { useState } from "react";
import { ImagePreviewGallery, type ImagePayload } from "@app/shared/components/image-preview-gallery/image-preview-gallery";
import { PurchaseRequestProductsTable } from "@app/modules/purchasing/ui/pages/purchase-requests/components/purchase-request-products-table/purchase-request-products-table";

const sectionTitleClassName =
	"m-0 pb-2 text-xs font-bold tracking-wider text-slate-500 dark:text-slate-200 border-b border-slate-200 dark:border-neutral-600";

export const PurchaseOrderDetailsModal = ({
	isOpen,
	onClose,
	purchaseOrder,
}: PurchaseOrderDetailsProps) => {
	const { companyId, moduleCode } = useUserStore();

	const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
	const [imagesModal, setImagesModal] = useState<{
		productName: string;
		images: ImagePayload[];
	} | null>(null);

	const { GetPurchaseOrderDetails } = usePurchase({
		getPurchaseOrderDetailsPayload: {
			company_id: companyId,
			module_code: moduleCode,
			purchase_order_id: isOpen ? (purchaseOrder?.purchase_order_id ?? "") : "",
		},
	});

	const details = GetPurchaseOrderDetails.data ?? ({} as GetPurchaseOrderDetailsResponse);
	const purchaseRequest =
		details.purchase_request;

	const purchaseRequestId = purchaseRequest?.purchase_request_id;

	const { GetPurchaseRequestProducts } = usePurchase({
		getPurchaseRequestProductsPayload:
			isOpen && purchaseRequestId
				? {
						company_id: companyId,
						module_code: moduleCode,
						purchase_request_id: purchaseRequestId,
					}
				: undefined,
	});

	const productsResponse = GetPurchaseRequestProducts.data as
		| PurchaseRequestProductInformationList
		| undefined;
	const products = productsResponse?.data ?? [];

	const sentBy = details.sent_by_user_information;
	const requestingArea = purchaseRequest?.information_from_requesting_area;
	const priorityLevel = purchaseRequest?.priority_level;
	const destination = purchaseRequest?.destination;
	const purchaseRequestStatus = purchaseRequest?.request_status;
	const purchaseRequestType = purchaseRequest?.request_type;
	const purchaseRequestDate = purchaseRequest?.request_date;
	const purchaseRequestRevisionDate = purchaseRequest?.revision_date;

	const isLoading =
		GetPurchaseOrderDetails.isPending ||
		GetPurchaseOrderDetails.isFetching ||
		GetPurchaseRequestProducts.isPending ||
		GetPurchaseRequestProducts.isFetching;

	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title="Detalle de orden de compra"
				variant="default"
				size="7xl"
				panelClassName={[
					"flex max-h-[min(94dvh,50rem)] flex-col",
					"!mx-2 !my-2 sm:!mx-4 sm:!my-6",
					"rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
				].join(" ")}
				contentClassName="flex min-h-0 flex-1 flex-col overflow-y-auto"
			>
				{isLoading && (
					<Loader title="Cargando detalle de la orden de compra..." />
				)}

				<div className="flex flex-col gap-5">
					<section className="flex flex-col gap-3">
						<h4 className={sectionTitleClassName}>Información de la orden</h4>
						<div className="grid grid-cols-1 p-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
							<DetailField
								label="Enviado por"
								value={sentBy?.fullname ?? ""}
								icon={
									<Avatar label={sentBy?.fullname ?? ""} hasLabel={false} />
								}
							/>
							<DetailField
								label="Email"
								value={sentBy?.email ?? ""}
								icon={<MailIcon size={18} />}
							/>
							<DetailField
								label="Enviado a revisión"
								value={formatDateToSpanishWords(details.sent_to_review_at)}
								icon={<CalendarIcon size={18} />}
							/>
							<DetailField
								label="Comentarios"
								value={details.comments ?? ""}
								icon={<NotebookTextIcon size={18} />}
							/>
						</div>
					</section>

					<section className="flex flex-col gap-3">
						<h4 className={sectionTitleClassName}>Solicitud</h4>

						<div className="grid grid-cols-1 p-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
							<DetailField
								label="Estado"
								value={
									<Badges
										label={
											PurchaseRequestStatusEnum[
												purchaseRequestStatus as keyof typeof PurchaseRequestStatusEnum
											]?.label ?? purchaseRequestStatus
										}
										color={
											purchaseRequestStatusBadgeVariants[
												purchaseRequestStatus as keyof typeof purchaseRequestStatusBadgeVariants
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
												purchaseRequestType as keyof typeof PurchaseRequestEnum
											]?.label ?? purchaseRequestType
										}
										color={
											purchaseRequestTypeBadgeVariants[
												purchaseRequestType as keyof typeof purchaseRequestTypeBadgeVariants
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
												priorityLevel as keyof typeof PriorityLevelEnum
											]?.label ?? priorityLevel
										}
										color={
											purchaseRequestPriorityBadgeVariants[
												priorityLevel as keyof typeof purchaseRequestPriorityBadgeVariants
											]?.badgeColor ??
											purchaseRequestPriorityBadgeVariants.default.badgeColor
										}
									/>
								}
							/>

							<DetailField
								label="Destino"
								value={
									<Badges
										label={
											PurchaseRequestDestinationEnum[
												destination as keyof typeof PurchaseRequestDestinationEnum
											]?.label ?? destination
										}
										color={
											purchaseRequestDestinationBadgeVariants[
												destination as keyof typeof purchaseRequestDestinationBadgeVariants
											]?.badgeColor ??
											purchaseRequestDestinationBadgeVariants.default.badgeColor
										}
									/>
								}
							/>

							<DetailField
								label="Solicitante"
								value={purchaseRequest?.creator_user_information?.fullname ?? ""}
								icon={<UserIcon size={18} />}
							/>
							<DetailField
								label="Centro de costo"
								value={purchaseRequest?.cost_center_information?.cost_center_name ?? ""}
								icon={<UserIcon size={18} />}
							/>

							<DetailField
								label="Revisor"
								value={purchaseRequest?.reviewer_user_information?.fullname ?? ""}
								icon={<UserIcon size={18} />}
							/>

							<DetailField
								label="Sucursal"
								value={purchaseRequest?.branch_information?.branch_name ?? ""}
								icon={<BuildingIcon size={18} />}
							/>

							<DetailField
								label="Área Solicitante"
								value={
									requestingArea?.work_area_name ??
									""
								}
								icon={<BuildingIcon size={18} />}
							/>

							<DetailField
								label="Fecha de Registro"
								value={formatDateToSpanishWords(purchaseRequestDate ?? "")}
								icon={<CalendarIcon size={18} />}
							/>

							<DetailField
								label="Fecha de revisión"
								value={formatDateToSpanishWords(
									purchaseRequestRevisionDate ?? "",
								)}
								icon={<CalendarCheckIcon size={18} />}
							/>

							<DetailField
								label="Observaciones"
								value={purchaseRequest?.observations ?? ""}
								icon={<NotebookTextIcon size={18} />}
								containerClass={
									purchaseRequest?.observations?.length &&
									purchaseRequest?.observations?.length > 40
										? "col-span-2"
										: ""
								}
							/>
						</div>
					</section>

					<section className="flex flex-col gap-3">
						<h4 className={sectionTitleClassName}>Productos</h4>

						<PurchaseRequestProductsTable
							products={products}
							onViewImages={setImagesModal}
							renderRowExtra={(product) => (
								<AnalyzedQuoteProductQuotations
									quotations={product.quotations ?? []}
								/>
							)}
						/>
					</section>

					<section className="flex flex-col gap-3">
						<h4 className={sectionTitleClassName}>Documento</h4>
						<div className="flex flex-col gap-2">
							<p className="m-0 text-sm text-slate-600 dark:text-slate-300">
								Genere la solicitud del documento de la orden de compra
								seleccionando el medio de pago.
							</p>
							<Button
								type="button"
								size="giant"
								label="Generar documento"
								onClick={() => setIsDocumentModalOpen(true)}
								className="w-full! rounded-md! bg-alpac-primary-500! text-[15px]! text-white! dark:bg-alpac-primary-700! sm:w-64!"
							/>
						</div>
					</section>
				</div>
			</Modal>

			<PurchaseOrderDocumentModal
				isOpen={isDocumentModalOpen}
				onClose={() => setIsDocumentModalOpen(false)}
				purchaseOrderId={purchaseOrder?.purchase_order_id ?? ""}
			/>
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
		</>
	);
};
