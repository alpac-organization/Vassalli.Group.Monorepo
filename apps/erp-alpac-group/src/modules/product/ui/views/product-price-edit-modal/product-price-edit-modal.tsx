import { useMemo, useState } from "react";
import {
	AccordionGroup,
	AccordionItem,
	Button,
	DatePicker,
	Dropdown,
	InputText,
	Modal,
	Stepper,
} from "@alpac/design-system";
import { AnimatePresence, LazyMotion, m } from "framer-motion";
import { Trash2Icon } from "lucide-react";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useProduct } from "@app/modules/product/ui/hooks/useProduct";
import { useSupplier } from "@app/modules/purchasing/ui/hooks/supplier/useSupplier";
import { useUnitOfMeasurement } from "@app/modules/unit-of-measurement/hooks/useUnitOfMeasurement";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import {
	CurrencyCodeOptions,
	type CurrencyCode,
} from "@app/core/enums/currency.enum";
import { loadMotionFeatures, toDayjsValue, toDateString, formatPreferentialTitle } from "@app/modules/product/ui/views/product-price-edit-modal/utils/product-price.utils";
import {
	emptyCatalogLinkTier,
	resolveLinkCurrency,
	resolveLinkUnitMeasureId,
	resolveTierPricesForPatch,
	validatePreferentialDates,
	type CatalogLinkTierForm,
} from "@app/modules/product/ui/components/catalog-link-editor/catalog-link-editor.types";
import type {
	PriceEditLinkInitial,
	ProductPriceEditModalProps,
} from "@app/modules/product/ui/views/product-price-edit-modal/product-price-edit-modal.types";
import { ConfirmModal } from "@app/shared/components/confirm-modal/confirm-modal";
import { inputClassName, dropdownClassName, labelClassName, primaryButtonClassName, secondaryButtonClassName, removeItemButtonClassName
	, deleteButtonClass, cancelButtonClass, stepperRevealTransition, stepContentTransition, 
	UNIT_STEP_LABEL, PREFERENTIAL_STEP_LABEL, preferencialEnterTransition, datePickerSlotProps } from "@app/modules/product/ui/views/product-price-edit-modal/constants/product-price.constants";

const priceHydrationKey = (
	isOpen: boolean,
	initial: PriceEditLinkInitial | null,
) => {
	if (!isOpen || !initial) return "idle";

	return JSON.stringify({
		unit_price: initial.unit_price,
		currency: initial.currency ?? null,
		unit_measure_id: initial.unit_measure_id ?? null,
		tier_prices: initial.tier_prices ?? null,
	});
};

const mapPriceDraft = (initial: PriceEditLinkInitial) => {
	const existingTiers = (initial.tier_prices ?? []).slice(0, 1);
	const linkCurrency = resolveLinkCurrency(initial.currency);
	const mappedTiers = existingTiers.map((tier) => ({
		id: tier.tier_price_id,
		min_quantity: String(tier.min_quantity ?? ""),
		preferential_price: String(tier.preferential_price ?? ""),
		currency: resolveLinkCurrency(tier.currency ?? linkCurrency),
		valid_from: tier.valid_from?.slice(0, 10) ?? "",
		valid_to: tier.valid_to?.slice(0, 10) ?? "",
	}));

	return {
		unitPrice: String(initial.unit_price ?? ""),
		currency: linkCurrency,
		unitMeasureId: initial.unit_measure_id?.trim() ?? "",
		tiers: mappedTiers,
		hadInitialPreferential: existingTiers.length > 0,
		includePreferential: existingTiers.length > 0,
		openPreferentialId: mappedTiers[0]?.id ?? "",
		currentStep: 0,
	};
};


