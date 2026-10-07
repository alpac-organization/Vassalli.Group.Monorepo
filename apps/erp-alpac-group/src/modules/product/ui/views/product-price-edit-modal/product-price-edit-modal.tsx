import { useEffect, useState } from "react";
import { Button, InputText, Modal } from "@alpac/design-system";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useProduct } from "@app/modules/product/ui/hooks/useProduct";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import {
	emptyCatalogLinkTier,
	mapCatalogLinkItemsToTierPayload,
	type CatalogLinkTierForm,
} from "@app/modules/product/ui/components/catalog-link-editor/catalog-link-editor.types";
import type { ProductPriceEditModalProps } from "@app/modules/product/ui/views/product-price-edit-modal/product-price-edit-modal.types";

const inputClassName =
	"w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";
const primaryButtonClassName =
	"text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!";
const secondaryButtonClassName =
	"text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!";
const dangerButtonClassName =
	"text-[14px]! rounded-md! text-white! bg-red-600! dark:bg-red-700!";

export const ProductPriceEditModal = ({
	isOpen,
	onClose,
	productId,
	supplier,
	onRequestSuccess,
	onRequestError,
}: ProductPriceEditModalProps) => {
	const { companyId, moduleCode } = useUserStore();
	const { getMappedError } = useMappedError();
	const { UpdateProductSupplierPrice } = useProduct();

	const [unitPrice, setUnitPrice] = useState("");
	const [tiers, setTiers] = useState<CatalogLinkTierForm[]>([]);

	useEffect(() => {
		if (!isOpen || !supplier) return;

		setUnitPrice(String(supplier.unit_price ?? ""));
		setTiers(
			(supplier.tier_prices ?? []).map((tier) => ({
				id: tier.tier_price_id || crypto.randomUUID(),
				min_quantity: String(tier.min_quantity ?? ""),
				preferential_price: String(tier.preferential_price ?? ""),
				valid_from: tier.valid_from?.slice(0, 10) ?? "",
				valid_to: tier.valid_to?.slice(0, 10) ?? "",
			})),
		);
	}, [isOpen, supplier]);

	const isSaving = UpdateProductSupplierPrice.isPending;
	const supplierLabel =
		supplier?.commercial_name?.trim() ||
		supplier?.supplier_legal_name ||
		supplier?.supplier_id ||
		"—";

	const handleSave = () => {
		if (!supplier) return;

		const newUnitPrice = unitPrice.trim() ? Number(unitPrice) : undefined;
		const tierPrices = mapCatalogLinkItemsToTierPayload(tiers);

		if (newUnitPrice == null && tierPrices.length === 0) {
			onRequestError?.(
				"Debe indicar un nuevo precio unitario o al menos un tier.",
			);
			return;
		}

		UpdateProductSupplierPrice.mutate(
			{
				company_id: companyId,
				module_code: moduleCode,
				product_id: productId,
				supplier_id: supplier.supplier_id,
				new_unit_price: newUnitPrice,
				tier_prices: tierPrices.length > 0 ? tierPrices : undefined,
			},
			{
				onSuccess: () => {
					onRequestSuccess?.("Precios actualizados correctamente.");
					onClose();
				},
				onError: (error) => {
					const mapped = getMappedError(error as ApiErrorResponse);
					onRequestError?.(
						mapped.description || "No se pudieron actualizar los precios.",
					);
				},
			},
		);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Editar precios"
			variant="form"
			size="7xl"
			description={`Proveedor: ${supplierLabel}`}
		>
			<div className="flex flex-col gap-6">
				<InputText
					label="Nuevo precio unitario"
					type="number"
					placeholder="0.00"
					className={inputClassName}
					labelClassName={labelClassName}
					value={unitPrice}
					onChange={(event) => setUnitPrice(event.target.value)}
				/>

				<div className="flex flex-col gap-3">
					<div className="flex items-center justify-between">
						<span className="text-sm font-semibold text-slate-800 dark:text-white">
							Precios preferenciales (tiers)
						</span>
						<Button
							type="button"
							size="small"
							label="Agregar tier"
							className={secondaryButtonClassName}
							onClick={() => setTiers((prev) => [...prev, emptyCatalogLinkTier()])}
						/>
					</div>

					{tiers.length === 0 ? (
						<small className="text-slate-500 dark:text-slate-400">
							Sin tiers. Opcional.
						</small>
					) : (
						tiers.map((tier, index) => (
							<div
								key={`edit-tier-${index}`}
								className="grid grid-cols-1 gap-3 md:grid-cols-5 items-end"
							>
								<InputText
									label="Cant. mínima"
									type="number"
									className={inputClassName}
									labelClassName={labelClassName}
									value={tier.min_quantity}
									onChange={(event) =>
										setTiers((prev) =>
											prev.map((item, itemIndex) =>
												itemIndex === index
													? { ...item, min_quantity: event.target.value }
													: item,
											),
										)
									}
								/>
								<InputText
									label="Precio preferencial"
									type="number"
									className={inputClassName}
									labelClassName={labelClassName}
									value={tier.preferential_price}
									onChange={(event) =>
										setTiers((prev) =>
											prev.map((item, itemIndex) =>
												itemIndex === index
													? {
															...item,
															preferential_price: event.target.value,
														}
													: item,
											),
										)
									}
								/>
								<InputText
									label="Válido desde"
									type="date"
									className={inputClassName}
									labelClassName={labelClassName}
									value={tier.valid_from}
									onChange={(event) =>
										setTiers((prev) =>
											prev.map((item, itemIndex) =>
												itemIndex === index
													? { ...item, valid_from: event.target.value }
													: item,
											),
										)
									}
								/>
								<InputText
									label="Válido hasta"
									type="date"
									className={inputClassName}
									labelClassName={labelClassName}
									value={tier.valid_to}
									onChange={(event) =>
										setTiers((prev) =>
											prev.map((item, itemIndex) =>
												itemIndex === index
													? { ...item, valid_to: event.target.value }
													: item,
											),
										)
									}
								/>
								<Button
									type="button"
									size="medium"
									label="Eliminar"
									className={dangerButtonClassName}
									onClick={() =>
										setTiers((prev) =>
											prev.filter((_, itemIndex) => itemIndex !== index),
										)
									}
								/>
							</div>
						))
					)}
				</div>

				<div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
					<Button
						type="button"
						size="giant"
						label="Cancelar"
						disabled={isSaving}
						className={secondaryButtonClassName}
						onClick={onClose}
					/>
					<Button
						type="button"
						size="giant"
						label="Guardar precios"
						isLoading={isSaving}
						disabled={isSaving}
						className={primaryButtonClassName}
						onClick={handleSave}
					/>
				</div>
			</div>
		</Modal>
	);
};
