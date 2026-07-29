import dayjs from "dayjs";
import { useMemo, useState } from "react";

import {
	Controller,
	FormProvider,
	useFieldArray,
	useForm,
} from "react-hook-form";

import {
	AccordionGroup,
	Button,
	ContextMenu,
	DatePicker,
	Dropdown,
	Modal,
	Textarea,
} from "@alpac/design-system";

import {
	quoteFormInputClassName,
	quoteFormLabelClassName,
	quoteFormPrimaryButtonClassName,
	quoteFormSecondaryButtonClassName,
} from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/create-quote-form.styles";

import { PlusIcon, SaveIcon, XIcon } from "lucide-react";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { QuoteDetailAccordion } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/components/quote-detail-accordion/quote-detail-accordion";
import { useCompanies } from "@app/modules/auth/ui/hooks/useCompanies";
import { toDateOnly } from "@app/shared/utils/date.utils";
import type { CreateQuoteModalProps } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/create-quote-modal.types";
import { type CreateQuote } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/create-quote-form.types";
import { SelectProductModal } from "./components/select-product-modal/select-product-modal";
import type { SelectableCatalogProduct } from "./components/select-product-modal/select-product-modal.types";

export function CreateQuoteModal({
	isOpen,
	onClose,
	onQuoteCreated,
}: CreateQuoteModalProps) {
	const { companyId } = useUserStore();

	const methods = useForm<CreateQuote>({
		defaultValues: {
			branch_id: "",
			quote_date: "",
			observations: "",
			quote_details: [],
		},
		mode: "onSubmit",
	});

	const {
		control,
		register,
		handleSubmit,
		reset,
		getValues,
		formState: { isSubmitting },
	} = methods;

	const { fields, append, remove } = useFieldArray({
		control,
		name: "quote_details",
	});

	const [openProducts, setOpenProducts] = useState<string[]>([]);
	const [, setIsProductModalOpen] = useState(false);
	const [isSelectProductOpen, setIsSelectProductOpen] = useState(false);
	const [productsById, setProductsById] = useState<
		Record<string, SelectableCatalogProduct>
	>({});

	const { GetBranchesQuery } = useCompanies({
		company_id: companyId,
	});

	const { data: branches } = GetBranchesQuery;

	const branchOptions = useMemo(() => {
		if (!branches || !Array.isArray(branches)) return [];
		return branches.map((branch) => ({
			value: branch.branch_id,
			label: branch.branch_name,
		}));
	}, [branches]);

	const assignedProductIds = useMemo(
		() =>
			fields
				.map((field) => field.product_id)
				.filter((id): id is string => Boolean(id)),
		[fields],
	);

	const resetForm = () => {
		reset({
			branch_id: "",
			quote_date: "",
			observations: "",
			quote_details: [],
		});
		setOpenProducts([]);
		setProductsById({});
	};

	const handleCancel = () => {
		resetForm();
		onClose();
	};

	const handleSelectRegisteredProducts = (
		products: SelectableCatalogProduct[],
	) => {
		const existingIds = new Set(
			(getValues("quote_details") ?? []).map((detail) => detail.product_id),
		);

		const productsToAdd = products.filter(
			(product) => !existingIds.has(product.product_id),
		);

		if (productsToAdd.length === 0) return;

		setProductsById((current) => {
			const next = { ...current };
			productsToAdd.forEach((product) => {
				next[product.product_id] = product;
			});
			return next;
		});

		append(
			productsToAdd.map((product) => ({
				product_id: product.product_id,
				suppliers: [],
			})),
		);
	};

	const onSubmit = (values: CreateQuote) => {
		console.log("Testing: ", values);
		onQuoteCreated(values);
		resetForm();
		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleCancel}
			variant="form"
			size="7.5xl"
			title="Nueva cotización"
			description="Complete el formulario para registrar una nueva cotización."
			panelClassName={[
				"flex h-[min(94dvh,54rem)] w-[min(calc(100vw-1rem),56rem)] min-w-0 flex-col overflow-hidden",
				"!mx-2 !my-2 sm:!mx-4 sm:!my-6",
				"rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
			].join(" ")}
			contentClassName="flex min-h-0 flex-1 flex-col"
		>
			<FormProvider {...methods}>
				<form
					onSubmit={handleSubmit(onSubmit, () => {})}
					className="flex min-h-0 flex-1 flex-col"
					noValidate
				>
					<div className="scrollbar-dashboard min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
						<div className="flex flex-col gap-4">
							<section className="flex flex-col gap-6 p-1">
								<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
									<Controller
										name="branch_id"
										control={control}
										rules={{ required: "Seleccione una sede de ALPAC." }}
										render={({ field }) => (
											<Dropdown
												value={field.value}
												onChange={(value) => field.onChange(value)}
												label="Sede"
												placeholder="Seleccione una sede de ALPAC"
												appearance="dark"
												labelClassName={quoteFormLabelClassName}
												valueClassName={quoteFormLabelClassName}
												className={quoteFormInputClassName}
												options={branchOptions ?? []}
											/>
										)}
									/>

									<Controller
										name="quote_date"
										control={control}
										rules={{
											required: "La fecha de cotización es requerida.",
										}}
										render={({ field }) => (
											<DatePicker
												fieldWidth="large"
												label="Fecha de cotización"
												labelAbove
												isRequired
												value={field.value ? dayjs(field.value) : null}
												onChange={(value) => {
													field.onChange(toDateOnly(value));
												}}
											/>
										)}
									/>
								</div>

								<Textarea
									label="Observaciones generales"
									placeholder="Ej: Cotización solicitada para reposición de inventario de bodega central..."
									rows={4}
									className={`${quoteFormInputClassName} resize-none`}
									labelClassName={quoteFormLabelClassName}
									enableCharacterCount
									maxLength={500}
									{...register("observations")}
								/>
							</section>

							<section className="flex flex-col gap-4 dark:border-t-neutral-600">
								<div className="flex items-center justify-between gap-2">
									<h3 className="m-0! text-[16px]! font-bold text-slate-800 dark:text-white!">
										Cotizaciones por producto
									</h3>

									<ContextMenu
										items={[
											{
												label: "Agregar Nuevo Producto",
												onClick() {
													setIsProductModalOpen(true);
												},
											},
											{
												label: "Agregar Producto Existente",
												onClick() {
													setIsSelectProductOpen(true);
												},
											},
										]}
										triggerLabel="Agregar Producto"
										triggerIcon={<PlusIcon size={18} />}
										triggerClassName={quoteFormPrimaryButtonClassName}
									/>
								</div>

								{fields.length === 0 ? (
									<p className="m-0 text-sm text-slate-500 dark:text-slate-400">
										Aún no hay productos agregados a esta cotización.
									</p>
								) : (
									<AccordionGroup
										type="multiple"
										value={openProducts}
										onValueChange={(value) => {
											const validateValue = Array.isArray(value)
												? value
												: value
													? [value]
													: [];
											setOpenProducts(validateValue);
										}}
										className="gap-3 pb-3"
									>
										{fields.map((field, index) => (
											<QuoteDetailAccordion
												key={field.id}
												accordionValue={field.id}
												quoteDetailIndex={index}
												product={productsById[field.product_id]}
												onRemove={() => {
													const productId = field.product_id;
													remove(index);
													setOpenProducts((current) =>
														current.filter((value) => value !== field.id),
													);
													if (productId) {
														setProductsById((current) => {
															const next = { ...current };
															delete next[productId];
															return next;
														});
													}
												}}
											/>
										))}
									</AccordionGroup>
								)}
							</section>
						</div>
					</div>

					<div className="-mx-4 -mb-4 mt-0 shrink-0 border-t border-t-slate-300 bg-white px-4 py-4 dark:border-t-neutral-600 dark:bg-[#272b34] sm:-mx-6 sm:-mb-6 sm:px-6">
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
							<Button
								type="button"
								label="Descartar"
								size="giant"
								disabled={isSubmitting}
								onClick={handleCancel}
								isHiddenLabelOnMobile
								icon={<XIcon size={20} />}
								className={quoteFormSecondaryButtonClassName}
							/>
							<Button
								type="submit"
								label="Guardar cotización"
								size="giant"
								isLoading={isSubmitting}
								disabled={isSubmitting}
								isHiddenLabelOnMobile
								icon={<SaveIcon size={20} />}
								className={quoteFormPrimaryButtonClassName}
							/>
						</div>
					</div>
				</form>
			</FormProvider>

			<SelectProductModal
				isOpen={isSelectProductOpen}
				onClose={() => setIsSelectProductOpen(false)}
				onSelect={handleSelectRegisteredProducts}
				selectionType="multiple"
				excludeProductIds={assignedProductIds}
			/>
		</Modal>
	);
}