export const ProductPriceEditModal = ({
	isOpen,
	onClose,
	productId,
	supplierId,
	counterpartLabel,
	initial,
	updateVia = "product",
	onRequestSuccess,
	onRequestError,
}: ProductPriceEditModalProps) => {
	const { companyId, moduleCode } = useUserStore();
	const { getMappedError } = useMappedError();
	const { UpdateProductSupplierPrice } = useProduct();
	const { UpdateSupplierProductPrice } = useSupplier();
	const { GetUnitMeasurements } = useUnitOfMeasurement({
		payloadUnitOfMeasurement: {
			companie_id: companyId,
			module_code: moduleCode,
		},
		enabled: isOpen,
	});

	const hydrationKey = priceHydrationKey(isOpen, initial);
	const mountedDraft = isOpen && initial ? mapPriceDraft(initial) : null;

	const [unitPrice, setUnitPrice] = useState(mountedDraft?.unitPrice ?? "");
	const [currency, setCurrency] = useState<CurrencyCode>(
		mountedDraft?.currency ?? "USD",
	);
	const [unitMeasureId, setUnitMeasureId] = useState(
		mountedDraft?.unitMeasureId ?? "",
	);
	const [tiers, setTiers] = useState<CatalogLinkTierForm[]>(
		mountedDraft?.tiers ?? [],
	);
	const [hadInitialPreferential, setHadInitialPreferential] = useState(
		mountedDraft?.hadInitialPreferential ?? false,
	);
	const [includePreferential, setIncludePreferential] = useState(
		mountedDraft?.includePreferential ?? false,
	);
	const [currentStep, setCurrentStep] = useState(mountedDraft?.currentStep ?? 0);
	const [openPreferentialId, setOpenPreferentialId] = useState(
		mountedDraft?.openPreferentialId ?? "",
	);
	const [appliedHydrationKey, setAppliedHydrationKey] = useState(hydrationKey);
	const [isRemovePreferentialConfirmOpen, setIsRemovePreferentialConfirmOpen] =
		useState(false);

	if (appliedHydrationKey !== hydrationKey) {
		setAppliedHydrationKey(hydrationKey);
		if (isOpen && initial) {
			const draft = mapPriceDraft(initial);
			setUnitPrice(draft.unitPrice);
			setCurrency(draft.currency);
			setUnitMeasureId(draft.unitMeasureId);
			setTiers(draft.tiers);
			setHadInitialPreferential(draft.hadInitialPreferential);
			setIncludePreferential(draft.includePreferential);
			setOpenPreferentialId(draft.openPreferentialId);
			setCurrentStep(draft.currentStep);
		}
	}

	const unitMeasureOptions = useMemo(() => {
		const units = GetUnitMeasurements.data;
		if (!units || !Array.isArray(units)) return [];
		return units.map((item) => ({
			value: item.unit_measure_id,
			label: item.symbol ? `${item.name} (${item.symbol})` : item.name,
		}));
	}, [GetUnitMeasurements.data]);

	const isSaving =
		UpdateProductSupplierPrice.isPending ||
		UpdateSupplierProductPrice.isPending;

	const steps = includePreferential
		? [UNIT_STEP_LABEL, PREFERENTIAL_STEP_LABEL]
		: [UNIT_STEP_LABEL];

	const parsedUnitPrice = unitPrice.trim() ? Number(unitPrice) : undefined;
	const hasValidUnitPrice =
		parsedUnitPrice != null && !Number.isNaN(parsedUnitPrice);

	const updateTier = (tierId: string, patch: Partial<CatalogLinkTierForm>) => {
		setTiers((prev) =>
			prev.map((tier) => (tier.id === tierId ? { ...tier, ...patch } : tier)),
		);
	};

	const handleClose = () => {
		if (isSaving) return;
		setIsRemovePreferentialConfirmOpen(false);
		onClose();
	};

	const handleSave = (withPreferentialStep: boolean) => {
		if (!initial || !productId || !supplierId) return;

		const preferentialTouched = withPreferentialStep;
		const tierPayload = resolveTierPricesForPatch(
			preferentialTouched,
			tiers,
			currency,
			unitMeasureId,
		);

		if (preferentialTouched && tiers.length > 0) {
			const tier = tiers[0];
			const dateError = validatePreferentialDates(
				tier.valid_from,
				tier.valid_to,
			);
			if (dateError) {
				onRequestError?.(dateError);
				return;
			}
			if (
				!tier.min_quantity.trim() ||
				!tier.preferential_price.trim() ||
				!tier.valid_from.trim()
			) {
				onRequestError?.(
					"Complete cantidad mínima, precio y fecha de inicio del preferencial, o quítelo.",
				);
				return;
			}
		}

		const initialCurrency = resolveLinkCurrency(initial.currency);
		const initialUnitMeasure = initial.unit_measure_id?.trim() ?? "";
		const currencyChanged = currency !== initialCurrency;
		const unitPriceChanged =
			hasValidUnitPrice && parsedUnitPrice !== Number(initial.unit_price);
		const unitMeasureChanged = unitMeasureId.trim() !== initialUnitMeasure;
		const sendPrice = unitPriceChanged;
		const sendCurrency = currencyChanged || unitPriceChanged;
		const sendUnitMeasure = unitMeasureChanged;
		const hasTierChange = preferentialTouched;

		if (!sendPrice && !sendCurrency && !sendUnitMeasure && !hasTierChange) {
			onRequestError?.(
				"Debe indicar un nuevo precio unitario, cambiar la moneda, la UoM del vínculo o el precio preferencial.",
			);
			return;
		}

		const body = {
			company_id: companyId,
			module_code: moduleCode,
			product_id: productId,
			supplier_id: supplierId,
			new_unit_price: sendPrice ? parsedUnitPrice : undefined,
			currency: sendCurrency ? currency : undefined,
			unit_measure_id: sendUnitMeasure
				? resolveLinkUnitMeasureId(unitMeasureId)
				: undefined,
			tier_prices: tierPayload,
		};

		const onSuccess = () => {
			onRequestSuccess?.("Precios actualizados correctamente.");
			onClose();
		};
		const onError = (error: unknown) => {
			const mapped = getMappedError(error as ApiErrorResponse);
			onRequestError?.(
				mapped.description || "No se pudieron actualizar los precios.",
			);
		};

		if (updateVia === "supplier") {
			UpdateSupplierProductPrice.mutate(body, { onSuccess, onError });
			return;
		}

		UpdateProductSupplierPrice.mutate(body, { onSuccess, onError });
	};

	const handleEnablePreferential = () => {
		const nextItem = emptyCatalogLinkTier(currency);
		setIncludePreferential(true);
		if (tiers.length > 0) {
			setOpenPreferentialId(tiers[0].id);
		} else {
			setTiers([nextItem]);
			setOpenPreferentialId(nextItem.id);
		}
		setCurrentStep(1);
	};

	const handleRequestRemovePreferential = () => {
		setIsRemovePreferentialConfirmOpen(true);
	};

	const handleCloseRemovePreferentialConfirm = () => {
		setIsRemovePreferentialConfirmOpen(false);
	};

	const handleConfirmRemovePreferential = () => {
		setTiers([]);
		setOpenPreferentialId("");
		setIsRemovePreferentialConfirmOpen(false);
	};

	const descriptionLabel = counterpartLabel?.trim() || "—";

	return (
		<>
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title="Editar precios"
			variant="form"
			size="2xl"
			description={descriptionLabel}
		>
			<LazyMotion features={loadMotionFeatures} strict>
				<div className="flex flex-col gap-4 sm:gap-6">
					<div className="w-full overflow-x-auto">
						<AnimatePresence mode="wait" initial={false}>
							<m.div
								key={steps.length}
								initial={{ opacity: 0.4, height: "auto" }}
								animate={{ opacity: 1, height: "auto" }}
								exit={{ opacity: 0.4 }}
								transition={stepperRevealTransition}
							>
								<Stepper steps={steps} currentStep={currentStep} />
							</m.div>
						</AnimatePresence>
					</div>

					<div className="relative min-h-40">
						<AnimatePresence mode="wait" initial={false}>
							{currentStep === 0 ? (
								<m.section
									key="step-unit"
									className="flex flex-col gap-4"
									initial={{ opacity: 0, x: -12 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 12 }}
									transition={stepContentTransition}
								>
									<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:items-end">
										<InputText
											label="Nuevo precio unitario"
											type="number"
											placeholder="0.00"
											className={inputClassName}
											labelClassName={labelClassName}
											value={unitPrice}
											onChange={(event) => setUnitPrice(event.target.value)}
										/>
										<Dropdown
											label="Moneda"
											placeholder="Moneda"
											appearance="dark"
											isRequired
											options={CurrencyCodeOptions}
											value={currency}
											disabled={isSaving}
											onChange={(value) =>
												setCurrency(
													resolveLinkCurrency(String(value ?? "USD")),
												)
											}
											className={dropdownClassName}
											labelClassName={labelClassName}
										/>
										<Dropdown
											label="UoM del vínculo"
											placeholder={
												GetUnitMeasurements.isPending ||
												GetUnitMeasurements.isFetching
													? "Cargando..."
													: "Heredar del producto"
											}
											appearance="dark"
											optional
											options={unitMeasureOptions}
											value={unitMeasureId || null}
											disabled={
												isSaving ||
												GetUnitMeasurements.isPending ||
												GetUnitMeasurements.isFetching
											}
											onChange={(value) =>
												setUnitMeasureId(
													value === null ||
														value === undefined ||
														value === ""
														? ""
														: String(value),
												)
											}
											className={dropdownClassName}
											labelClassName={labelClassName}
										/>
									</div>

									<div className="flex flex-col-reverse gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
										<Button
											type="button"
											size="giant"
											label="Cancelar"
											disabled={isSaving}
											className={secondaryButtonClassName}
											onClick={handleClose}
										/>

										{!includePreferential ? (
											<Button
												type="button"
												size="giant"
												label="Agregar precio preferencial"
												disabled={isSaving}
												className={secondaryButtonClassName}
												onClick={handleEnablePreferential}
											/>
										) : (
											<Button
												type="button"
												size="giant"
												label="Siguiente"
												disabled={isSaving}
												className={secondaryButtonClassName}
												onClick={() => setCurrentStep(1)}
											/>
										)}
										<Button
											type="button"
											size="giant"
											label="Guardar precios"
											isLoading={isSaving}
											disabled={isSaving}
											className={primaryButtonClassName}
											onClick={() => handleSave(false)}
										/>
									</div>
								</m.section>
							) : (
								<m.section
									key="step-preferential"
									className="flex flex-col gap-4"
									initial={{ opacity: 0, x: 12 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -12 }}
									transition={stepContentTransition}
								>
									<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
										<span className="text-sm font-semibold text-slate-800 dark:text-white">
											Precio preferencial (máximo 1)
										</span>
										{tiers.length === 0 && (
											<Button
												type="button"
												size="small"
												label="Agregar precio preferencial"
												className={secondaryButtonClassName}
												onClick={() => {
													const nextItem = emptyCatalogLinkTier(currency);
													setTiers([nextItem]);
													setOpenPreferentialId(nextItem.id);
												}}
											/>
										)}
									</div>

									{tiers.length === 0 ? (
										<small className="text-slate-500 dark:text-slate-400">
											{hadInitialPreferential
												? "El precio preferencial se eliminará al guardar."
												: "Sin precio preferencial. Agregue uno o vuelva al paso anterior."}
										</small>
									) : (
										<AccordionGroup
											type="single"
											collapsible
											value={openPreferentialId}
											onValueChange={(value) =>
												setOpenPreferentialId(
													typeof value === "string" ? value : "",
												)
											}
											className="flex flex-col gap-3"
										>
											<AnimatePresence initial={false}>
												{tiers.slice(0, 1).map((tier) => (
													<m.div
														key={tier.id}
														layout
														initial={{
															opacity: 0,
															y: -8,
															height: 0,
															overflow: "hidden",
														}}
														animate={{
															opacity: 1,
															y: 0,
															height: "auto",
															overflow: "visible",
														}}
														exit={{
															opacity: 0,
															y: 8,
															height: 0,
															overflow: "hidden",
														}}
														transition={preferencialEnterTransition}
													>
														<AccordionItem
															value={tier.id}
															className="rounded-md! border-slate-300! dark:border-slate-600! dark:bg-[#1f2430]!"
															triggerClassName="h-auto! min-h-11! py-2! pr-3!"
															contentClassName="flex flex-col gap-4 p-4"
															title={
																<div className="flex min-w-0 flex-1 items-center justify-between gap-3">
																	<span className="truncate text-sm font-medium text-slate-900 dark:text-white">
																		{formatPreferentialTitle(tier)}
																	</span>
																	<span
																		className="mr-3 flex shrink-0 items-center"
																		onClick={(event) =>
																			event.stopPropagation()
																		}
																		onKeyDown={(event) =>
																			event.stopPropagation()
																		}
																	>
																		<Button
																			type="button"
																			size="small"
																			tooltip="Quitar precio preferencial"
																			icon={<Trash2Icon size={16} />}
																			className={removeItemButtonClassName}
																			onClick={handleRequestRemovePreferential}
																		/>
																	</span>
																</div>
															}
														>
															<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
																<InputText
																	label="Cant. mínima"
																	type="number"
																	className={inputClassName}
																	labelClassName={labelClassName}
																	value={tier.min_quantity}
																	onChange={(event) =>
																		updateTier(tier.id, {
																			min_quantity: event.target.value,
																		})
																	}
																/>
																<InputText
																	label="Precio preferencial"
																	type="number"
																	className={inputClassName}
																	labelClassName={labelClassName}
																	value={tier.preferential_price}
																	onChange={(event) =>
																		updateTier(tier.id, {
																			preferential_price:
																				event.target.value,
																		})
																	}
																/>
																<Dropdown
																	label="Moneda"
																	placeholder="Moneda"
																	appearance="dark"
																	isRequired
																	options={CurrencyCodeOptions}
																	value={tier.currency}
																	disabled={isSaving}
																	onChange={(value) =>
																		updateTier(tier.id, {
																			currency: resolveLinkCurrency(
																				String(value ?? "USD"),
																			),
																		})
																	}
																	className={dropdownClassName}
																	labelClassName={labelClassName}
																/>
																<div className="min-w-0 w-full">
																	<DatePicker
																		label="Válido desde"
																		labelAbove
																		fieldWidth="large"
																		format="DD/MM/YYYY"
																		labelClassName={labelClassName}
																		value={toDayjsValue(tier.valid_from)}
																		onChange={(value) =>
																			updateTier(tier.id, {
																				valid_from: toDateString(value),
																			})
																		}
																		slotProps={datePickerSlotProps}
																	/>
																</div>
																<div className="min-w-0 w-full">
																	<DatePicker
																		label="Válido hasta"
																		labelAbove
																		fieldWidth="large"
																		format="DD/MM/YYYY"
																		labelClassName={labelClassName}
																		value={toDayjsValue(tier.valid_to)}
																		onChange={(value) =>
																			updateTier(tier.id, {
																				valid_to: toDateString(value),
																			})
																		}
																		slotProps={datePickerSlotProps}
																	/>
																</div>
															</div>
														</AccordionItem>
													</m.div>
												))}
											</AnimatePresence>
										</AccordionGroup>
									)}

									<div className="flex flex-col-reverse gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
										<Button
											type="button"
											size="giant"
											label="Atrás"
											disabled={isSaving}
											className={secondaryButtonClassName}
											onClick={() => setCurrentStep(0)}
										/>
										<Button
											type="button"
											size="giant"
											label="Cancelar"
											disabled={isSaving}
											className={secondaryButtonClassName}
											onClick={handleClose}
										/>
										<Button
											type="button"
											size="giant"
											label="Guardar precios"
											isLoading={isSaving}
											disabled={isSaving}
											className={primaryButtonClassName}
											onClick={() => handleSave(true)}
										/>
									</div>
								</m.section>
							)}
						</AnimatePresence>
					</div>
				</div>
			</LazyMotion>
		</Modal>

		<ConfirmModal
			type="DELETE"
			variant="warning"
			title="¿Quitar el precio preferencial?"
			isOpen={isRemovePreferentialConfirmOpen}
			handleFinalAction={(actionType) => {
				if (actionType === "DELETE") handleConfirmRemovePreferential();
			}}
			onClose={handleCloseRemovePreferentialConfirm}
			buttonActionLabel="Quitar"
			buttonActionClass={deleteButtonClass}
			buttonCancelClass={cancelButtonClass}
		/>
		</>
	);
};
