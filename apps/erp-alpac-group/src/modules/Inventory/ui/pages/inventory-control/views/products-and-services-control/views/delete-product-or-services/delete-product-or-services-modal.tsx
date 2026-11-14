import { Alert, Button, Modal } from "@alpac/design-system";
import type { GetProductResponse } from "@app/modules/product/domain/ApiContract/Responses/product/get-product.response";

export interface DeleteProductOrServiceModalProps {
	isOpen: boolean;
	onClose: () => void;
	product: GetProductResponse | null;
	onConfirm: () => void;
	isLoading?: boolean;
}

export const DeactivateProductModal = ({
	isOpen,
	onClose,
	product,
	onConfirm,
	isLoading = false,
}: DeleteProductOrServiceModalProps) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Confirmar baja de producto" size="md">
			<Alert
				type="warning"
				title="Advertencia"
				message="Una vez dado de baja, el producto ya no podrá ser utilizado ni editado."
			/>
			<p className="mt-4 text-center">
				¿Está seguro de dar de baja el producto <strong>{product.product_name}</strong>?
			</p>
			<div className="flex justify-end gap-3 mt-4">
				<Button type="button" label="Cancelar" onClick={onClose} disabled={isLoading} />
				<Button type="button" label="Dar de baja" onClick={onConfirm} isLoading={isLoading} />
			</div>
		</Modal>
	);
};