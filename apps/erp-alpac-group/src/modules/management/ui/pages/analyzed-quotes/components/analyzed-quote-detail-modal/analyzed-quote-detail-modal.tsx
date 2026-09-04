import { useMemo } from "react";
import { Avatar, Badges, Modal } from "@alpac/design-system";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import { Loader } from "@app/shared/components/loaders/loader";
import { BanIcon, BuildingIcon, CalendarCheckIcon, CalendarIcon, MailIcon, NotebookTextIcon } from "lucide-react";
import { PurchaseRequestStatusEnum } from "@app/modules/purchasing/domain/enums/purchase-request-status.enum";
import { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import { PriorityLevelEnum } from "@app/modules/purchasing/domain/enums/purchase-request-priority-level.enum";
import { useManagement } from "@app/modules/management/ui/hooks/useManagement";
import { usePurchase } from "@app/modules/purchasing/ui/hooks/purchase/usePurchase";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import {
	purchaseRequestPriorityBadgeVariants,
	purchaseRequestStatusBadgeVariants,
	purchaseRequestTypeBadgeVariants,
} from "@app/modules/purchasing/ui/pages/purchase-requests/purchase-request.variants";
import type { AnalyzedQuoteDetailModalProps } from "./analyzed-quote-detail-modal.types";
import type { PurchaseRequestProductInformationList } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import { AnalyzedQuoteProductQuotations } from "./analyzed-quote-product-quotations";

const sectionTitleClassName = "m-0 pb-2 text-xs font-bold tracking-wider text-slate-500 dark:text-slate-200 border-b border-slate-200 dark:border-neutral-600";

const LoadingMessage = ({ isOpen, isLoading }: { isOpen: boolean, isLoading: boolean }) => {
	if (!isOpen) return null;
	if (!isLoading) return null;
	return <Loader title="Cargando detalle de la solicitud..." />;
}

const EmptyPurchaseRequestMessage = ({
	isLoading,
	purchaseRequest,
}: {
	isLoading: boolean;
	purchaseRequest: unknown;
}) => {
	if (isLoading) return null;
	if (purchaseRequest) return null;
	return (
		<div className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
			No se encontró información de la solicitud.
		</div>
	);
}

const EmptyProductsMessage = ({ productsCount }: { productsCount: number }) => {
	if (productsCount > 0) return null;
	return (
		<div className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
			No hay productos registrados.
		</div>
	);
}

export const AnalyzedQuoteDetailModal = ({
	isOpen,
	onClose,
	review,
}: AnalyzedQuoteDetailModalProps) => {

	const { companyId, moduleCode } = useUserStore();

	const payloadGetRequisitionManagementReviewDetail = useMemo(() => {

		if (!isOpen || !review?.purchase_requests_reviewed_management_id) return undefined;

		return {
			company_id: companyId,
			module_code: moduleCode,
			requisition_management_review_id: review.purchase_requests_reviewed_management_id,
		};
	}, [isOpen, review?.purchase_requests_reviewed_management_id, companyId, moduleCode]);

	const { GetRequisitionManagementReviewDetails } = useManagement({
		payloadGetRequisitionManagementReviewDetail
	})

	const details = GetRequisitionManagementReviewDetails.data;

	const purchaseRequest = details?.purchase_request_details;

	const { GetPurchaseRequestProducts } = usePurchase({
		getPurchaseRequestProductsPayload: purchaseRequest?.purchase_request_id
			? {
				company_id: companyId,
				module_code: moduleCode,
				purchase_request_id: purchaseRequest.purchase_request_id,
			}
			: undefined,
	});

	const productsResponse = GetPurchaseRequestProducts.data as
		| PurchaseRequestProductInformationList
		| undefined;

	const isLoading =
		GetRequisitionManagementReviewDetails.isPending ||
		GetRequisitionManagementReviewDetails.isFetching ||
		GetPurchaseRequestProducts.isPending ||
		GetPurchaseRequestProducts.isFetching;

	const products = productsResponse?.data ?? [];

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
					<EmptyPurchaseRequestMessage
						isLoading={isLoading}
						purchaseRequest={purchaseRequest}
					/>

					{!isLoading && purchaseRequest && (
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
															purchaseRequest.request_status as (keyof typeof PurchaseRequestStatusEnum)
														]?.label ?? purchaseRequest.request_status
													}
													color={
														purchaseRequestStatusBadgeVariants[
															purchaseRequest.request_status as keyof typeof purchaseRequestStatusBadgeVariants
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
															purchaseRequest.request_type as (keyof typeof PurchaseRequestEnum)
														]?.label ?? purchaseRequest.request_type
													}
													color={
														purchaseRequestTypeBadgeVariants[
															purchaseRequest.request_type as keyof typeof purchaseRequestTypeBadgeVariants
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
															purchaseRequest.priority_level as (keyof typeof PriorityLevelEnum)
														]?.label ?? purchaseRequest.priority_level
													}
													color={
														purchaseRequestPriorityBadgeVariants[
															purchaseRequest.priority_level as keyof typeof purchaseRequestPriorityBadgeVariants
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
											value={formatDateToSpanishWords(purchaseRequest.request_date ?? "")}
											icon={<CalendarIcon size={18} />}
										/>

										<DetailField
											label="Fecha de revisión"
											value={formatDateToSpanishWords(purchaseRequest.revision_date ?? "")}
											icon={<CalendarCheckIcon size={18} />}
										/>

										<DetailField
											label="Observaciones"
											value={`${purchaseRequest.observations ?? ""}`}
											containerClass={(purchaseRequest.observations?.length && purchaseRequest.observations.length > 80) ? "col-span-3" : ""}
											icon={<NotebookTextIcon size={18} />}
										/>

										{purchaseRequest.reason_rejection ? (
											<DetailField
												label="Motivo de rechazo"
												value={`${purchaseRequest.reason_rejection}`}
												containerClass={(purchaseRequest.reason_rejection.length > 80) ? "col-span-3" : ""}
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
											value={purchaseRequest.creator_user_information?.fullname ?? ""}
											icon={<Avatar label={purchaseRequest.creator_user_information?.fullname ?? ""} hasLabel={false} />}
										/>
										<DetailField
											label="Email"
											value={purchaseRequest.creator_user_information?.email ?? ""}
											icon={<MailIcon size={18} />}
										/>
										<DetailField
											label="Sucursal"
											value={purchaseRequest.branch_information?.branch_name ?? ""}
											icon={<BuildingIcon size={18} />}
										/>
										<DetailField
											label="Área solicitante"
											value={purchaseRequest.information_from_requesting_area?.work_area_name ?? ""}
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
										<EmptyProductsMessage productsCount={products.length} />
										{products.length > 0 &&
											products.map((product, index) => (
												<div
													key={`${product?.purchase_request_item_id}-${product.product_details.product_id}-${index}`}
													className="flex flex-col"
												>
													<div className="grid grid-cols-1 gap-6 px-3 py-3 sm:grid-cols-6 sm:items-center">
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

													<AnalyzedQuoteProductQuotations
														quotations={product.quotations ?? []}
													/>
												</div>
											))
										}
									</div>
								</div>

								<section className="flex flex-col gap-3">
									<div className="grid grid-cols-1 p-1 gap-4 sm:grid-cols-2">
										<DetailField
											label="Revisado por"
											value={purchaseRequest.reviewer_user_information?.fullname}
											icon={<Avatar label={purchaseRequest.reviewer_user_information?.fullname ?? ""} hasLabel={false} />}
										/>

										<DetailField
											label="Email del revisor"
											value={purchaseRequest.reviewer_user_information?.email}
											icon={<MailIcon size={18} />}
										/>
									</div>
								</section>
							</div>
						</div>
					)}
				</div>
			</Modal>
		</>
	);
};
