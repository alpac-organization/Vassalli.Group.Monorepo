import { Alert, AnimatedAlertWrapper, Button, Modal, Textarea } from "@alpac/design-system";
import type {
	ConfirmActionProps,
	ConfirmActionType,
} from "./confirm-modal.types";
import { useState } from "react";
import { useAlertState } from "@app/shared/hooks/useAlertState";

const inputClassName =
	"w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

export const ConfirmModal = ({
	isOpen,
	title,
	type,
	children,
	variant,
	buttonActionLabel,
	buttonActionClass,
	buttonCancelClass,
	hasObservation,
	observationLabel,
	isObservationRequired,
	onClose,
	handleFinalAction,
	isLoading = false,
	disabled = false,
}: ConfirmActionProps) => {

	const {
		alertState,
		handleCloseAlert,
		handleRequestWarning,
	} = useAlertState();

	const [observation, setObservation] = useState<string>();

	const handleInternalFinalAction = (type: ConfirmActionType) => {
		if (hasObservation && !observation?.trim() && isObservationRequired) {
			handleRequestWarning(`Debe ingresar una ${observationLabel ?? "observación"}.`, "Campo requerido");
			return;
		}

		handleFinalAction(type, observation);
		setObservation("")
	};

	const handleInternalClose = () => {
		setObservation("")
		onClose?.();
	}

	return (
		<Modal
			size={hasObservation ? "2xl" : "md"}
			variant={variant ?? "default"}
			isOpen={isOpen}
			onClose={() => !isLoading && handleInternalClose()}
		>
			<div className="flex flex-col gap-4">
				<p className="text-slate-600 dark:text-slate-300 text-center">{title}</p>

				{children ?? null}

				{
					hasObservation &&
					<Textarea
						label={observationLabel ?? "Observación"}
						isRequired={isObservationRequired}
						placeholder={`Escriba su ${observationLabel ?? "Observación"}...`}
						className={inputClassName}
						labelClassName={labelClassName}
						value={observation}
						onChange={(e) => {
							handleCloseAlert();
							setObservation(e.target.value)
						}}
						maxLength={500}
						enableCharacterCount
						style={{
							resize: "none",
							minHeight: "100px",
						}}
					/>
				}

				<div className={`flex ${hasObservation ? "justify-end" : "justify-center"}  gap-3 mt-4`}>
					<Button
						type="button"
						label="Salir"
						size="giant"
						className={`${buttonCancelClass}`}
						onClick={() => handleInternalClose()}
						disabled={isLoading || disabled}
					/>
					<Button
						type="button"
						label={buttonActionLabel}
						size="giant"
						className={`${buttonActionClass}`}
						onClick={() => handleInternalFinalAction(type)}
						disabled={disabled}
						isLoading={isLoading

						}
					/>
				</div>
			</div>

			<AnimatedAlertWrapper open={alertState?.open ?? false}>
				<Alert
					type={alertState?.type!}
					title={alertState?.title}
					message={alertState?.message!}
				/>
			</AnimatedAlertWrapper>
		</Modal>
	);
};
