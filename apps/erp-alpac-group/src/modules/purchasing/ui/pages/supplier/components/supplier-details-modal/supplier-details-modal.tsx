import { Button, DataTable, Modal, type TableColumn } from "@alpac/design-system";
import type { SupplierDetailsModalProps } from "./supplier-details-modal.types";
import { useSupplier } from "@app/modules/purchasing/ui/hooks/supplier/useSupplier";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import {
	BadgePercentIcon,
	CreditCardIcon,
	HeadsetIcon,
	MailIcon,
	MapPinHouseIcon,
	PhoneIcon,
	ShieldCheckIcon,
	UserIcon,
} from "lucide-react";
import { Loader } from "@app/shared/components/loaders/loader";
import { BankAccountList } from "../bank-account-list/bank-account-list";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { PaymentMethodEnum } from "@app/core/enums/payment-method.enum";
import {
	SupplierExclusiveStatusEnum,
	type SupplierExclusiveStatusReview,
} from "@app/core/enums/supplier-exclusive-status.enum";
import { RoleEnum } from "@app/core/enums/role.enum";
import type { SupplierLinkedProduct } from "@app/modules/purchasing/domain/ApiContract/shared/supplier/supplier-product";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { useMemo, useState } from "react";

const sectionTitleClassName =
	"m-0 pb-2 text-xs font-bold tracking-wider text-slate-500 dark:text-slate-200 border-b border-slate-200 dark:border-neutral-600";

const resolvePaymentMethodLabel = (method?: string | number | null) => {
	if (!method) return "—";
	const found = Object.values(PaymentMethodEnum).find(
		(m) => m.stringValue === method || m.value === Number(method),
	);
	return found ? found.label : String(method);
};

const resolveExclusiveStatusLabel = (status?: string | null) => {
	const found = Object.values(SupplierExclusiveStatusEnum).find(
		(item) => item.stringValue === status,
	);
	return found?.label ?? status ?? "—";
};

