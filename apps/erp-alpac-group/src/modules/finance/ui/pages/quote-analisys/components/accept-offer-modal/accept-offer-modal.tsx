import { useEffect, useMemo, useState } from "react";
import { Button, Modal, Textarea } from "@alpac/design-system";
import type { AcceptOfferModalProps } from "./accept-offer-modal.types";

const MIN_JUSTIFICATION_LENGTH = 10;

const textareaClassName =
	"w-full! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500! dark:text-white!";
const textareaLabelClassName = "text-black! dark:text-white!";

const validateJustification = (value: string): string | null => {
	const trimmed = value.trim();
	if (!trimmed) {
		return "La justificación de selección es requerida.";
	}
	if (trimmed.length < MIN_JUSTIFICATION_LENGTH) {
		return "La justificación debe tener al menos 10 caracteres.";
	}
	return null;
};

export function AcceptOfferModal({
	isOpen,
	supplierName,
	isSubmitting,
	onClose,
	onConfirm,
}: AcceptOfferModalProps) {
	const [justification, setJustification] = useState("");
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!isOpen) return;
		setJustification("");
		setError(null);
	}, [isOpen]);

	const validationError = useMemo(
		() => validateJustification(justification),
		[justification],
	);

	const isConfirmDisabled =
		Boolean(isSubmitting) || Boolean(validationError);

	const handleConfirm = () => {
		const validationMessage = validateJustification(justification);
		if (validationMessage) {
			setError(validationMessage);
			return;
		}

		onConfirm(justification.trim());
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			variant="form"
			size="lg"
			title="Confirmar oferta"
			description={`¿Desea aceptar la oferta de ${supplierName}? Esta acción no se puede deshacer.`}
		>
			<div className="mt-4 flex flex-col gap-4">
				<Textarea
					label="Justificación de selección"
					isRequired
					placeholder="Ej. Mejor precio total, cumplimiento de plazos y disponibilidad del producto."
					className={textareaClassName}
					labelClassName={textareaLabelClassName}
					value={justification}
					onChange={(event) => {
						setJustification(event.target.value);
						if (error) setError(null);
					}}
					maxLength={500}
					enableCharacterCount
					error={error ?? undefined}
					style={{
						resize: "none",
						minHeight: "100px",
					}}
				/>

				<div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-end">
					<Button
						type="button"
						size="giant"
						label="Cancelar"
						onClick={onClose}
						disabled={isSubmitting}
						className="w-full! rounded-md! border! border-slate-400! bg-transparent! text-[15px]! text-slate-700! hover:bg-slate-100! dark:border-slate-500! dark:text-slate-200! dark:hover:bg-slate-700/40! sm:w-auto!"
					/>
					<Button
						type="button"
						size="giant"
						label="Aceptar oferta"
						onClick={handleConfirm}
						disabled={isConfirmDisabled}
						isLoading={isSubmitting}
						className="w-full! rounded-md! bg-alpac-primary-500! text-[15px]! text-white! dark:bg-alpac-primary-700! sm:w-auto!"
					/>
				</div>
			</div>
		</Modal>
	);
}
