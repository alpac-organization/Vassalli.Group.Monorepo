import { useEffect } from "react";
import {
	Controller,
	useFormContext,
	useWatch,
} from "react-hook-form";
import {
	AccordionItem,
	Button,
	Checkbox,
	Dropdown,
	InputText,
	Textarea,
} from "@alpac/design-system";
import { CheckCircle2Icon, CircleAlert, XCircleIcon } from "lucide-react";
import {
	quoteFormInputClassName,
	quoteFormLabelClassName,
} from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/styles/create-quote-form.styles";
import type { TimeTypeValue } from "@app/core/enums/time-type.enum";
import type { ProductQualityType } from "@app/modules/purchasing/domain/enums/product-quality";
import { ImageUploader } from "@app/shared/components/image-uploader/image-uploader";
import { PdfUploader } from "@app/shared/components/pdf-uploader/pdf-uploader";
import {
	conditionalFieldsGridClassName,
	deliveryTimeOptions,
	productQualityOptions,
	timeTypeOptions,
} from "../constants/quote-product-form.constants";
import {
	buildPaymentMethodOptions,
	getActivePaymentMethods,
	normalizePaymentMethodType,
	resolvePaymentMethodLabel,
} from "../helper/quote-payment.helpers";
import { toNumberOrUndefined } from "../helper/quote-item.mapper";
import type {
	QuotationItemFieldsProps,
	QuoteProductFormValues,
} from "../quote-product-modal.types";
export function QuotationItemFields({
	productIndex,
	itemIndex,
	accordionValue,
	supplierLegalName,
	isLoadingPaymentMethods = false,
	isOpen = true,
	isIncluded = true,
	canSelectOnlyThis = false,
	onToggleInclude,
	onSelectOnlyThis,
}: QuotationItemFieldsProps) {
	const {
		control,
		register,
		setValue,
		clearErrors,
		formState: { errors },
	} = useFormContext<QuoteProductFormValues>();

	const hasDelivery = useWatch({
		control,
		name: `products.${productIndex}.items.${itemIndex}.has_delivery`,
	});
	const hasGuarantee = useWatch({
		control,
		name: `products.${productIndex}.items.${itemIndex}.has_guarantee`,
	});
	const inventoryAvailable = useWatch({
		control,
		name: `products.${productIndex}.items.${itemIndex}.inventory_available`,
	});
	const supplierPaymentMethods = useWatch({
		control,
		name: `products.${productIndex}.items.${itemIndex}.supplier_payment_methods`,
	});
	const preferredPaymentMethod = useWatch({
		control,
		name: `products.${productIndex}.items.${itemIndex}.preferred_payment_method`,
	});
	const currentPaymentMethod = useWatch({
		control,
		name: `products.${productIndex}.items.${itemIndex}.payment_method`,
	});
	const attachmentsForm = useWatch({
		control,
		name: `products.${productIndex}.items.${itemIndex}.attachments_form`,
	});
	const itemErrors = errors.products?.[productIndex]?.items?.[itemIndex];
	const fieldPath = `products.${productIndex}.items.${itemIndex}` as const;
	const supplierLabel = supplierLegalName || `Proveedor ${itemIndex + 1}`;

	const activePaymentMethods = getActivePaymentMethods(supplierPaymentMethods);
	const paymentMethodOptions = buildPaymentMethodOptions(
		supplierPaymentMethods ?? [],
	);
	const hasSinglePaymentMethod = activePaymentMethods.length === 1;
	const preferredPaymentNormalized =
		normalizePaymentMethodType(preferredPaymentMethod);
	const hasNoPaymentMethods =
		isOpen &&
		isIncluded &&
		!isLoadingPaymentMethods &&
		activePaymentMethods.length === 0;
	const lockedPaymentMethod = hasSinglePaymentMethod
		? activePaymentMethods[0].payment_method_type
		: undefined;
	const preferredInActiveMethods =
		preferredPaymentNormalized &&
		activePaymentMethods.some(
			(method) => method.payment_method_type === preferredPaymentNormalized,
		)
			? preferredPaymentNormalized
			: undefined;

	useEffect(() => {
		if (!lockedPaymentMethod || hasNoPaymentMethods) return;
		setValue(`${fieldPath}.payment_method`, lockedPaymentMethod, {
			shouldValidate: isIncluded,
		});
		clearErrors(`${fieldPath}.payment_method`);
	}, [
		clearErrors,
		fieldPath,
		hasNoPaymentMethods,
		isIncluded,
		lockedPaymentMethod,
		setValue,
	]);

	useEffect(() => {
		if (hasNoPaymentMethods) return;
		clearErrors(`${fieldPath}.payment_method`);
	}, [clearErrors, fieldPath, hasNoPaymentMethods]);

	useEffect(() => {
		if (lockedPaymentMethod || !preferredInActiveMethods) return;
		if (currentPaymentMethod) {
			clearErrors(`${fieldPath}.payment_method`);
			return;
		}
		setValue(`${fieldPath}.payment_method`, preferredInActiveMethods, {
			shouldValidate: isIncluded,
		});
		clearErrors(`${fieldPath}.payment_method`);
	}, [
		clearErrors,
		currentPaymentMethod,
		fieldPath,
		isIncluded,
		lockedPaymentMethod,
		preferredInActiveMethods,
		setValue,
	]);

	return (
		<AccordionItem
			value={accordionValue}
			disabled={!isIncluded}
			className={[
				"rounded-md! border-slate-300! dark:border-slate-600! dark:bg-[#272b34]!",
				!isIncluded ? "opacity-65" : "",
			]
				.filter(Boolean)
				.join(" ")}
			contentClassName="p-4"
			triggerClassName="h-auto! min-h-11! items-center!"
			leading={
				<div className="flex min-w-0 max-w-full flex-1 items-center gap-2.5 overflow-hidden">
					<span
						className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${
							isIncluded
								? "bg-alpac-primary-500 dark:bg-alpac-primary-700"
								: "bg-slate-400 dark:bg-slate-600"
						}`}
					>
						{itemIndex + 1}
					</span>
					<Checkbox
						name={`include-supplier-${productIndex}-${itemIndex}`}
						checked={isIncluded}
						onChange={(evt) => {
							onToggleInclude?.(Boolean(evt.target.checked));
						}}
						label={`Cotización · ${supplierLabel}`}
						className="min-w-0 flex-1 overflow-hidden"
						labelClassName="block min-w-0 truncate text-[15px] font-semibold text-slate-800 dark:text-white"
						aria-label={`Incluir proveedor ${supplierLabel}`}
					/>
				</div>
			}
			actions={
				<div className="flex shrink-0 items-center gap-2">
					{canSelectOnlyThis && onSelectOnlyThis ? (
						<Button
							type="button"
							size="small"
							label="Dejar solo esta"
							onClick={onSelectOnlyThis}
							className="h-8 rounded-md! border border-alpac-primary-500/40 bg-alpac-primary-500/10! px-2.5! text-[12px]! font-medium text-alpac-primary-700! hover:bg-alpac-primary-500/20! dark:text-alpac-primary-300!"
						/>
					) : null}
					{onToggleInclude ? (
						<Button
							type="button"
							size="small"
							label={isIncluded ? "No cotizar" : "Incluir"}
							icon={
								isIncluded ? (
									<XCircleIcon size={14} />
								) : (
									<CheckCircle2Icon size={14} />
								)
							}
							onClick={() => onToggleInclude(!isIncluded)}
							className={
								isIncluded
									? "h-8 rounded-md! bg-slate-200! px-2.5! text-[12px]! font-medium text-slate-700! hover:bg-red-500/15! hover:text-red-600! dark:bg-slate-700! dark:text-slate-200! dark:hover:bg-red-500/20! dark:hover:text-red-300!"
									: "h-8 rounded-md! bg-emerald-600! px-2.5! text-[12px]! font-medium text-white! hover:bg-emerald-700!"
							}
						/>
					) : null}
				</div>
			}
			title={
				<span
					className={`text-[13px] font-medium ${
						isIncluded
							? "text-emerald-600 dark:text-emerald-400"
							: "text-slate-400 dark:text-slate-400"
					}`}
				>
					{isIncluded ? "/ Incluida" : "/ Omitida"}
				</span>
			}
		>
			<input
				type="hidden"
				{...register(`${fieldPath}.supplier_id`, {
					validate: (value) =>
						!isIncluded ||
						Boolean(value?.trim()) ||
						"Debe seleccionar un proveedor.",
				})}
			/>
			<input type="hidden" {...register(`${fieldPath}.supplier_legal_name`)} />
			<input
				type="hidden"
				{...register(`${fieldPath}.purchase_request_item_id`)}
			/>

			{hasNoPaymentMethods ? (
				<div
					role="alert"
					className="mb-4 flex w-full items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2.5"
				>
					<CircleAlert
						size={18}
						className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-300"
						aria-hidden
					/>
					<p className="m-0 text-[13px] text-amber-800 dark:text-amber-200">
						El proveedor no tiene métodos de pago configurados. Configure al
						menos uno en el catálogo de proveedores.
					</p>
				</div>
			) : null}

			<div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2">
				<InputText
					label="Proveedor"
					value={supplierLegalName}
					disabled
					className={quoteFormInputClassName}
					labelClassName={quoteFormLabelClassName}
				/>

				<InputText
					label="Marca"
					placeholder="Ej. Bosch"
					className={quoteFormInputClassName}
					labelClassName={quoteFormLabelClassName}
					{...register(`${fieldPath}.brand_product`)}
				/>

				<Controller
					control={control}
					name={`${fieldPath}.product_quality`}
					rules={{
						validate: (value) =>
							!isIncluded ||
							Boolean(value) ||
							"La calidad del producto es requerida.",
					}}
					render={({ field }) => (
						<Dropdown
							label="Calidad del producto"
							placeholder="Seleccione"
							appearance="dark"
							isRequired={isIncluded}
							options={productQualityOptions}
							value={field.value ?? ""}
							onChange={(value) =>
								field.onChange((value || undefined) as ProductQualityType | undefined)
							}
							labelClassName={quoteFormLabelClassName}
							valueClassName={quoteFormLabelClassName}
							className={quoteFormInputClassName}
							error={itemErrors?.product_quality?.message}
						/>
					)}
				/>
			</div>

			<div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:flex-wrap sm:gap-4 dark:border-neutral-600">
				<Controller
					control={control}
					name={`${fieldPath}.has_delivery`}
					render={({ field }) => (
						<Checkbox
							label="Incluye entrega"
							checked={Boolean(field.value)}
							onChange={(event) => {
								const checked = event.target.checked;
								field.onChange(checked);
								if (!checked) {
									setValue(`${fieldPath}.delivery_time`, undefined);
									setValue(`${fieldPath}.delivery_time_type`, undefined);
								}
							}}
						/>
					)}
				/>

				<Controller
					control={control}
					name={`${fieldPath}.has_guarantee`}
					render={({ field }) => (
						<Checkbox
							label="Incluye garantía"
							checked={Boolean(field.value)}
							onChange={(event) => {
								const checked = event.target.checked;
								field.onChange(checked);
								if (!checked) {
									setValue(`${fieldPath}.warranty_period`, undefined);
									setValue(`${fieldPath}.warranty_period_time_type`, undefined);
								}
							}}
						/>
					)}
				/>

				<Controller
					control={control}
					name={`${fieldPath}.inventory_available`}
					render={({ field }) => (
						<Checkbox
							label="¿Inventario disponible?"
							checked={Boolean(field.value)}
							onChange={(event) => {
								const checked = event.target.checked;
								field.onChange(checked);
								if (checked) {
									setValue(`${fieldPath}.availability_time`, undefined);
									setValue(`${fieldPath}.availability_time_type`, undefined);
								}
							}}
						/>
					)}
				/>
			</div>

			{inventoryAvailable === false ? (
				<div className={conditionalFieldsGridClassName}>
					<InputText
						label="Tiempo de disponibilidad"
						type="number"
						min="0"
						isRequired={isIncluded}
						placeholder="Ej. 5"
						className={quoteFormInputClassName}
						labelClassName={quoteFormLabelClassName}
						{...register(`${fieldPath}.availability_time`, {
							required:
								isIncluded && inventoryAvailable === false
									? "El tiempo de disponibilidad es requerido."
									: false,
							setValueAs: toNumberOrUndefined,
							validate: (value) =>
								!isIncluded ||
								inventoryAvailable !== false ||
								(value != null && Number(value) > 0) ||
								"El tiempo de disponibilidad debe ser mayor a 0.",
						})}
						error={itemErrors?.availability_time?.message}
					/>

					<Controller
						control={control}
						name={`${fieldPath}.availability_time_type`}
						rules={{
							validate: (value) =>
								!isIncluded ||
								inventoryAvailable !== false ||
								Boolean(value) ||
								"Seleccione el tipo de tiempo.",
						}}
						render={({ field }) => (
							<Dropdown
								label="Tipo de tiempo"
								placeholder="Seleccione"
								appearance="dark"
								isRequired={isIncluded}
								options={timeTypeOptions}
								value={field.value ?? ""}
								onChange={(value) =>
									field.onChange(
										(value || undefined) as TimeTypeValue | undefined,
									)
								}
								labelClassName={quoteFormLabelClassName}
								valueClassName={quoteFormLabelClassName}
								className={quoteFormInputClassName}
								error={itemErrors?.availability_time_type?.message}
							/>
						)}
					/>
				</div>
			) : null}

			{hasDelivery ? (
				<div className={conditionalFieldsGridClassName}>
					<InputText
						label="Tiempo de entrega"
						type="number"
						min="0"
						isRequired={isIncluded}
						placeholder="Ej. 5"
						className={quoteFormInputClassName}
						labelClassName={quoteFormLabelClassName}
						{...register(`${fieldPath}.delivery_time`, {
							required:
								isIncluded && hasDelivery
									? "El tiempo de entrega es requerido."
									: false,
							setValueAs: toNumberOrUndefined,
							validate: (value) =>
								!isIncluded ||
								!hasDelivery ||
								(value != null && Number(value) > 0) ||
								"El tiempo de entrega debe ser mayor a 0.",
						})}
						error={itemErrors?.delivery_time?.message}
					/>

					<Controller
						control={control}
						name={`${fieldPath}.delivery_time_type`}
						rules={{
							validate: (value) =>
								!isIncluded ||
								!hasDelivery ||
								Boolean(value) ||
								"Seleccione el tipo de tiempo.",
						}}
						render={({ field }) => (
							<Dropdown
								label="Tipo de tiempo"
								placeholder="Seleccione"
								appearance="dark"
								isRequired={isIncluded}
								options={deliveryTimeOptions}
								value={field.value ?? ""}
								onChange={(value) =>
									field.onChange(
										(value || undefined) as TimeTypeValue | undefined,
									)
								}
								labelClassName={quoteFormLabelClassName}
								valueClassName={quoteFormLabelClassName}
								className={quoteFormInputClassName}
								error={itemErrors?.delivery_time_type?.message}
							/>
						)}
					/>
				</div>
			) : null}

			{hasGuarantee ? (
				<div className={conditionalFieldsGridClassName}>
					<InputText
						label="Periodo de garantía"
						type="number"
						min="0"
						isRequired={isIncluded}
						placeholder="Ej. 12"
						className={quoteFormInputClassName}
						labelClassName={quoteFormLabelClassName}
						{...register(`${fieldPath}.warranty_period`, {
							required:
								isIncluded && hasGuarantee
									? "El periodo de garantía es requerido."
									: false,
							setValueAs: toNumberOrUndefined,
							validate: (value) =>
								!isIncluded ||
								!hasGuarantee ||
								(value != null && Number(value) > 0) ||
								"El periodo de garantía debe ser mayor a 0.",
						})}
						error={itemErrors?.warranty_period?.message}
					/>

					<Controller
						control={control}
						name={`${fieldPath}.warranty_period_time_type`}
						rules={{
							validate: (value) =>
								!isIncluded ||
								!hasGuarantee ||
								Boolean(value) ||
								"Seleccione el tipo de tiempo.",
						}}
						render={({ field }) => (
							<Dropdown
								label="Tipo de tiempo"
								placeholder="Seleccione"
								appearance="dark"
								isRequired={isIncluded}
								options={timeTypeOptions}
								value={field.value ?? ""}
								onChange={(value) =>
									field.onChange(
										(value || undefined) as TimeTypeValue | undefined,
									)
								}
								labelClassName={quoteFormLabelClassName}
								valueClassName={quoteFormLabelClassName}
								className={quoteFormInputClassName}
								error={itemErrors?.warranty_period_time_type?.message}
							/>
						)}
					/>
				</div>
			) : null}

			<div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-neutral-600">
				{preferredPaymentNormalized ? (
					<div className="flex flex-col gap-1">
						<span
							className={`text-[13px] font-medium ${quoteFormLabelClassName}`}
						>
							Método de pago preferido
						</span>
						<span className="text-sm text-slate-600 dark:text-slate-300">
							{resolvePaymentMethodLabel(preferredPaymentNormalized)}
						</span>
					</div>
				) : null}

				<Controller
					control={control}
					name={`${fieldPath}.payment_method`}
					rules={{
						validate: (value) => {
							if (!isIncluded) return true;
							if (hasNoPaymentMethods) {
								return "El proveedor debe tener al menos un método de pago configurado.";
							}
							return Boolean(normalizePaymentMethodType(value)) ||
								"Seleccione un método de pago.";
						},
					}}
					render={({ field }) =>
						lockedPaymentMethod ? (
							<div className="flex flex-col gap-1">
								<span
									className={`text-[13px] font-medium ${quoteFormLabelClassName}`}
								>
									Método de pago
								</span>
								<span className="text-sm text-slate-600 dark:text-slate-300">
									{resolvePaymentMethodLabel(lockedPaymentMethod)}{" "}
									(asignado automáticamente)
								</span>
								<input
									type="hidden"
									name={field.name}
									ref={field.ref}
									value={field.value ?? lockedPaymentMethod}
									onBlur={field.onBlur}
									onChange={field.onChange}
								/>
							</div>
						) : hasNoPaymentMethods || isLoadingPaymentMethods ? (
							<input
								type="hidden"
								name={field.name}
								ref={field.ref}
								value={field.value ?? ""}
								onBlur={field.onBlur}
								onChange={field.onChange}
							/>
						) : (
							<div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2">
								<Dropdown
									label="Método de pago"
									placeholder="Seleccione"
									appearance="dark"
									isRequired={isIncluded}
									options={paymentMethodOptions}
									value={field.value ?? ""}
									onChange={(value) => {
										field.onChange(value || undefined);
										if (value) {
											clearErrors(`${fieldPath}.payment_method`);
										}
									}}
									labelClassName={quoteFormLabelClassName}
									valueClassName={quoteFormLabelClassName}
									className={quoteFormInputClassName}
									error={itemErrors?.payment_method?.message}
								/>
							</div>
						)
					}
				/>
				{hasNoPaymentMethods && itemErrors?.payment_method?.message ? (
					<p className="m-0 text-[13px] text-red-500">
						{itemErrors.payment_method.message}
					</p>
				) : null}
			</div>

			<div className="mt-4 grid grid-cols-1 gap-4 border-t border-slate-200 pt-4 dark:border-neutral-600 min-[480px]:grid-cols-2">
				<Controller
					control={control}
					name={`${fieldPath}.attachments_form.images`}
					render={({ field }) => (
						<ImageUploader
							label="Imágenes de la cotización"
							maxFiles={1}
							maxSizeMB={5}
							value={field.value ?? []}
							onChange={(images) => field.onChange(images)}
						/>
					)}
				/>

				<Controller
					control={control}
					name={`${fieldPath}.attachments_form`}
					render={({ field }) => (
						<PdfUploader
							label="PDF de cotización (opcional)"
							fileName={attachmentsForm?.pdf_file_name}
							onChange={(next) =>
								field.onChange({
									...(field.value ?? {}),
									pdf_base64: next.base64,
									pdf_file_name: next.fileName,
								})
							}
						/>
					)}
				/>
			</div>

			<div className="mt-4 border-t border-slate-200 pt-4 dark:border-neutral-600">
				<Controller
					control={control}
					name={`${fieldPath}.supplier_selection_justification`}
					rules={{
						validate: (value) => {
							if (!isIncluded) return true;
							const trimmed = value?.trim() ?? "";
							if (!trimmed) {
								return "La justificación de selección es requerida.";
							}
							if (trimmed.length < 10) {
								return "La justificación debe tener al menos 10 caracteres.";
							}
							return true;
						},
					}}
					render={({ field }) => (
						<Textarea
							label="Justificación de selección"
							isRequired={isIncluded}
							placeholder="Ej. Mejor precio, tiempo de entrega y disponibilidad del producto."
							className={quoteFormInputClassName}
							labelClassName={quoteFormLabelClassName}
							value={field.value ?? ""}
							onChange={field.onChange}
							enableCharacterCount
							error={itemErrors?.supplier_selection_justification?.message}
						/>
					)}
				/>
			</div>
		</AccordionItem>
	);
}