export const SupplierDetailsModal = ({
	isOpen,
	onClose,
	selectedSupplier,
	onRequestSuccess,
	onRequestError,
}: SupplierDetailsModalProps) => {
	const { companyId, moduleCode, role } = useUserStore();
	const { getMappedError } = useMappedError();
	const [comments, setComments] = useState("");

	const { GetSupplierDetails, UpdateSupplierExclusiveStatus } = useSupplier({
		supplierDetailFilters:
			isOpen && selectedSupplier?.supplier_id
				? {
						company_id: companyId,
						module_code: moduleCode,
						supplier_id: selectedSupplier.supplier_id,
					}
				: undefined,
	});

	const {
		data: supplierDetails,
		isPending: isSupplierDetailsPending,
		isFetching: isSupplierDetailsFetching,
	} = GetSupplierDetails;
	const details = supplierDetails?.supplier_details;

	const isLoading = isSupplierDetailsPending || isSupplierDetailsFetching;

	const paymentModality = details?.has_credit
		? `Crédito (${details.credit_days ?? 0} días)`
		: "Contado";

	const creditCurrency = details?.credit_currency === "NIO" ? "NIO" : "USD";

	const creditLimitFormatted =
		details?.credit_limit != null
			? formatCurrency(details.credit_limit, creditCurrency)
			: "Sin límite fijado";

	const supplierName =
		supplierDetails?.supplier_legal_name ??
		selectedSupplier?.supplier_legal_name ??
		"proveedor";

	const exclusiveStatus =
		details?.exclusive_status ??
		supplierDetails?.exclusive_status ??
		selectedSupplier?.exclusive_status;

	const canReviewExclusiveStatus =
		exclusiveStatus === SupplierExclusiveStatusEnum.PendingReview.stringValue &&
		role !== RoleEnum.OPERATOR &&
		role !== RoleEnum.MANAGER;

	const products = supplierDetails?.products ?? [];

	const productColumns: TableColumn<SupplierLinkedProduct>[] = useMemo(
		() => [
			{
				key: "code",
				label: "Código",
				render: (row) => row.code || "—",
			},
			{ key: "product_name", label: "Producto" },
			{
				key: "unit_price",
				label: "Precio unitario",
				render: (row) => formatCurrency(row.unit_price, "USD"),
			},
			{
				key: "last_price_update",
				label: "Última actualización",
				render: (row) =>
					row.last_price_update
						? new Date(row.last_price_update).toLocaleString()
						: "—",
			},
			{
				key: "tier_prices",
				label: "Tiers",
				render: (row) => String(row.tier_prices?.length ?? 0),
			},
		],
		[],
	);

	const handleExclusiveStatus = (status: SupplierExclusiveStatusReview) => {
		if (!selectedSupplier?.supplier_id) return;

		UpdateSupplierExclusiveStatus.mutate(
			{
				company_id: companyId,
				module_code: moduleCode,
				supplier_id: selectedSupplier.supplier_id,
				exclusive_status: status,
				comments: comments.trim() || undefined,
			},
			{
				onSuccess: () => {
					onRequestSuccess?.(
						status === "Approved"
							? "Exclusividad aprobada correctamente."
							: "Exclusividad rechazada correctamente.",
					);
					setComments("");
				},
				onError: (error) => {
					const mapped = getMappedError(error as ApiErrorResponse);
					onRequestError?.(
						mapped.description ||
							"No se pudo actualizar el estado de exclusividad.",
					);
				},
			},
		);
	};

	return (
		<>
			{isOpen && isLoading && (
				<Loader title="Cargando detalle del proveedor..." />
			)}

			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title="Detalle del proveedor"
				variant="form"
				size="7xl"
				description={`Información registrada de ${supplierName}`}
			>
				<div className="flex flex-col gap-6">
					<div className="grid gap-6 lg:grid-cols-3">
						<section className="flex min-w-0 w-full flex-col gap-3 lg:col-span-3">
							<h5 className={sectionTitleClassName}>Información Legal</h5>
							<div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
								<DetailField label="Razón social" value={supplierName} />
								<DetailField
									label="Nombre comercial"
									value={supplierDetails?.commercial_name || "—"}
								/>
								<DetailField
									label="Número de identificación"
									value={supplierDetails?.identification_number}
								/>
								<DetailField
									label="Tipo de identificación"
									value={supplierDetails?.identification_type}
								/>
								<DetailField
									label="Tipo de constitución"
									value={supplierDetails?.constitution_type}
								/>
							</div>
						</section>

						<section className="flex min-w-0 w-full flex-col gap-3 lg:col-span-3">
							<h5 className={sectionTitleClassName}>Condiciones Comerciales</h5>
							<div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
								<DetailField
									label="Modalidad de pago"
									value={supplierDetails ? paymentModality : undefined}
									icon={<CreditCardIcon size={16} />}
								/>
								<DetailField
									label="Límite de crédito"
									value={details?.has_credit ? creditLimitFormatted : "No aplica"}
								/>
								<DetailField
									label="Alerta vencimiento"
									value={
										details?.has_credit
											? `${details?.alert_days_before_due ?? 0} días antes`
											: "No aplica"
									}
								/>
								<DetailField
									label="Método de pago preferido"
									value={resolvePaymentMethodLabel(
										details?.preferred_payment_method,
									)}
								/>
							</div>
						</section>

						<section className="flex min-w-0 w-full flex-col gap-3 lg:col-span-3">
							<h5 className={sectionTitleClassName}>
								Régimen Fiscal y Exclusividad
							</h5>
							<div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
								<DetailField
									label="Retención IR"
									value={
										details?.apply_ir_retention
											? "Aplica retención"
											: "No aplica"
									}
									icon={<BadgePercentIcon size={16} />}
								/>
								<DetailField
									label="Retención Municipal"
									value={
										details?.apply_municipal_retention
											? "Aplica retención"
											: "No aplica"
									}
									icon={<BadgePercentIcon size={16} />}
								/>
								<DetailField
									label="Exento de Impuestos"
									value={details?.is_tax_exempt ? "Sí (Exento)" : "No"}
									icon={<BadgePercentIcon size={16} />}
								/>
								<DetailField
									label="Proveedor Exclusivo"
									value={details?.is_exclusive ? "Sí" : "No"}
									icon={<ShieldCheckIcon size={16} />}
								/>
								<DetailField
									label="Estado de exclusividad"
									value={resolveExclusiveStatusLabel(exclusiveStatus)}
									icon={<ShieldCheckIcon size={16} />}
								/>
								{details?.is_exclusive && details.exclusive_brands_or_parts && (
									<DetailField
										label="Marcas o partes autorizadas"
										value={details.exclusive_brands_or_parts}
										containerClass="sm:col-span-2 lg:col-span-4"
									/>
								)}
							</div>

							{canReviewExclusiveStatus && (
								<div className="mt-2 flex flex-col gap-3 rounded-lg border border-amber-300/50 dark:border-amber-700/50 p-4">
									<p className="m-0 text-sm text-slate-700 dark:text-slate-200">
										Este proveedor tiene una solicitud de exclusividad pendiente
										de revisión.
									</p>
									<textarea
										className="w-full rounded-md border border-slate-300 dark:border-neutral-600 bg-transparent px-3 py-2 text-sm text-slate-900 dark:text-white"
										placeholder="Comentario de revisión (opcional)"
										rows={2}
										value={comments}
										onChange={(event) => setComments(event.target.value)}
									/>
									<div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
										<Button
											type="button"
											size="medium"
											label="Rechazar"
											disabled={UpdateSupplierExclusiveStatus.isPending}
											className="text-[14px]! rounded-md! text-white! bg-red-600! dark:bg-red-700!"
											onClick={() => handleExclusiveStatus("Rejected")}
										/>
										<Button
											type="button"
											size="medium"
											label="Aprobar"
											isLoading={UpdateSupplierExclusiveStatus.isPending}
											disabled={UpdateSupplierExclusiveStatus.isPending}
											className="text-[14px]! rounded-md! text-white! bg-emerald-600! dark:bg-emerald-700!"
											onClick={() => handleExclusiveStatus("Approved")}
										/>
									</div>
								</div>
							)}
						</section>

						<section className="flex min-w-0 w-full flex-col gap-3 lg:col-span-3">
							<h5 className={sectionTitleClassName}>Información de Contacto</h5>
							<div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
								<DetailField
									label="Nombre de contacto"
									value={details?.contact_name}
									icon={<UserIcon size={18} />}
								/>
								<DetailField
									label="Teléfono"
									value={details?.contact_phone_number}
									icon={<PhoneIcon size={18} />}
								/>
								<DetailField
									label="Correo de contacto"
									value={details?.contact_email}
									icon={<MailIcon size={18} />}
								/>
								<DetailField
									label="Correo de soporte"
									value={details?.email_support}
									icon={<HeadsetIcon size={18} />}
								/>
								<DetailField
									label="Dirección"
									value={details?.address}
									containerClass="lg:col-span-4"
									icon={<MapPinHouseIcon size={18} />}
								/>
							</div>
						</section>

						<section className="flex min-w-0 w-full flex-col gap-3 lg:col-span-3">
							<h5 className={sectionTitleClassName}>Productos vinculados</h5>
							<DataTable
								title="Catálogo asociado"
								data={products}
								columns={productColumns}
							/>
						</section>

						<section className="flex min-w-0 w-full flex-col gap-3 lg:col-span-3">
							<h5 className={sectionTitleClassName}>
								Cuentas Bancarias Registradas
							</h5>
							<BankAccountList
								accounts={supplierDetails?.bank_accounts ?? []}
								readOnly={true}
								onAddAccount={() => {}}
								onDeleteAccount={() => {}}
							/>
						</section>
					</div>
				</div>
			</Modal>
		</>
	);
};
