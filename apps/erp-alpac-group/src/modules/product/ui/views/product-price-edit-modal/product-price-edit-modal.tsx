import { useEffect, useState } from "react";
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
import dayjs from "dayjs";
import { AnimatePresence, LazyMotion, m } from "framer-motion";
import { Trash2Icon } from "lucide-react";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useProduct } from "@app/modules/product/ui/hooks/useProduct";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import {
	CurrencyCodeOptions,
	type CurrencyCode,
} from "@app/core/enums/currency.enum";
import {
	emptyCatalogLinkTier,
	mapCatalogLinkItemsToTierPayload,
	resolveLinkCurrency,
	type CatalogLinkTierForm,
} from "@app/modules/product/ui/components/catalog-link-editor/catalog-link-editor.types";
import type { ProductPriceEditModalProps } from "@app/modules/product/ui/views/product-price-edit-modal/product-price-edit-modal.types";

const inputClassName =
	"w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const dropdownClassName = `${inputClassName} focus:border-blue-600! focus:ring-2! focus:ring-green-50/50!`;
const labelClassName = "text-black! dark:text-white!";
const primaryButtonClassName =
	"w-full! sm:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!";
const secondaryButtonClassName =
	"w-full! sm:w-auto! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!";
const removeItemButtonClassName =
	"h-8! w-8! shrink-0 rounded-md! bg-red-500! text-[13px]! text-white! hover:bg-red-800! dark:bg-red-900!";

const datePickerSlotProps = {
	popper: {
		disablePortal: false,
		sx: { zIndex: 2000 },
	},
};

const UNIT_STEP_LABEL = "Precio unitario";
const PREFERENTIAL_STEP_LABEL = "Precios preferenciales";

const preferencialEnterTransition = {
	height: { duration: 0.28, ease: "easeInOut" as const },
	opacity: { duration: 0.32, ease: "easeOut" as const, delay: 0.04 },
	y: { duration: 0.28, ease: "easeOut" as const, delay: 0.04 },
};

const stepContentTransition = {
	opacity: { duration: 0.28, ease: "easeOut" as const },
	x: { duration: 0.3, ease: "easeOut" as const },
};

const stepperRevealTransition = {
	opacity: { duration: 0.32, ease: "easeOut" as const },
	height: { duration: 0.35, ease: "easeInOut" as const },
};

const loadMotionFeatures = () =>
	import("framer-motion").then((res) => res.domAnimation);

const toDayjsValue = (value: string) => {
	if (!value.trim()) return null;
	const parsed = dayjs(value);
	return parsed.isValid() ? parsed : null;
};

const toDateString = (value: unknown) => {
	if (!value) return "";
	const parsed = dayjs.isDayjs(value) ? value : dayjs(value as string | Date);
	return parsed.isValid() ? parsed.format("YYYY-MM-DD") : "";
};

const formatPreferentialTitle = (
	item: CatalogLinkTierForm,
	index: number,
) => {
	if (item.min_quantity.trim() && item.preferential_price.trim()) {
		return `Desde ${item.min_quantity} · ${item.preferential_price}`;
	}
	return `Precio preferencial #${index + 1}`;
};

