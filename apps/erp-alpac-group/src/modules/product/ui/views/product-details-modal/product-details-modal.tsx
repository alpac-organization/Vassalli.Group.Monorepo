import { Modal } from "@alpac/design-system";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useProduct } from "@app/modules/product/ui/hooks/useProduct";
import { Loader } from "@app/shared/components/loaders/loader";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import { ProductUsageTypeEnum } from "@app/core/enums/product-usage-type.enum";
import type { ProductDetailsModalProps } from "@app/modules/product/ui/views/product-details-modal/product-details-modal.types";

const sectionTitleClassName =
	"m-0 pb-2 text-xs font-bold tracking-wider text-slate-500 dark:text-slate-200 border-b border-slate-200 dark:border-neutral-600";

const resolveUsageLabel = (value?: string) => {
	const found = Object.values(ProductUsageTypeEnum).find(
		(item) => item.stringValue === value,
	);
	return found?.label ?? value ?? "—";
};

export const ProductDetailsModal = ({
	isOpen,
	onClose,
	selectedProduct,
}: ProductDetailsModalProps) => {
	const { companyId, moduleCode } = useUserStore();

	const { GetProductDetails } = useProduct({
		getProductDetailsPayload:
			isOpen && selectedProduct?.product_id
				? {
						company_id: companyId,
						module_code: moduleCode,
						product_id: selectedProduct.product_id,
					}
				: undefined,
	});

	const details = GetProductDetails.data;
	const isLoading =
		GetProductDetails.isPending || GetProductDetails.isFetching;
	const productName =
		details?.product_name ?? selectedProduct?.product_name ?? "producto";

	return (
		<>
			{isOpen && isLoading && (
				<Loader title="Cargando detalle del producto..." />
			)}

			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title="Detalle del producto"
				variant="form"
				size="4xl"
				description={`Información registrada de ${productName}`}
			>
				<div className="flex flex-col gap-6">
					<section className="flex flex-col gap-3">
						<h5 className={sectionTitleClassName}>Información general</h5>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
							<DetailField label="Código" value={details?.code || "—"} />
							<DetailField label="Nombre" value={productName} />
							<DetailField
								label="Categoría"
								value={details?.category?.name || "—"}
							/>
							<DetailField
								label="Tipo de uso"
								value={resolveUsageLabel(details?.product_usage_type)}
							/>
							<DetailField
								label="Exento de impuestos"
								value={details?.is_tax_exempt ? "Sí" : "No"}
							/>
							<DetailField
								label="Descripción"
								value={details?.description || "—"}
								containerClass="sm:col-span-2 xl:col-span-3"
							/>
						</div>
					</section>
				</div>
			</Modal>
		</>
	);
};
