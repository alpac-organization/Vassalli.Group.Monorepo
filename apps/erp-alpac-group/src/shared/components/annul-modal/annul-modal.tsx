import { useState } from "react";
import { Button, Modal, RadioButton, Textarea } from "@alpac/design-system";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import type { AnnulModalProps } from "./annul-modal.types";
import {labelClassName, inputClassName} from "@app/modules/purchasing/ui/pages/purchase-requests/utils/styles";
import { RotateCcw } from "lucide-react";


export function AnnulModal({
	isOpen,
	title = "Anular / Retornar",
	description = "Seleccione el alcance de la anulación e ingrese una justificación obligatoria.",
	showScopeSelection = true,
	isSubmitting = false,
	confirmButtonLabel,
	confirmButtonVariant,
	onClose,
	onConfirm,
}: AnnulModalProps) {
	const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
	const [scope, setScope] = useState<number>(1);
	const [reason, setReason] = useState("");
	const { handleCloseAlert, handleRequestWarning, AlertComponent } = useAlertState();

	if (isOpen !== prevIsOpen) {
		setPrevIsOpen(isOpen);
		if (isOpen) {
			setScope(1);
			setReason("");
		}
	}

	const handleClose = () => {
		if (isSubmitting) return;
		handleCloseAlert();
		onClose();
	};

	const handleConfirm = () => {
		const trimmedReason = reason.trim();
		if (!trimmedReason) {
			handleRequestWarning("Debe ingresar una justificación para continuar.", "Campo requerido");
			return;
		}

		if (trimmedReason.length < 5) {
			handleRequestWarning("La justificación debe contener al menos 5 caracteres.", "Justificación muy corta");
			return;
		}

		onConfirm({
			scope,
			reason: trimmedReason,
		});
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			variant="form"
			size="lg"
			title={title}
			description={description}
		>
			<div className="mt-4 flex flex-col gap-4">
				{AlertComponent}

				{showScopeSelection && (
					<div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
						<p className="m-0 text-sm font-semibold text-slate-800 dark:text-white">
							Alcance de la acción
						</p>

						<div className="flex flex-col gap-3">
							<label className="flex cursor-pointer items-start gap-3">
								<RadioButton
									name="annul-scope"
									value="1"
									checked={scope === 1}
									onChange={() => setScope(1)}
								/>
								<div className="flex flex-col">
									<span className="text-sm font-medium text-slate-900 dark:text-white">
										Retornar a Compras para re-cotizar
									</span>
									<span className="text-xs text-slate-500 dark:text-slate-400">
										Invalida las cotizaciones actuales para que Compras vuelva a cotizar. La solicitud se mantiene aprobada por el área.
									</span>
								</div>
							</label>

							<label className="flex cursor-pointer items-start gap-3">
								<RadioButton
									name="annul-scope"
									value="2"
									checked={scope === 2}
									onChange={() => setScope(2)}
								/>
								<div className="flex flex-col">
									<span className="text-sm font-medium text-slate-900 dark:text-white">
										Anular trámite definitivamente
									</span>
									<span className="text-xs text-slate-500 dark:text-slate-400">
										Cancela la solicitud de compra por completo y da por terminado el proceso.
									</span>
								</div>
							</label>
						</div>
					</div>
				)}

				<Textarea
					label="Justificación / Motivo *"
					placeholder="Escriba detalladamente el motivo de la anulación o retorno..."
					className={inputClassName}
					labelClassName={labelClassName}
					value={reason}
					onChange={(e) => setReason(e.target.value)}
					maxLength={500}
					enableCharacterCount
					style={{
						resize: "none",
						minHeight: "110px",
					}}
				/>

				<div className="mt-2 flex justify-end gap-3">
					<Button
						type="button"
						label="Cancelar"
						onClick={handleClose}
						disabled={isSubmitting}
						icon={<RotateCcw size={16} />}
              			isHiddenLabelOnMobile
						className="text-[15px]! rounded-md! text-slate-500! hover:bg-slate-200! bg-slate-500! dark:bg-slate-700! dark:text-slate-300! dark:hover:bg-slate-600!"

					/>
					<Button
						type="button"
						label={
							confirmButtonLabel ??
							(!showScopeSelection
								? "Anular solicitud"
								: scope === 2
								? "Anular trámite"
								: "Confirmar retorno")
						}
						onClick={handleConfirm}
						isLoading={isSubmitting}
						disabled={isSubmitting || !reason.trim()}
						className={
							(confirmButtonVariant === "danger" ||
							(!confirmButtonVariant && (!showScopeSelection || scope === 2)))
								? "h-10! px-5! rounded-md! bg-red-600! hover:bg-red-700! dark:bg-red-600! dark:hover:bg-red-700! text-white!"
								: "h-10! px-5! rounded-md! bg-alpac-primary-500! hover:bg-alpac-primary-600! dark:bg-alpac-primary-700! dark:hover:bg-alpac-primary-800! text-white!"
						}
					/>
				</div>
			</div>
		</Modal>
	);
}