export const ProductPriceEditModal = ({
	isOpen,
	onClose,
	productId,
	supplier,
	onRequestSuccess,
	onRequestError,
}: ProductPriceEditModalProps) => {
	const { companyId, moduleCode } = useUserStore();
	const { getMappedError } = useMappedError();
	const { UpdateProductSupplierPrice } = useProduct();

	const [unitPrice, setUnitPrice] = useState("");
	const [currency, setCurrency] = useState<CurrencyCode>("USD");
	const [tiers, setTiers] = useState<CatalogLinkTierForm[]>([]);
	const [includePreferential, setIncludePreferential] = useState(false);
	const [currentStep, setCurrentStep] = useState(0);
	const [openPreferentialId, setOpenPreferentialId] = useState<string>("");

	useEffect(() => {
		if (!isOpen || !supplier) return;

		const existingTiers = supplier.tier_prices ?? [];
		const mappedTiers = existingTiers.map((tier) => ({
			id: tier.tier_price_id || crypto.randomUUID(),
			min_quantity: String(tier.min_quantity ?? ""),
			preferential_price: String(tier.preferential_price ?? ""),
			valid_from: tier.valid_from?.slice(0, 10) ?? "",
			valid_to: tier.valid_to?.slice(0, 10) ?? "",
		}));

		setUnitPrice(String(supplier.unit_price ?? ""));
		setCurrency(resolveLinkCurrency(supplier.currency));
		setTiers(mappedTiers);
		setIncludePreferential(existingTiers.length > 0);
		setOpenPreferentialId(mappedTiers[0]?.id ?? "");
		setCurrentStep(0);
	}, [isOpen, supplier]);

	const isSaving = UpdateProductSupplierPrice.isPending;
	const supplierLabel =
		supplier?.commercial_name?.trim() ||
		supplier?.supplier_legal_name ||
		supplier?.supplier_id ||
		"—";

	const steps = includePreferential
		? [UNIT_STEP_LABEL, PREFERENTIAL_STEP_LABEL]
		: [UNIT_STEP_LABEL];

	const parsedUnitPrice = unitPrice.trim() ? Number(unitPrice) : undefined;
	const hasValidUnitPrice =
		parsedUnitPrice != null && !Number.isNaN(parsedUnitPrice);

	const updateTier = (
		tierId: string,
		field: keyof CatalogLinkTierForm,
		value: string,
	) => {
		setTiers((prev) =>
			prev.map((tier) =>
				tier.id === tierId ? { ...tier, [field]: value } : tier,
			),
		);
	};

	const handleClose = () => {
		if (isSaving) return;
		onClose();
	};

	const handleSave = (withPreferential: boolean) => {
		if (!supplier) return;

		const preferentialPrices = withPreferential
			? mapCatalogLinkItemsToTierPayload(tiers)
			: undefined;
		const hasTierPrices =
			Boolean(preferentialPrices) && preferentialPrices!.length > 0;
		const initialCurrency = resolveLinkCurrency(supplier.currency);
		const currencyChanged = currency !== initialCurrency;
		const unitPriceChanged =
			hasValidUnitPrice &&
			parsedUnitPrice !== Number(supplier.unit_price);
		const sendPrice =
			hasValidUnitPrice && (unitPriceChanged || !currencyChanged);
		const sendCurrency = currencyChanged || sendPrice || hasTierPrices;

		if (!sendPrice && !sendCurrency && !hasTierPrices) {
			onRequestError?.(
				"Debe indicar un nuevo precio unitario, cambiar la moneda o agregar precios preferenciales.",
			);
			return;
		}

		UpdateProductSupplierPrice.mutate(
			{
				company_id: companyId,
				module_code: moduleCode,
				product_id: productId,
				supplier_id: supplier.supplier_id,
				new_unit_price: sendPrice ? parsedUnitPrice : undefined,
				currency: sendCurrency ? currency : undefined,
				tier_prices: hasTierPrices ? preferentialPrices : undefined,
			},
			{
				onSuccess: () => {
					onRequestSuccess?.("Precios actualizados correctamente.");
					onClose();
				},
				onError: (error) => {
					const mapped = getMappedError(error as ApiErrorResponse);
					onRequestError?.(
						mapped.description || "No se pudieron actualizar los precios.",
					);
				},
			},
		);
	};

	const handleEnablePreferential = () => {
		const nextItem = emptyCatalogLinkTier();
		setIncludePreferential(true);
		if (tiers.length > 0) {
			setOpenPreferentialId(tiers[0].id);
		} else {
			setTiers([nextItem]);
			setOpenPreferentialId(nextItem.id);
		}
		setCurrentStep(1);
	};

	const handleAddPreferential = () => {
		const nextItem = emptyCatalogLinkTier();
		setTiers((prev) => [...prev, nextItem]);
		setOpenPreferentialId(nextItem.id);
	};

	const handleRemovePreferential = (tierId: string) => {
		const next = tiers.filter((item) => item.id !== tierId);
		setTiers(next);
		if (openPreferentialId === tierId) {
			setOpenPreferentialId(next[0]?.id ?? "");
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title="Editar precios"
			variant="form"
			size="2xl"
			description={`Proveedor: ${supplierLabel}`}
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
									<div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
										<InputText
											label="Nuevo precio unitario"
											type="number"
											placeholder="0.00"
											className={inputClassName}
											labelClassName={labelClassName}
											value={unitPrice}
											onChange={(event) => setUnitPrice(event.target.value)}
										/>
										<div className="sm:w-44">
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
										</div>
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
												label="Agregar precios preferenciales"
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
											Precios preferenciales
										</span>
										<Button
											type="button"
											size="small"
											label="Agregar precio preferencial"
											className={secondaryButtonClassName}
											onClick={handleAddPreferential}
										/>
									</div>

									{tiers.length === 0 ? (
										<small className="text-slate-500 dark:text-slate-400">
											Sin precios preferenciales. Agregue al menos uno o
											vuelva al paso anterior.
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
												{tiers.map((tier, index) => (
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
																		{formatPreferentialTitle(tier, index)}
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
																			onClick={() =>
																				handleRemovePreferential(tier.id)
																			}
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
																		updateTier(
																			tier.id,
																			"min_quantity",
																			event.target.value,
																		)
																	}
																/>
																<InputText
																	label="Precio preferencial"
																	type="number"
																	className={inputClassName}
																	labelClassName={labelClassName}
																	value={tier.preferential_price}
																	onChange={(event) =>
																		updateTier(
																			tier.id,
																			"preferential_price",
																			event.target.value,
																		)
																	}
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
																			updateTier(
																				tier.id,
																				"valid_from",
																				toDateString(value),
																			)
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
																			updateTier(
																				tier.id,
																				"valid_to",
																				toDateString(value),
																			)
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
	);
};
