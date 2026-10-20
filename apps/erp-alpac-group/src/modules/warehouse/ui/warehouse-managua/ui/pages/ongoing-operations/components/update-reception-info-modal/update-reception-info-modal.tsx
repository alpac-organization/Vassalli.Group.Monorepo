import { useEffect, useMemo, useState } from "react";
import { Controller, FormProvider, useFieldArray, useForm } from "react-hook-form";
import {
	AccordionGroup,
	AccordionItem,
	Button,
	Checkbox,
	InputText,
	Modal,
	RadioButton,
	Textarea,
} from "@alpac/design-system";
import { PlusIcon, Trash2Icon, UserRoundSearchIcon } from "lucide-react";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useOperationalOrders } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useOperationalOrders";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { Loader } from "@app/shared/components/loaders/loader";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { SelectCustomerModal } from "@app/modules/customer/ui/views/select-customer-modal/select-customer-modal";
import type { SelectableCustomer } from "@app/modules/customer/ui/views/select-customer-modal/select-customer-modal.types";
import { inputClassName, labelClassName } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/ongoing-operations/utils/styles";
import type {
	UpdateReceptionInfoFormValues,
	UpdateReceptionInformationModalProps,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/ongoing-operations/components/update-reception-info-modal/types/update-reception-info-modal.types";
import type { UpdateOperationalOrderInformationRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/operational-orders/update-operational-order-information-request";
import { MerchandiseItem } from "./components/merchandise-item/merchandise-item";

function buildCustomerLabel(name?: string | null, identification?: string | null): string {

	const customerName = name?.trim() || "";
	const customerIdentification = identification?.trim() || "";

	if (customerName && customerIdentification) {
		return `${customerName} (${customerIdentification})`;
	}

	return customerName || customerIdentification;
}

export function UpdateReceptionInformationModal({
	isOpen,
	onClose,
	orderId,
	poCode,
	onSuccess,
}: UpdateReceptionInformationModalProps) {
	const { companyId, moduleCode } = useUserStore();
	const { getMappedError } = useMappedError();
	const { handleRequestError, handleRequestSuccess, AlertComponent } =
		useAlertState();

	const [isSelectCustomerOpen, setIsSelectCustomerOpen] = useState(false);
	const [selectedCustomerLabel, setSelectedCustomerLabel] = useState<string>("");
	const [openMerchandises, setOpenMerchandises] = useState<string[]>([]);
	const [hasExistingCustomer, setHasExistingCustomer] = useState(false);

	const detailPayload = useMemo(
		() =>
			isOpen && orderId && companyId && moduleCode
				? {
					company_id: companyId,
					module_code: moduleCode,
					operational_order_id: orderId,
				}
				: null,
		[isOpen, orderId, companyId, moduleCode],
	);

	const { GetOperationalOrderDetail, UpdateOperationalOrderInformation } =
		useOperationalOrders({ detailPayload });

	const { data: detail, isLoading: isDetailLoading } = GetOperationalOrderDetail;

	/* const {
		control,
		handleSubmit,
		watch,
		reset,
		setValue,
		clearErrors,
		formState: { errors },
	} = useForm<UpdateReceptionInfoFormValues>({
		mode: "onSubmit",
		defaultValues: {
			customer_id: "",
			package_amount: 0,
			merchandise_weight: 0,
			shipping_company: "",
			// consignee: "",
			sender: "",
			is_alerted: false,
			merchandises: [],
		},
	}); */

	const methods = useForm<UpdateReceptionInfoFormValues>({
		mode: "onSubmit",
		defaultValues: {
			customer_id: "",
			package_amount: 0,
			merchandise_weight: 0,
			shipping_company: "",
			// consignee: "",
			sender: "",
			is_alerted: false,
			is_consolidated: false,
			merchandises: [],
		},
	});

	const control = methods.control;

	const { fields, append, remove } = useFieldArray({
		control,
		name: "merchandises",
	});

	const customerId = methods.watch("customer_id");

	useEffect(() => {
		if (!isOpen) return;

		methods.clearErrors();
		setIsSelectCustomerOpen(false);
		setOpenMerchandises([]);

		if (!detail) {
			methods.reset({
				customer_id: "",
				package_amount: 0,
				merchandise_weight: 0,
				shipping_company: "",
				// consignee: "",
				sender: "",
				is_alerted: false,
				is_consolidated: false,
				merchandises: [],
			});
			setSelectedCustomerLabel("");
			setHasExistingCustomer(false);
			return;
		}

		const customer = detail.customer_information;
		const existingCustomer = Boolean(customer?.customer_id);

		methods.reset({
			customer_id: customer?.customer_id || "",
			package_amount: detail.packages_count ?? 0,
			merchandise_weight: detail.weight ?? 0,
			shipping_company: detail.shipping_company || "",
			// consignee: detail.consignee || "",
			sender: detail.sender || "",
			is_alerted: Boolean(detail.is_alerted),
			is_consolidated: Boolean(detail.is_consolidated),
			merchandises: [],
		});

		setHasExistingCustomer(existingCustomer);
		setSelectedCustomerLabel(
			existingCustomer
				? buildCustomerLabel(
					customer?.legal_name,
					customer?.identification_number,
				)
				: "",
		);
	}, [isOpen, detail, methods.reset, methods.clearErrors]);

	const handleSelectCustomer = (customers: SelectableCustomer[]) => {
		const customer = customers[0];
		if (!customer) return;

		methods.setValue("customer_id", customer.customer_id, {
			shouldValidate: true,
			shouldDirty: true,
		});
		setSelectedCustomerLabel(
			buildCustomerLabel(
				customer.legal_name,
				customer.identification_number,
			),
		);
	};

	const handleAddMerchandise = () => {
		append({
			merchandise: "",
			merchandise_description: "",
		});
	};

	useEffect(() => {
		if (fields.length === 0) {
			setOpenMerchandises([]);
			return;
		}

		const lastField = fields[fields.length - 1];
		if (!lastField) return;

		setOpenMerchandises((prev) =>
			prev.includes(lastField.id) ? prev : [...prev, lastField.id],
		);
	}, [fields]);

	const onSubmit = async (values: UpdateReceptionInfoFormValues) => {

		if (!orderId || !companyId || !moduleCode) return;

		const merchandises = values.merchandises
			.map((item) => {
				const merchandise = item.merchandise?.trim() || null;
				const merchandise_description =
					item.merchandise_description?.trim() || null;
				return { merchandise, merchandise_description };
			})
			.filter(
				(item) =>
					Boolean(item.merchandise) || Boolean(item.merchandise_description),
			);

		const duplicateNames = merchandises
			.map((item) => item.merchandise)
			.filter((name): name is string => Boolean(name))
			.reduce<string[]>((acc, name) => {
				const alreadyCounted = acc.some(
					(existing) => existing.toLowerCase() === name.toLowerCase(),
				);
				if (alreadyCounted) return acc;

				const count = merchandises.filter(
					(item) =>
						item.merchandise &&
						item.merchandise.toLowerCase() === name.toLowerCase(),
				).length;

				return count > 1 ? [...acc, name] : acc;
			}, []);

		if (duplicateNames.length > 0) {
			handleRequestError(
				`La lista contiene mercancías duplicadas: ${duplicateNames.join(", ")}`,
			);
			return;
		}

		try {
			const packageAmount = Number(values.package_amount);
			const merchandiseWeight = Number(values.merchandise_weight);

			const payload: UpdateOperationalOrderInformationRequest = {
				company_id: companyId,
				module_code: moduleCode,
				operational_order_id: orderId,
				customer_id: values.customer_id || null,
				package_amount: packageAmount > 0 ? packageAmount : null,
				merchandise_weight: merchandiseWeight > 0 ? merchandiseWeight : null,
				shipping_company: values.shipping_company.trim() || null,
				// consignee: values.consignee.trim() || null,
				sender: values.sender.trim() || null,
				is_alerted: Boolean(values.is_alerted),
				is_consolidated: Boolean(values.is_consolidated),
				merchandises: merchandises.length > 0 ? merchandises : null,
			}

			await UpdateOperationalOrderInformation.mutateAsync(payload);

			handleRequestSuccess("Información de recepción registrada correctamente.");

			setTimeout(() => {
				onSuccess?.();
				onClose();
			}, 500);

		} catch (error) {
			const mapped = getMappedError(error as ApiErrorResponse);
			handleRequestError(
				mapped?.description ||
				"Error al actualizar la información de la orden operacional.",
			);
		}
	};

	const resolvedPoCode = detail?.po_code || poCode;
	const isBusy =
		isDetailLoading || UpdateOperationalOrderInformation.isPending;

	return (
		<>
			<Modal
				isOpen={isOpen && Boolean(orderId)}
				onClose={onClose}
				variant="form"
				size="6xl"
				title={
					resolvedPoCode
						? `Registrar Información — ${resolvedPoCode}`
						: "Registrar Información de Recepción"
				}
				description="Asigna cliente, bultos, peso y datos de envío a la orden operacional. Puedes agregar mercancías de forma opcional."
			>


				{isDetailLoading ? (
					<div className="px-3 py-16 text-center">
						<Loader title="Cargando información de la orden operacional..." />
					</div>
				) : (
					<FormProvider {...methods}>
						<form
							className="flex flex-col gap-6"
						>
							{AlertComponent}

							<div className="flex flex-col gap-6">
								<div className="flex flex-col gap-1.5">
									<div className="flex flex-col gap-3 sm:flex-row sm:items-end">
										<div className="min-w-0 flex-1">
											<InputText
												label="Consignatario"
												labelClassName={labelClassName}
												readOnly
												placeholder={
													hasExistingCustomer
														? "Consignatario registrado"
														: "Seleccione un consignatario..."
												}
												value={selectedCustomerLabel}
												className={inputClassName}
											/>
										</div>
										<Controller
											name="customer_id"
											control={methods.control}
											render={({ field }) => (
												<input
													type="hidden"
													{...field}
													value={field.value || ""}
												/>
											)}
										/>
										<Button
											type="button"
											size="giant"
											label={customerId ? "Cambiar" : "Seleccionar"}
											icon={<UserRoundSearchIcon size={18} />}
											onClick={() => setIsSelectCustomerOpen(true)}
											disabled={isBusy}
											className="w-full! sm:w-auto! shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500! text-white! dark:bg-alpac-primary-700!"
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">

									<Controller
										control={methods.control}
										name="is_alerted"
										render={({ field }) => (
											<div className="flex self-center">
												<Checkbox
													label="¿Tiene Alerta?"
													className="gap-3! text-slate-300!"
													checked={Boolean(field.value)}
													onChange={(e) => field.onChange(e.target.checked)}
												/>
											</div>
										)}
									/>
								</div>

								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">



									<Controller
										name="package_amount"
										control={methods.control}
										rules={{
											validate: (value) =>
												value == null ||
												Number(value) >= 0 ||
												"La cantidad de bultos no puede ser negativa.",
										}}
										render={({ field }) => (
											<InputText
												label="Cantidad de bultos"
												labelClassName={labelClassName}
												type="number"
												placeholder="0"
												value={
													field.value !== undefined ? String(field.value) : ""
												}
												onChange={(e) => field.onChange(Number(e.target.value))}
												error={methods.formState.errors.package_amount?.message}
												className={inputClassName}
											/>
										)}
									/>

									<Controller
										name="merchandise_weight"
										control={methods.control}
										rules={{
											validate: (value) =>
												value == null ||
												Number(value) >= 0 ||
												"El peso no puede ser negativo.",
										}}
										render={({ field }) => (
											<InputText
												label="Peso total (kg)"
												labelClassName={labelClassName}
												type="number"
												placeholder="0.00"
												value={
													field.value !== undefined ? String(field.value) : ""
												}
												onChange={(e) => field.onChange(Number(e.target.value))}
												error={methods.formState.errors.merchandise_weight?.message}
												className={inputClassName}
											/>
										)}
									/>

									<Controller
										name="shipping_company"
										control={methods.control}
										render={({ field }) => (
											<InputText
												label="Naviera / Compañía de envío"
												labelClassName={labelClassName}
												placeholder="Ej. Maersk, MSC..."
												value={field.value || ""}
												onChange={(e) => field.onChange(e.target.value)}
												error={methods.formState.errors.shipping_company?.message}
												className={inputClassName}
											/>
										)}
									/>

									{/* <Controller
                  name="consignee"
                  control={control}
                  render={({ field }) => (
                    <InputText
                      label="Consignatario"
                      labelClassName={labelClassName}
                      placeholder="Nombre del consignatario"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      error={errors.consignee?.message}
                      className={inputClassName}
                    />
                  )}
                /> */}

									<Controller
										name="sender"
										control={methods.control}
										render={({ field }) => (
											<InputText
												label="Remitente"
												labelClassName={labelClassName}
												placeholder="Nombre del remitente"
												value={field.value || ""}
												onChange={(e) => field.onChange(e.target.value)}
												error={methods.formState.errors?.sender?.message}
												className={inputClassName}
											/>
										)}
									/>



									<div className="flex flex-col gap-2 md:col-span-2">
										<span className="text-sm font-medium">
											¿Cómo viene la mercadería?
										</span>
										<Controller
											control={methods.control}
											name="is_consolidated"
											render={({ field }) => (
												<div className="grid grid-cols-2 gap-3">

													<div className="">
														<RadioButton
															id="is-consolidated-no"
															name="is_consolidated"
															value="false"
															label="No"
															labelPosition="right"
															checked={field.value === false}
															onChange={() => field.onChange(false)}
															disabled={isBusy}
															className={`w-full justify-center rounded-md border px-4 py-3.5 ${field.value === false
																? "border-red-400 bg-red-100 dark:border-red-400 dark:bg-red-900/40"
																: "border-slate-300 dark:border-neutral-600"
																}`}
															labelClassName={labelClassName}
														/>
													</div>

													<div>
														<RadioButton
															id="is-consolidated-yes"
															name="is_consolidated"
															value="true"
															label="Sí"
															labelPosition="right"
															checked={field.value === true}
															onChange={() => field.onChange(true)}
															disabled={isBusy}
															className={`w-full justify-center rounded-md border px-4 py-3.5 ${field.value === true
																? "border-emerald-400 bg-emerald-100 dark:border-emerald-500 dark:bg-emerald-900/40"
																: "border-slate-300 dark:border-neutral-600"
																}`}
															labelClassName={labelClassName}
														/>
													</div>
												</div>
											)}
										/>
									</div>
								</div>

								<div className="border-t border-t-slate-300 dark:border-t-neutral-600" />

								<div className="flex flex-col gap-4">
									<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
										<div className="min-w-0 flex flex-col">
											<span className="text-[15px] font-medium text-black dark:text-white">
												Mercancías (opcional)
											</span>
											<small className="text-gray-500 dark:text-gray-300">
												Agrega las mercancías asociadas a la orden operacional.
											</small>
										</div>

										<Button
											type="button"
											size="giant"
											label="Agregar mercancía"
											icon={<PlusIcon size={18} />}
											onClick={handleAddMerchandise}
											disabled={isBusy}
											className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! sm:w-auto!"
										/>
									</div>

									{fields.length === 0 ? (
										<p className="m-0 text-sm text-slate-500 dark:text-slate-400">
											Aún no hay mercancías agregadas.
										</p>
									) : (
										<AccordionGroup
											type="multiple"
											value={openMerchandises}
											onValueChange={(value) => {
												const nextValue = Array.isArray(value)
													? value
													: value
														? [value]
														: [];
												setOpenMerchandises(nextValue);
											}}
											className="gap-3"
										>


											{fields.map((field, index) => (

												<MerchandiseItem
													key={field.id}
													merchandiseItemIndex={index}
													accordionValue={field.id}
													onRemove={() => remove(index)}
												/>

											))}


											{/* {fields.map((item, index) => (
											<div key={item.id} className="relative">
												<AccordionItem
													value={item.id}
													className="rounded-md! border-slate-300! dark:border-slate-600! dark:bg-[#272b34]!"
													triggerClassName="h-auto! min-h-12! py-2.5! pr-3!"
													contentClassName="flex flex-col gap-4 p-4"
													title={
														<div className="flex min-w-0 items-center gap-3 pr-12">
															<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-alpac-primary-500 text-sm font-semibold text-white dark:bg-alpac-primary-700">
																{index + 1}
															</span>
															<span className="min-w-0 truncate text-[15px] font-semibold text-slate-800 dark:text-white">
																{watch(`merchandises.${index}.merchandise`) ||
																	`Mercancía #${index + 1}`}
															</span>
														</div>
													}
												>
													<div className="grid grid-cols-1 gap-4">
														<Controller
															name={`merchandises.${index}.merchandise`}
															control={control}
															render={({ field }) => (
																<InputText
																	label="Mercancía"
																	labelClassName={labelClassName}
																	placeholder="Nombre de la mercancía"
																	value={field.value || ""}
																	onChange={(e) =>
																		field.onChange(e.target.value)
																	}
																	className={inputClassName}
																/>
															)}
														/>
														<Controller
															name={`merchandises.${index}.merchandise_description`}
															control={control}
															render={({ field }) => (
																<Textarea
																	label="Descripción"
																	labelClassName={labelClassName}
																	placeholder="Descripción de la mercancía..."
																	rows={3}
																	value={field.value || ""}
																	onChange={(e) =>
																		field.onChange(e.target.value)
																	}
																	className={inputClassName}
																/>
															)}
														/>
													</div>
												</AccordionItem>
												<Button
													type="button"
													size="small"
													tooltip="Quitar mercancía"
													ariaLabel="Quitar mercancía"
													icon={<Trash2Icon size={16} />}
													onClick={() => remove(index)}
													className="absolute! top-2.5 right-10 z-10 h-8 w-8! shrink-0 rounded-md! bg-red-500! text-[13px]! text-white! hover:bg-red-800! dark:bg-red-900!"
												/>
											</div>
										))}
										*/}



										</AccordionGroup>
									)}

								</div>
							</div>

							<div className="border-t border-t-slate-300 dark:border-t-neutral-600 -mx-6" />

							<div className="flex min-w-0 flex-col-reverse gap-2.5 sm:flex-row sm:justify-end sm:gap-3">
								<Button
									type="button"
									size="giant"
									label="Cancelar"
									onClick={onClose}
									disabled={UpdateOperationalOrderInformation.isPending}
									className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-white! dark:bg-transparent! text-slate-700! dark:text-slate-300! border! border-slate-300! dark:border-slate-600! hover:bg-slate-50! dark:hover:bg-slate-700/30! sm:w-auto!"
								/>
								<Button
									type="button"
									size="giant"
									label="Guardar"
									onClick={methods.handleSubmit(onSubmit)}
									isLoading={UpdateOperationalOrderInformation.isPending}
									disabled={isBusy}
									className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! sm:w-auto!"
								/>
							</div>
						</form>
					</FormProvider>
				)}
			</Modal>

			<SelectCustomerModal
				isOpen={isSelectCustomerOpen}
				onClose={() => setIsSelectCustomerOpen(false)}
				selectionType="single"
				onSelect={handleSelectCustomer}
			/>
		</>
	);
}
