import { useEffect, useRef, useState } from "react";
import {
	AccordionGroup,
	AccordionItem,
	Button,
	DatePicker,
	Dropdown,
	InputText,
} from "@alpac/design-system";
import { PlusIcon, Trash2Icon } from "lucide-react";
import dayjs from "dayjs";
import { AnimatePresence, LazyMotion, m } from "framer-motion";
import {
	CurrencyCodeOptions,
	type CurrencyCode,
} from "@app/core/enums/currency.enum";
import {
	emptyCatalogLinkItem,
	emptyCatalogLinkTier,
	type CatalogLinkEditorProps,
	type CatalogLinkItemForm,
	type CatalogLinkTierForm,
} from "./catalog-link-editor.types";

const inputClassName =
	"w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const dropdownClassName = `${inputClassName} focus:border-blue-600! focus:ring-2! focus:ring-green-50/50!`;
const labelClassName = "text-black! dark:text-white!";
const secondaryButtonClassName =
	"text-[14px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!";
const removeControlClassName =
	"mr-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-red-500 text-white transition-colors hover:bg-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 dark:bg-red-900 dark:hover:bg-red-800";
const primaryButtonClassName =
	"text-[14px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!";

const AccordionRemoveControl = ({
	label,
	disabled = false,
	onRemove,
}: {
	label: string;
	disabled?: boolean;
	onRemove: () => void;
}) => (
	<span
		role="button"
		tabIndex={disabled ? -1 : 0}
		aria-label={label}
		title={label}
		aria-disabled={disabled}
		className={`${removeControlClassName} ${
			disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
		}`}
		onClick={(event) => {
			event.preventDefault();
			event.stopPropagation();
			if (!disabled) onRemove();
		}}
		onKeyDown={(event) => {
			event.stopPropagation();
			if (disabled) return;
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				onRemove();
			}
		}}
	>
		<Trash2Icon size={16} aria-hidden />
	</span>
);

const datePickerSlotProps = {
	popper: {
		disablePortal: false,
		sx: { zIndex: 2000 },
	},
};

const tierEnterTransition = {
	height: { duration: 0.28, ease: "easeInOut" as const },
	opacity: { duration: 0.32, ease: "easeOut" as const, delay: 0.04 },
	y: { duration: 0.28, ease: "easeOut" as const, delay: 0.04 },
};

const loadMotionFeatures = () =>
	import("framer-motion").then((res) => res.domAnimation);

const itemAccordionValue = (item: CatalogLinkItemForm, index: number) =>
	item.entity_id || `tmp-${index}`;

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

const formatTierTitle = (tier: CatalogLinkTierForm, tierIndex: number) => {
	if (tier.min_quantity.trim() && tier.preferential_price.trim()) {
		return `Desde ${tier.min_quantity} · ${tier.preferential_price}`;
	}
	return `Precio preferencial #${tierIndex + 1}`;
};

