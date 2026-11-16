import { Modal } from "@alpac/design-system";
import type { DeleteProductOrServiceModalProps } from "./delete-product-or-services-modal.types";

export const DeactivateProductModal = function(props: DeleteProductOrServiceModalProps){

	const { 
		isOpen  = false,
		onClose = () => {}
	} = props;

	return (
		<Modal 
			isOpen={isOpen} 
			onClose={onClose} 
			title="Confirmar baja de producto" 
			size="md"
		>

			<form>

			</form>
		</Modal>
	);
};