import { Button } from "@alpac/design-system";
import { ImagesIcon } from "lucide-react";
import { extractPurchaseRequestItemImages } from "@app/modules/purchasing/ui/pages/purchase-requests/utils/purchase-request-item-images.utils";
import { viewImagesButtonClass } from "@app/modules/purchasing/ui/pages/purchase-requests/components/purchase-request-detail-modal/utils/styles.purchasing";
import type { PurchaseRequestProductsTableProps } from "./purchase-request-products-table.types";

const COLUMN_HEADERS = [
	"Producto",
	"Descripción",
	"Cantidad",
	"Unidad",
	"Categoría",
	"Justificación",
	"Imágenes",
] as const;

const mobileLabelClassName =
	"text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:hidden";
const cellValueClassName = "text-sm text-slate-700 dark:text-slate-200";
const cellValueMediumClassName = "text-sm font-medium text-slate-700 dark:text-slate-200";

const EmptyProductsMessage = ({ productsCount }: { productsCount: number }) => {
	if (productsCount > 0) return null;
	return (
		<div className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
			No hay productos registrados.
		</div>
	);
};

export const PurchaseRequestProductsTable = ({
	products,
	onViewImages,
	renderRowExtra,
}: PurchaseRequestProductsTableProps) => {
	return (
		<div className="overflow-hidden rounded-lg border border-slate-200 dark:border-neutral-700">
			<div className="hidden border-b border-slate-200 bg-slate-100 sm:grid sm:grid-cols-7 dark:border-neutral-700 dark:bg-neutral-800">
				{COLUMN_HEADERS.map((header) => (
					<div
						key={header}
						className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
					>
						{header}
					</div>
				))}
			</div>

			<div className="flex flex-col divide-y divide-slate-100 dark:divide-neutral-700">
				<EmptyProductsMessage productsCount={products.length} />
				{products.length > 0 &&
					products.map((product, index) => {
						const productImages = extractPurchaseRequestItemImages(
							product.additional_data,
						);
						const productName =
							product.product_details.product_name?.trim() || "producto";

						const rowGrid = (
							<div className="grid grid-cols-1 gap-6 px-3 py-3 sm:grid-cols-7 sm:items-center">
								<span className={mobileLabelClassName}>Producto</span>
								<span className={cellValueMediumClassName}>
									{product.product_details.product_name?.trim() || "—"}
								</span>

								<span className={mobileLabelClassName}>Descripción</span>
								<span className={cellValueClassName}>
									{product.description?.trim() || "—"}
								</span>

								<span className={mobileLabelClassName}>Cantidad</span>
								<span className={cellValueClassName}>
									{product.quantity}
									{product.quantity_unit != null
										? ` × ${product.quantity_unit}`
										: ""}
								</span>

								<span className={mobileLabelClassName}>Unidad</span>
								<span className={cellValueClassName}>
									{product.unit_measure_information.name?.trim() ||
										product.unit_measure_information.symbol?.trim() ||
										"—"}
								</span>

								<span className={mobileLabelClassName}>Categoría</span>
								<span className={cellValueClassName}>
									{product.product_details.category_information.name?.trim() ||
										"—"}
								</span>

								<span className={mobileLabelClassName}>Justificación</span>
								<span className={cellValueClassName}>
									{product.justification?.trim() || "—"}
								</span>

								<span className={mobileLabelClassName}>Imágenes</span>
								{productImages.length > 0 ? (
									<Button
										type="button"
										size="small"
										label="Ver imágenes"
										icon={<ImagesIcon size={16} />}
										className={viewImagesButtonClass}
										onClick={() =>
											onViewImages({
												productName,
												images: productImages,
											})
										}
									/>
								) : (
									<span className={cellValueClassName}>—</span>
								)}
							</div>
						);

						return (
							<div
								key={`${product?.purchase_request_item_id}-${product.product_details.product_id}-${index}`}
								className={renderRowExtra ? "flex flex-col" : undefined}
							>
								{rowGrid}
								{renderRowExtra?.(product)}
							</div>
						);
					})}
			</div>
		</div>
	);
};
