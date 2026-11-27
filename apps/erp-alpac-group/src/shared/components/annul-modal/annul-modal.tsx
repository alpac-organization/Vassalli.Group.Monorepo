import { useMemo, useState } from "react";
import { Button, Modal, RadioButton, Textarea } from "@alpac/design-system";
import { AlertCircle, CheckCircle2, RotateCcw } from "lucide-react";

import { useAlertState } from "@app/shared/hooks/useAlertState";
import {
	inputClassName,
	labelClassName,
} from "@app/modules/purchasing/ui/pages/purchase-requests/utils/styles";

import type {
	AnnulModalProps,
	AnnulPresetReason,
	AnnulPresetReasonItem,
} from "./annul-modal.types";

const normalizePresetReason = (
	preset: AnnulPresetReason,
	index: number,
): AnnulPresetReasonItem => {
	if (typeof preset === "string") {
		return {
			id: `preset-${index}`,
			title: preset,
			value: preset,
		};
	}
	return preset;
};

export function AnnulModal({
	isOpen,
	title = "Anular / Retornar",
	description = "Seleccione el alcance de la anulación e ingrese una justificación obligatoria.",
	showScopeSelection = true,
	presetReasons,
	isSubmitting = false,
	confirmButtonLabel,
	confirmButtonVariant,
	onClose,
	onConfirm,
}: AnnulModalProps) {
	const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
	const [scope, setScope] = useState<1 | 2>(1);
	const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
	const [reason, setReason] = useState("");
	const { handleCloseAlert, handleRequestWarning, AlertComponent } =
		useAlertState();

	if (isOpen !== prevIsOpen) {
		setPrevIsOpen(isOpen);
		if (isOpen) {
			setScope(1);
			setSelectedPresetId(null);
			setReason("");
		}
	}

	const normalizedPresets = useMemo(
		() => (presetReasons ?? []).map(normalizePresetReason),
		[presetReasons],
	);

	const isDangerMode =
		confirmButtonVariant === "danger" ||
		(!confirmButtonVariant && (!showScopeSelection || scope === 2));

	const handleClose = () => {
		if (isSubmitting) return;
		handleCloseAlert();
		onClose();
	};

	const handleSelectPreset = (item: AnnulPresetReasonItem) => {
		if (isSubmitting) return;
		handleCloseAlert();
		setSelectedPresetId(item.id);
		setReason(item.value);
	};

	const handleReasonChange = (nextValue: string) => {
		setReason(nextValue);
		if (selectedPresetId) {
			const currentPreset = normalizedPresets.find(
				(item) => item.id === selectedPresetId,
			);
			if (
				currentPreset &&
				!nextValue.trim().startsWith(currentPreset.value)
			) {
				setSelectedPresetId(null);
			}
		}
	};

	const handleConfirm = () => {
		const trimmedReason = reason.trim();
		if (!trimmedReason) {
			handleRequestWarning(
				"Debe ingresar una justificación para continuar.",
				"Campo requerido",
			);
			return;
		}

		if (trimmedReason.length < 5) {
			handleRequestWarning(
				"La justificación debe contener al menos 5 caracteres.",
				"Justificación muy corta",
			);
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
			size="3xl"
			title={title}
			description={description}
			panelClassName="!max-w-3xl w-[min(calc(100vw-1.5rem),46rem)] rounded-xl sm:!rounded-2xl !p-5 sm:!p-6"
		>
			<div className="mt-3 flex flex-col gap-5">
				{AlertComponent}

				{showScopeSelection && (
					<div className="flex flex-col gap-3">
						<span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
							Alcance de la acción
						</span>

						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
							<label
								className={[
									"flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-all",
									scope === 1
										? "border-alpac-primary-500/70 bg-alpac-primary-500/10 ring-1 ring-alpac-primary-500/25 dark:border-alpac-primary-400/60 dark:bg-alpac-primary-500/15"
										: "border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-slate-100/70 dark:border-slate-700/80 dark:bg-slate-800/40 dark:hover:border-slate-600",
								].join(" ")}
							>
								<RadioButton
									name="annul-scope"
									value="1"
									checked={scope === 1}
									onChange={() => setScope(1)}
								/>
								<div className="flex flex-col gap-0.5">
									<span className="text-sm font-semibold text-slate-900 dark:text-white">
										Retornar a Compras
									</span>
									<span className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
										Invalida las cotizaciones actuales para volver a cotizar manteniendo la solicitud aprobada.
									</span>
								</div>
							</label>

							<label
								className={[
									"flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-all",
									scope === 2
										? "border-red-500/70 bg-red-500/10 ring-1 ring-red-500/25 dark:border-red-400/60 dark:bg-red-500/15"
										: "border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-slate-100/70 dark:border-slate-700/80 dark:bg-slate-800/40 dark:hover:border-slate-600",
								].join(" ")}
							>
								<RadioButton
									name="annul-scope"
									value="2"
									checked={scope === 2}
									onChange={() => setScope(2)}
								/>
								<div className="flex flex-col gap-0.5">
									<span className="text-sm font-semibold text-slate-900 dark:text-white">
										Anular trámite definitivamente
									</span>
									<span className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
										Cancela la solicitud de compra por completo y da por terminado el proceso.
									</span>
								</div>
							</label>
						</div>
					</div>
				)}

				{normalizedPresets.length > 0 && (
					<div className="flex flex-col gap-2.5">
						<div className="flex items-center justify-between gap-2">
							<span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
								Seleccione un motivo frecuente
							</span>
							<span className="text-xs text-slate-500 dark:text-slate-400">
								Puede complementarlo abajo
							</span>
						</div>

						<div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
							{normalizedPresets.map((item) => {
								const isSelected =
									selectedPresetId === item.id ||
									reason.trim() === item.value;

								return (
									<button
										key={item.id}
										type="button"
										disabled={isSubmitting}
										aria-pressed={isSelected}
										onClick={() => handleSelectPreset(item)}
										className={[
											"group relative flex w-full cursor-pointer items-start gap-3 rounded-xl border p-3.5 text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 disabled:cursor-not-allowed disabled:opacity-60",
											isSelected
												? isDangerMode
													? "border-red-500/70 bg-red-50/80 shadow-xs ring-1 ring-red-500/25 dark:border-red-400/70 dark:bg-red-500/12 dark:ring-red-400/25"
													: "border-alpac-primary-500/70 bg-alpac-primary-500/10 shadow-xs ring-1 ring-alpac-primary-500/25 dark:border-alpac-primary-400/70 dark:bg-alpac-primary-500/15"
												: "border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/80 dark:border-slate-700/80 dark:bg-[#1f232b]/80 dark:hover:border-slate-500/80 dark:hover:bg-slate-800/80",
										].join(" ")}
									>
										<span
											className={[
												"mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors",
												isSelected
													? isDangerMode
														? "border-red-500/30 bg-red-500/15 text-red-600 dark:border-red-400/30 dark:bg-red-500/20 dark:text-red-300"
														: "border-alpac-primary-500/30 bg-alpac-primary-500/15 text-alpac-primary-600 dark:text-alpac-primary-300"
													: "border-slate-200 bg-slate-100/80 text-slate-500 group-hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:text-slate-200",
											].join(" ")}
										>
											{item.icon ?? <AlertCircle size={18} />}
										</span>

										<div className="min-w-0 flex-1 pr-5">
											<p
												className={[
													"m-0 text-sm font-semibold leading-snug",
													isSelected
														? isDangerMode
															? "text-red-900 dark:text-red-200"
															: "text-slate-900 dark:text-white"
														: "text-slate-800 dark:text-slate-100",
												].join(" ")}
											>
												{item.title}
											</p>
											{item.description && (
												<p className="m-0 mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
													{item.description}
												</p>
											)}
										</div>

										<span className="absolute top-3.5 right-3.5">
											{isSelected ? (
												<CheckCircle2
													size={18}
													className={
														isDangerMode
															? "text-red-600 dark:text-red-400"
															: "text-alpac-primary-600 dark:text-alpac-primary-400"
													}
												/>
											) : (
												<span className="block h-4 w-4 rounded-full border border-slate-300 transition-colors group-hover:border-slate-400 dark:border-slate-600 dark:group-hover:border-slate-400" />
											)}
										</span>
									</button>
								);
							})}
						</div>
					</div>
				)}

				<Textarea
					label="Detalle del motivo"
					placeholder="Describa o complemente el motivo específico (ej. número de factura, diferencia detectada)..."
					className={inputClassName}
					labelClassName={labelClassName}
					isRequired
					value={reason}
					onChange={(e) => handleReasonChange(e.target.value)}
					maxLength={500}
					enableCharacterCount
					style={{
						resize: "none",
						minHeight: "105px",
					}}
				/>

				<div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end dark:border-slate-700/80">
					<Button
						type="button"
						label="Cancelar"
						onClick={handleClose}
						disabled={isSubmitting}
						icon={<RotateCcw size={16} />}
						isHiddenLabelOnMobile
						className="h-10! rounded-md! bg-slate-100! px-4! text-[15px]! text-slate-700! hover:bg-slate-200! dark:bg-slate-700! dark:text-slate-200! dark:hover:bg-slate-600!"
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
							isDangerMode
								? "h-10! rounded-md! bg-red-600! px-5! text-white! hover:bg-red-700! dark:bg-red-600! dark:hover:bg-red-700!"
								: "h-10! rounded-md! bg-alpac-primary-500! px-5! text-white! hover:bg-alpac-primary-600! dark:bg-alpac-primary-700! dark:hover:bg-alpac-primary-800!"
						}
					/>
				</div>
			</div>
		</Modal>
	);
}
