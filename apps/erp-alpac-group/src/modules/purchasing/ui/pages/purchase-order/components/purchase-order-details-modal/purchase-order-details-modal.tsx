import { useState } from "react";
import { Avatar, Button, Modal } from "@alpac/design-system";
import {
	BuildingIcon,
	CalendarIcon,
	MailIcon,
	NotebookTextIcon,
	UserIcon,
} from "lucide-react";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import type { PurchaseOrderDetailsProps } from "@app/modules/purchasing/ui/pages/purchase-order/components/purchase-order-details-modal/purchase-order-details-modal.types";
import { usePurchaseOrderDetail } from "@app/modules/purchasing/ui/hooks/purchase/usePurchaseOrderDetail";
import { usePurchaseRequestProductsAll } from "@app/modules/purchasing/ui/hooks/purchase/usePurchaseRequestProductsAll";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { Loader } from "@app/shared/components/loaders/loader";
import { PurchaseOrderDocumentModal } from "@app/modules/purchasing/ui/pages/purchase-order/components/purchase-order-document-modal/purchase-order-document-modal";
import { PurchaseOrderItems } from "@app/modules/purchasing/ui/pages/purchase-order/components/purchase-order-details-modal/purchase-order-items";
import { buildPurchaseRequestProductMap } from "@app/modules/purchasing/ui/pages/purchase-order/components/reports/purchase-order-pdf/utils/resolve-purchase-order-report-currency";
import { stripPurchaseOrderTaxMetadata } from "@app/modules/purchasing/ui/pages/purchase-order/utils/strip-purchase-order-tax-metadata";
import { useMappedError } from "@app/shared/hooks/useMappedError";

const sectionTitleClassName =
	"m-0 pb-2 text-xs font-bold tracking-wider text-slate-500 dark:text-slate-200 border-b border-slate-200 dark:border-neutral-600";

export const PurchaseOrderDetailsModal = ({
	isOpen,
	onClose,
	purchaseOrder,
}: PurchaseOrderDetailsProps) => {
	const { companyId, moduleCode } = useUserStore();
	const { getMappedError } = useMappedError();
	const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);

	const purchaseRequestId =
		purchaseOrder?.purchase_request?.purchase_request_id ?? "";

	const { GetPurchaseOrderDetails } = usePurchaseOrderDetail({
		getPurchaseOrderDetailsPayload: {
			company_id: companyId,
			module_code: moduleCode,
			purchase_order_id: isOpen ? (purchaseOrder?.purchase_order_id ?? "") : "",
		},
	});

	const purchaseRequestProductsQuery = usePurchaseRequestProductsAll({
		companyId,
		moduleCode,
		purchaseRequestId,
		enabled: isOpen,
	});

	const details = GetPurchaseOrderDetails.data;
	const items = details?.items ?? [];
	const sentBy = details?.sent_by_user_information;
	const reviewer = details?.reviewer_user_information;
	const productByItemId = buildPurchaseRequestProductMap(
		purchaseRequestProductsQuery.data,
	);

	const isLoading =
		GetPurchaseOrderDetails.isPending || GetPurchaseOrderDetails.isFetching;
	const isError = GetPurchaseOrderDetails.isError;
	const errorMessage = isError
		? getMappedError(GetPurchaseOrderDetails.error).description ||
			"No se encontró la orden de compra."
		: null;

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
				{isLoading ? (
					<Loader title="Cargando detalle de la orden de compra..." />
				) : isError ? (
					<div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
						<p className="m-0 text-sm text-slate-600 dark:text-slate-300">
							{errorMessage}
						</p>
					</div>
				) : (
					<div className="flex flex-col gap-5">
						<section className="flex flex-col gap-3">
							<h4 className={sectionTitleClassName}>Orden</h4>
							<div className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-2 lg:grid-cols-3">
								<DetailField
									label="Código"
									value={details?.purchase_order_code ?? ""}
									icon={<NotebookTextIcon size={18} />}
								/>
								<DetailField
									label="Proveedor"
									value={details?.supplier_name ?? ""}
									icon={<UserIcon size={18} />}
								/>
								<DetailField
									label="Enviado a revisión"
									value={formatDateToSpanishWords(
										details?.sent_to_review_at ?? "",
									)}
									icon={<CalendarIcon size={18} />}
								/>
								<DetailField
									label="Comentarios"
									value={stripPurchaseOrderTaxMetadata(details?.comments)}
									icon={<NotebookTextIcon size={18} />}
									containerClass={
										(details?.comments?.length ?? 0) > 40 ? "sm:col-span-2" : ""
									}
								/>
							</div>
						</section>

						<section className="flex flex-col gap-3">
							<h4 className={sectionTitleClassName}>Personas</h4>
							<div className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-2 lg:grid-cols-3">
								<DetailField
									label="Enviado por"
									value={sentBy?.fullname ?? ""}
									icon={
										<Avatar label={sentBy?.fullname ?? ""} hasLabel={false} />
									}
								/>
								<DetailField
									label="Email del remitente"
									value={sentBy?.email ?? ""}
									icon={<MailIcon size={18} />}
								/>
								<DetailField
									label="Área del remitente"
									value={
										sentBy?.work_area_information?.work_area_name ?? ""
									}
									icon={<BuildingIcon size={18} />}
								/>
								<DetailField
									label="Revisor"
									value={reviewer?.fullname ?? ""}
									icon={
										<Avatar label={reviewer?.fullname ?? ""} hasLabel={false} />
									}
								/>
								<DetailField
									label="Email del revisor"
									value={reviewer?.email ?? ""}
									icon={<MailIcon size={18} />}
								/>
								<DetailField
									label="Área del revisor"
									value={
										reviewer?.work_area_information?.work_area_name ?? ""
									}
									icon={<BuildingIcon size={18} />}
								/>
							</div>
						</section>

						<section className="flex flex-col gap-3">
							<div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2 dark:border-neutral-600">
								<h4 className="m-0 text-xs font-bold tracking-wider text-slate-500 dark:text-slate-200">
									Productos
								</h4>
								<Button
									type="button"
									size="medium"
									label="Generar documento"
									onClick={() => setIsDocumentModalOpen(true)}
									className="w-full! rounded-md! bg-alpac-primary-500! text-[15px]! text-white! dark:bg-alpac-primary-700! sm:w-auto!"
								/>
							</div>

							<PurchaseOrderItems
								items={items}
								productByItemId={productByItemId}
							/>
						</section>
					</div>
				)}
			</Modal>

			<PurchaseOrderDocumentModal
				isOpen={isDocumentModalOpen}
				onClose={() => setIsDocumentModalOpen(false)}
				purchaseOrderId={purchaseOrder?.purchase_order_id ?? ""}
				purchaseRequestId={
					purchaseOrder?.purchase_request?.purchase_request_id
				}
				details={GetPurchaseOrderDetails.data}
			/>
		</>
	);
};
