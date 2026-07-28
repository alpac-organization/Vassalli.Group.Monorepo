import { Button, Modal } from "@alpac/design-system";


type SelectProductModalProps = {
	isOpen: boolean;
	onClose: () => void;
};

export function SelectProductModal({
	isOpen,
	onClose
}: SelectProductModalProps) {
	
	const handleClose = () => {
		onClose();
	};

	const handleConfirm = () => {
		handleClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			variant="form"
			size="5xl"
			title="Seleccionar producto"
			description="Elija un producto para agregarlo al proveedor actual."
		>
			<div className="flex flex-col gap-6">

				<div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
					<Button
						type="button"
						size="giant"
						label="Cancelar"
						className={""}
						onClick={handleClose}
					/>
					<Button
						type="button"
						size="giant"
						label="Agregar a la lista"
						className={""}
						onClick={handleConfirm}
					/>
				</div>
			</div>
		</Modal>
	);
}
