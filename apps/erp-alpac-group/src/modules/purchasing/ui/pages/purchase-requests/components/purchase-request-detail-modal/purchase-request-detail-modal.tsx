import { Modal } from "@alpac/design-system";
import type { PurchaseRequestDetailModalProps } from "./purchase-request-detail-modal.types";
import { usePurchase } from "@app/modules/purchasing/ui/hooks/purchase/usePurchase";
import { useUserStore } from "@app/shared/stores/useUserStore";
import type { GetPurchaseRequestDetailResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import { Loader } from "@app/shared/components/loaders/loader";

const DetailField = ({
	label,
	value,
}: {
	label: string;
	value: string | null | undefined;
}) => (
	<div className="flex flex-col gap-1">
		<span className="text-[12px]! font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
			{label}
		</span>
		<div className="flex flex-col">
			<span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
				{value?.trim() || "—"}
			</span>
		</div>
	</div>
);

export const PurchaseRequestDetailModal = ({
	isOpen,
	onClose,
	purchaseRequest,
}: PurchaseRequestDetailModalProps) => {
	const { companyId, moduleCode } = useUserStore();

	const { GetPurchaseRequestDetails } = usePurchase({
		getPurchaseRequestDetailsPayload: {
			company_id: companyId,
			module_code: moduleCode,
			purchase_request_id: purchaseRequest?.purchase_request_id ?? "",
		},
	});

	const details = GetPurchaseRequestDetails.data as
		| GetPurchaseRequestDetailResponse
		| undefined;
	const isLoading =
		GetPurchaseRequestDetails.isPending || GetPurchaseRequestDetails.isFetching;
	const products = details?.requested_products ?? [];

	return (
		<>
			{isOpen && isLoading && (
				<Loader title="Cargando detalle de la solicitud..." />
			)}

			<Modal
			isOpen={isOpen}
			onClose={onClose}
			variant="form"
			title={details?.code ? `Detalle ${details.code}` : "Detalle de solicitud"}
			panelClassName={[
				"!max-w-5xl w-[min(calc(100vw-1rem),56rem)] min-w-0",
				"max-h-[min(94dvh,46rem)] overflow-y-auto overflow-x-hidden overscroll-contain scrollbar-dashboard",
				"!mx-2 !my-2 sm:!mx-4 sm:!my-6",
				"rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
			].join(" ")}
		>
			<div className="flex min-w-0 flex-col gap-5">
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
						<section className="flex flex-col gap-3">
							<h5 className="m-0 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
								Información general
							</h5>
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
								<DetailField label="Estado" value={details.request_status} />
								<DetailField label="Tipo" value={details.request_type} />
								<DetailField label="Fecha" value={formatDateToSpanishWords(details.request_date ?? "")} />
								<DetailField
									label="Fecha de revisión"
									value={formatDateToSpanishWords(details.revision_date ?? "")}
								/>
								<DetailField
									label="Justificación"
									value={details.justification}
								/>
								{details.reason_rejection ? (
									<DetailField
										label="Motivo de rechazo"
										value={details.reason_rejection}
									/>
								) : null}
							</div>
						</section>

						<section className="flex flex-col gap-3">
							<h5 className="m-0 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
								Solicitante y sucursal
							</h5>
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
								<DetailField
									label="Solicitante"
									value={details.user_information.fullname}
								/>
								<DetailField
									label="Email"
									value={details.user_information.email}
								/>
								<DetailField
									label="Sucursal"
									value={details.branch_information.branch_name}
								/>								
							</div>
						</section>

						<section className="flex flex-col gap-3">
							<h5 className="m-0 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
								Productos
							</h5>
						</section>

						<div className="overflow-hidden rounded-lg border border-slate-200 dark:border-neutral-700">
							<div className="hidden border-b border-slate-200 bg-slate-100 sm:grid sm:grid-cols-5 dark:border-neutral-700 dark:bg-neutral-800">
								<div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
									Producto
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
											key={`${product.purchase_request_id}-${product.product_details.product_id}-${index}`}
											className="grid grid-cols-1 gap-1 px-3 py-3 sm:grid-cols-5 sm:items-center sm:gap-0"
										>
											<span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:hidden">
												Producto
											</span>
											<span className="text-sm font-medium text-slate-700 dark:text-slate-200">
												{product.product_details.product_name?.trim() || "—"}
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
					</>
				)}
			</div>
		</Modal>
		</>
	);
};
