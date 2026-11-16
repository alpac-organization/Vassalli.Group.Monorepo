import { Button, Modal } from "@alpac/design-system";
import type { DeleteProductOrServiceModalProps } from "./delete-product-or-service-modal.types";

export const DeleteProductOrServiceModal = ({
	isOpen,
	onClose,
	product,
	onConfirm,
	isLoading = false,
}: DeleteProductOrServiceModalProps) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Eliminar producto" variant="default" size="md">
			<div className="flex flex-col gap-4">
				<p className="text-center">
					¿Está seguro de dar de baja el producto {product?.product_name}? Ya no podrá ser utilizado ni editado.
				</p>
				<div className="flex justify-center gap-3">
					<Button type="button" label="Cancelar" onClick={onClose} disabled={isLoading} />
					<Button type="button" label="Eliminar" onClick={onConfirm} isLoading={isLoading} />
				</div>
			</div>
		</Modal>
	);
};