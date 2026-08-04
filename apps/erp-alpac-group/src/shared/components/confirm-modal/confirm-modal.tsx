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
	buttonActionLabel,
	buttonActionClass,
	buttonCancelClass,
	hasReason,
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

	const [reason, setReason] = useState<string>();

	const handleInternalFinalAction = (type: ConfirmActionType) => {
		if (hasReason && !reason?.trim()) {
			handleRequestWarning("Debe ingresar una razón.", "Campo requerido");
			return;
		}

		handleFinalAction(type, reason);
		setReason("")
	};

	const handleInternalClose = () => {
		setReason("")
		onClose?.();
	}

	return (
		<Modal
			size={hasReason ? "2xl" : "md"}
			variant="warning"
			isOpen={isOpen}
			onClose={() => !isLoading && handleInternalClose()}
		>
			<div className="flex flex-col gap-4">
				<p className="text-slate-600 dark:text-slate-300 text-center">{title}</p>

				{
					hasReason &&
					<Textarea
						label="Razón / Motivo"
						isRequired
						placeholder="Razón o Motivo..."
						className={inputClassName}
						labelClassName={labelClassName}
						value={reason}
						onChange={(e) => {
							handleCloseAlert();
							setReason(e.target.value)
						}}
						maxLength={500}
						enableCharacterCount
						style={{
							resize: "none",
							minHeight: "100px",
						}}
					/>
				}

				<div className={`flex ${hasReason ? "justify-end" : "justify-center"}  gap-3 mt-4`}>
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