export const CatalogLinkEditor = ({
	title,
	emptyLabel,
	addButtonLabel,
	entityLabel,
	entityPlaceholder,
	options,
	unitMeasureOptions = [],
	items,
	onChange,
	isLoadingOptions = false,
	isLoadingUnitMeasures = false,
	disabled = false,
	lockEntity = false,
	onAddClick,
}: CatalogLinkEditorProps) => {
	const [openItem, setOpenItem] = useState("");
	const [openTierByItem, setOpenTierByItem] = useState<Record<string, string>>(
		{},
	);
	const previousLengthRef = useRef(items.length);

	const selectedIds = new Set(
		items.map((item) => item.entity_id).filter(Boolean),
	);

	useEffect(() => {
		const previousLength = previousLengthRef.current;
		previousLengthRef.current = items.length;

		if (items.length === 0) {
			setOpenItem("");
			return;
		}

		if (items.length > previousLength) {
			setOpenItem(
				itemAccordionValue(items[items.length - 1], items.length - 1),
			);
			return;
		}

		setOpenItem((current) => {
			if (!current) return current;

			const stillExists = items.some(
				(item, index) => itemAccordionValue(item, index) === current,
			);

			if (stillExists) return current;

			return itemAccordionValue(items[items.length - 1], items.length - 1);
		});
	}, [items]);

	const updateItem = (index: number, patch: Partial<CatalogLinkItemForm>) => {
		onChange(
			items.map((item, itemIndex) =>
				itemIndex === index ? { ...item, ...patch } : item,
			),
		);
	};

	const removeItem = (index: number) => {
		const itemKey = itemAccordionValue(items[index], index);
		onChange(items.filter((_, itemIndex) => itemIndex !== index));
		setOpenTierByItem((prev) => {
			const next = { ...prev };
			delete next[itemKey];
			return next;
		});
	};

	const addItem = () => {
		if (onAddClick) {
			onAddClick();
			return;
		}
		onChange([...items, emptyCatalogLinkItem()]);
	};

	const addTier = (index: number) => {
		const nextTier = emptyCatalogLinkTier();
		const itemKey = itemAccordionValue(items[index], index);
		updateItem(index, {
			tier_prices: [...items[index].tier_prices, nextTier],
		});
		setOpenTierByItem((prev) => ({
			...prev,
			[itemKey]: nextTier.id,
		}));
	};

	const updateTier = (
		itemIndex: number,
		tierIndex: number,
		field: keyof CatalogLinkTierForm,
		value: string,
	) => {
		const nextTiers = items[itemIndex].tier_prices.map((tier, currentIndex) =>
			currentIndex === tierIndex ? { ...tier, [field]: value } : tier,
		);
		updateItem(itemIndex, { tier_prices: nextTiers });
	};

	const removeTier = (itemIndex: number, tierIndex: number) => {
		const itemKey = itemAccordionValue(items[itemIndex], itemIndex);
		const removedId = items[itemIndex].tier_prices[tierIndex]?.id;
		updateItem(itemIndex, {
			tier_prices: items[itemIndex].tier_prices.filter(
				(_, currentIndex) => currentIndex !== tierIndex,
			),
		});
		setOpenTierByItem((prev) => {
			if (prev[itemKey] !== removedId) return prev;
			const remaining = items[itemIndex].tier_prices.filter(
				(_, currentIndex) => currentIndex !== tierIndex,
			);
			return {
				...prev,
				[itemKey]: remaining[remaining.length - 1]?.id ?? "",
			};
		});
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h4 className="m-0 text-sm font-semibold text-slate-800 dark:text-white">
						{title}
					</h4>
					<small className="text-slate-500 dark:text-slate-300">
						Asigne precio unitario y, si aplica, precios preferenciales por
						volumen.
					</small>
				</div>
				<Button
					type="button"
					size="medium"
					label={addButtonLabel}
					icon={<PlusIcon size={16} />}
					disabled={disabled}
					className={primaryButtonClassName}
					onClick={addItem}
				/>
			</div>

			{items.length === 0 ? (
				<div className="rounded-md border border-dashed border-slate-300 dark:border-neutral-600 px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-300">
					{emptyLabel}
				</div>
			) : (
				<AccordionGroup
					type="single"
					collapsible
					value={openItem}
					onValueChange={(value) =>
						setOpenItem(typeof value === "string" ? value : (value[0] ?? ""))
					}
					className="gap-3"
				>
					{items.map((item, index) => {
						const availableOptions = options.filter(
							(option) =>
								option.value === item.entity_id ||
								!selectedIds.has(option.value),
						);
						const accordionValue = itemAccordionValue(item, index);
						const displayLabel =
							item.entity_label ||
							item.entity_id ||
							`${entityLabel} ${index + 1}`;
						const openTier = openTierByItem[accordionValue] ?? "";

						return (
							<AccordionItem
								key={accordionValue}
								value={accordionValue}
								disabled={disabled}
								className="rounded-md! border-slate-300! dark:border-slate-600! dark:bg-[#272b34]!"
								triggerClassName="h-auto! min-h-12! py-2.5! pr-3!"
								contentClassName="flex flex-col gap-5 p-4"
								title={
									<div className="flex min-w-0 flex-1 items-center justify-between gap-3">
										<div className="flex min-w-0 items-center gap-3">
											<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-alpac-primary-500 text-sm font-semibold text-white dark:bg-alpac-primary-700">
												{index + 1}
											</span>
											<div className="flex min-w-0 flex-col">
												<span className="truncate text-sm font-medium text-slate-900 dark:text-white">
													{displayLabel}
												</span>
												<small className="text-slate-500 dark:text-slate-400">
													{item.unit_price
														? `Precio: ${item.unit_price} ${item.currency}`
														: "Sin precio unitario"}
													{item.tier_prices.length > 0
														? ` · ${item.tier_prices.length} tier(s)`
														: ""}
												</small>
											</div>
										</div>
										<AccordionRemoveControl
											label="Quitar"
											disabled={disabled}
											onRemove={() => removeItem(index)}
										/>
									</div>
								}
							>
								<div className="flex flex-col gap-3 md:flex-row md:items-start">
									<div className="min-w-0 flex-1">
										{lockEntity ? (
											<div className="flex flex-col gap-1.5">
												<span
													className={`ml-0.5 text-[14px] font-medium ${labelClassName}`}
												>
													{entityLabel}
												</span>
												<span className="flex h-11 sm:h-12 w-full min-w-0 items-center truncate rounded-[10px] border border-slate-300 bg-[#272b34] px-3 sm:px-4 text-[14px] sm:text-[15px] text-slate-900 dark:border-slate-600 dark:text-white">
													{displayLabel}
												</span>
											</div>
										) : (
											<Dropdown
												label={entityLabel}
												placeholder={
													isLoadingOptions
														? "Cargando..."
														: entityPlaceholder
												}
												appearance="dark"
												options={availableOptions}
												value={item.entity_id || null}
												disabled={disabled || isLoadingOptions}
												onChange={(value) => {
													const selected = options.find(
														(option) =>
															option.value === String(value ?? ""),
													);
													updateItem(index, {
														entity_id: String(value ?? ""),
														entity_label: selected?.label ?? "",
													});
												}}
												className={dropdownClassName}
												labelClassName={labelClassName}
											/>
										)}
									</div>
									<div className="md:w-48 shrink-0">
										<InputText
											label="Precio unitario"
											type="number"
											placeholder="0.00"
											isRequired
											disabled={disabled}
											className={inputClassName}
											labelClassName={labelClassName}
											value={item.unit_price}
											onChange={(event) =>
												updateItem(index, {
													unit_price: event.target.value,
												})
											}
										/>
									</div>
									<div className="md:w-40 shrink-0">
										<Dropdown
											label="Moneda"
											placeholder="Moneda"
											appearance="dark"
											isRequired
											options={CurrencyCodeOptions}
											value={item.currency}
											disabled={disabled}
											onChange={(value) =>
												updateItem(index, {
													currency: (String(value ?? "USD") ||
														"USD") as CurrencyCode,
												})
											}
											className={dropdownClassName}
											labelClassName={labelClassName}
										/>
									</div>
									<div className="md:w-52 shrink-0">
										<Dropdown
											label="Unidad de medida"
											placeholder={
												isLoadingUnitMeasures
													? "Cargando..."
													: "Seleccione..."
											}
											appearance="dark"
											optional
											options={unitMeasureOptions}
											value={item.unit_measure_id || null}
											disabled={disabled || isLoadingUnitMeasures}
											onChange={(value) =>
												updateItem(index, {
													unit_measure_id:
														value === null ||
														value === undefined ||
														value === ""
															? ""
															: String(value),
												})
											}
											className={dropdownClassName}
											labelClassName={labelClassName}
										/>
									</div>
								</div>

								<div className="flex flex-col gap-3">
									<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
										<span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
											Precios preferenciales
										</span>
										<Button
											type="button"
											size="small"
											label="Agregar Precio Preferencial"
											disabled={disabled}
											className={`${secondaryButtonClassName} w-full! sm:w-auto!`}
											onClick={() => addTier(index)}
										/>
									</div>

									{item.tier_prices.length === 0 ? (
										<small className="text-slate-500 dark:text-slate-400">
											Sin precio preferencial · Opcional
										</small>
									) : (
										<LazyMotion features={loadMotionFeatures} strict>
											<AccordionGroup
												type="single"
												collapsible
												value={openTier}
												onValueChange={(value) => {
													const next =
														typeof value === "string"
															? value
															: (value[0] ?? "");
													setOpenTierByItem((prev) => ({
														...prev,
														[accordionValue]: next,
													}));
												}}
												className="gap-2"
											>
												<AnimatePresence initial={false}>
													{item.tier_prices.map((tier, tierIndex) => (
														<m.div
															key={tier.id}
															initial={{
																opacity: 0,
																y: 12,
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
															transition={tierEnterTransition}
														>
															<AccordionItem
																value={tier.id}
																disabled={disabled}
																className="rounded-md! border-slate-300! dark:border-slate-600! dark:bg-[#1f2430]!"
																triggerClassName="h-auto! min-h-11! py-2! pr-3!"
																contentClassName="flex flex-col gap-4 p-4"
																title={
																	<div className="flex min-w-0 flex-1 items-center justify-between gap-3">
																		<span className="truncate text-sm font-medium text-slate-900 dark:text-white">
																			{formatTierTitle(tier, tierIndex)}
																		</span>
																		<AccordionRemoveControl
																			label="Quitar precio preferencial"
																			disabled={disabled}
																			onRemove={() =>
																				removeTier(index, tierIndex)
																			}
																		/>
																	</div>
																}
															>
																<div className="grid grid-cols-1 items-end gap-3 md:grid-cols-4">
																	<InputText
																		label="Cant. mínima"
																		type="number"
																		placeholder="100"
																		disabled={disabled}
																		className={inputClassName}
																		labelClassName={labelClassName}
																		value={tier.min_quantity}
																		onChange={(event) =>
																			updateTier(
																				index,
																				tierIndex,
																				"min_quantity",
																				event.target.value,
																			)
																		}
																	/>
																	<InputText
																		label="Precio preferencial"
																		type="number"
																		placeholder="0.00"
																		disabled={disabled}
																		className={inputClassName}
																		labelClassName={labelClassName}
																		value={tier.preferential_price}
																		onChange={(event) =>
																			updateTier(
																				index,
																				tierIndex,
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
																			disabled={disabled}
																			labelClassName={labelClassName}
																			value={toDayjsValue(tier.valid_from)}
																			onChange={(value) =>
																				updateTier(
																					index,
																					tierIndex,
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
																			disabled={disabled}
																			labelClassName={labelClassName}
																			value={toDayjsValue(tier.valid_to)}
																			onChange={(value) =>
																				updateTier(
																					index,
																					tierIndex,
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
										</LazyMotion>
									)}
								</div>
							</AccordionItem>
						);
					})}
				</AccordionGroup>
			)}
		</div>
	);
};
