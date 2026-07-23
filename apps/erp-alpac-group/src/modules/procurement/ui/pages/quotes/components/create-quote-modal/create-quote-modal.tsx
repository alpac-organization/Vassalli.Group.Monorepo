import { useEffect, useMemo, useRef, useState } from "react";
import {
	Controller,
	FormProvider,
	useFieldArray,
	useForm,
} from "react-hook-form";
import {
	AccordionGroup,
	Button,
	DatePicker,
	Dropdown,
	Modal,
	Textarea,
} from "@alpac/design-system";
import { ListChecks, Plus, SaveIcon, UserRoundPlus, XIcon } from "lucide-react";
import dayjs from "dayjs";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { toDateOnly } from "@app/modules/payroll/ui/pages/collaborator-profile/utils/date-input";
import { useSuppliers } from "@app/modules/procurement/ui/hooks/suppliers/useSuppliers";
import type { GetSuppliersResponse } from "@app/modules/procurement/domain/suppliers/responses/get-suppliers-response";
import { ConfirmModal } from "@app/shared/components/confirm-modal/confirm-modal";
import type { CreateQuoteModalProps } from "@app/modules/procurement/ui/pages/quotes/components/create-quote-modal/create-quote-modal.types";
import {
	type CreateQuoteFormValues,
	type QuoteDetails,
} from "@app/modules/procurement/ui/pages/quotes/components/create-quote-modal/create-quote-form.types";
import { SupplierQuoteAccordion } from "@app/modules/procurement/ui/pages/quotes/components/create-quote-modal/components/supplier-quote-accordion";
import { SelectSupplierModal } from "@app/modules/procurement/ui/pages/quotes/components/create-quote-modal/components/select-supplier-modal";
import { mapCreateQuoteFormToView } from "@app/modules/procurement/ui/pages/quotes/components/create-quote-modal/create-quote-form.mapper";
import {
	quoteFormInputClassName,
	quoteFormLabelClassName,
	quoteFormOutlineButtonClassName,
	quoteFormPrimaryButtonClassName,
	quoteFormSecondaryButtonClassName,
} from "@app/modules/procurement/ui/pages/quotes/components/create-quote-modal/create-quote-form.styles";
import { useCompanies } from "@app/modules/auth/ui/hooks/useCompanies";

export function CreateQuoteModal({
	isOpen,
	onClose,
	onQuoteCreated,
}: CreateQuoteModalProps) {

	const { companyId, moduleCode } = useUserStore();

	const methods = useForm<CreateQuoteFormValues>({
		defaultValues: {},
		mode: "onSubmit",
	});

	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = methods;

	const { fields, append, remove } = useFieldArray({
		control,
		name: "quote_details",
	});

	const [isSelectSupplierOpen, setIsSelectSupplierOpen] = useState(false);
	const [isSupplierMenuOpen, setIsSupplierMenuOpen] = useState(false);
	const [openSuppliers, setOpenSuppliers] = useState<string[]>([]);
	const supplierMenuRef = useRef<HTMLDivElement>(null);

	const [supplierToDelete, setSupplierToDelete] = useState<{
		index: number;
		clientId: string;
		name: string;
	} | null>(null);

	useEffect(() => {
		if (!isSupplierMenuOpen) return;

		const handleClickOutside = (event: MouseEvent) => {
			if (supplierMenuRef.current?.contains(event.target as Node)) return;
			setIsSupplierMenuOpen(false);
		};

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") setIsSupplierMenuOpen(false);
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleEscape);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleEscape);
		};
	}, [isSupplierMenuOpen]);

	const { GetSuppliers } = useSuppliers({
		suppliersFilters: {
			companie_id: companyId,
			module_code: moduleCode,
			page_number: 1,
			page_size: 100,
		},
	});

	const registeredSuppliers = useMemo(
		() => GetSuppliers.data?.data ?? [],
		[GetSuppliers.data?.data],
	);

	const { GetBranchesQuery } = useCompanies({
		company_id: companyId
	});

	const { data: branches } = GetBranchesQuery;

	const branchOptions = useMemo(() => {
		if (!branches || !Array.isArray(branches)) return [];
		return branches.map(branch => {
			return {
				value: branch.branch_id,
				label: branch.branch_name
			}
		});
	}, [branches]);

	const resetForm = () => {
		reset();
		setIsSelectSupplierOpen(false);
		setIsSupplierMenuOpen(false);
		setSupplierToDelete(null);
	};

	const handleCancel = () => {
		resetForm();
		onClose();
	};

	const onSubmit = (values: CreateQuoteFormValues) => {
		console.log("Testing: ", values)
		onQuoteCreated(mapCreateQuoteFormToView(values));
		resetForm();
		onClose();
	};

	const appendSupplier = (quoteDetails: QuoteDetails) => {
		append(quoteDetails);
	};

	const confirmDeleteSupplier = () => {
		if (!supplierToDelete) return;
		remove(supplierToDelete.index);
		setSupplierToDelete(null);
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
					onSubmit={handleSubmit(onSubmit, () => { })}
					className="flex min-h-0 flex-1 flex-col"
					noValidate
				>
					<div className="scrollbar-dashboard min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-1 sm:pr-2">
						<div className="flex flex-col gap-8 pb-6">
							<section className="flex flex-col gap-6">

								<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

									<Controller
										name="branch_id"
										control={control}
										rules={{ required: "Seleccione una sede de ALPAC." }}
										render={({ field }) => {
											return (
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
											);
										}}
									/>

									<Controller
										name="area_id"
										control={control}
										rules={{ required: "Seleccione una área" }}
										render={({ field }) => {
											return (
												<Dropdown
													value={field.value}
													onChange={(value) => field.onChange(value)}
													label="Área de trabajo"
													placeholder="Seleccione una área"
													appearance="dark"
													labelClassName={quoteFormLabelClassName}
													valueClassName={quoteFormLabelClassName}
													className={quoteFormInputClassName}
													options={branchOptions ?? []}
												/>
											);
										}}
									/>

									<Controller
										control={control}
										name="quote_date"
										rules={{ required: "Seleccione la fecha de cotización." }}
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
												error={errors.quote_date?.message}
												labelClassName={quoteFormLabelClassName}
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
									{...register("observations")}
								/>

							</section>

							<section className="flex flex-col gap-4 border-t border-t-slate-300 pt-7 dark:border-t-neutral-600">
								<div className="flex items-center gap-2">
									<h3 className="m-0! text-[16px]! font-bold text-slate-800 dark:text-white!">
										Cotizaciones por proveedor
									</h3>
								</div>

								<div className="flex items-end gap-3">
									<AccordionGroup
										type="multiple"
										value={openSuppliers}
										onValueChange={(value) => {
											const validateValue = Array.isArray(value)
												? value
												: value
													? [value]
													: [];
											setOpenSuppliers(validateValue);
										}}
										className="min-w-0 flex-1 gap-3"
									>
										<SupplierQuoteAccordion
											accordionValue="supplier-1"
											canRemove={fields.length > 1}
											onRemove={() => { }}
										/>																				
									</AccordionGroup>

									<div ref={supplierMenuRef} className="relative shrink-0">
										<Button
											type="button"
											size="small"
											icon={<Plus size={18} />}
											ariaLabel="Agregar proveedor"
											className={`mt-2 h-10 p-2! ${quoteFormPrimaryButtonClassName}`}
											onClick={() =>
												setIsSupplierMenuOpen((current) => !current)
											}
										/>

										{isSupplierMenuOpen && (
											<ul
												role="menu"
												className="absolute right-0 bottom-full z-50 mb-2 min-w-52 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:border-slate-600 dark:bg-[#272b34] dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)]"
											>
												<li
													role="none"
													className="border-b border-slate-200 dark:border-slate-600"
												>
													<button
														type="button"
														role="menuitem"
														className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700/60"
														onClick={() => {
															setIsSupplierMenuOpen(false);
															// TODO: agregar proveedor nuevo
														}}
													>
														<UserRoundPlus size={16} />
														Nuevo proveedor
													</button>
												</li>
												<li role="none">
													<button
														type="button"
														role="menuitem"
														className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700/60"
														onClick={() => {
															setIsSupplierMenuOpen(false);
															setIsSelectSupplierOpen(true);
														}}
													>
														<ListChecks size={16} />
														Seleccionar existente
													</button>
												</li>
											</ul>
										)}
									</div>
								</div>

								{/* <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-start">
									<Button
										type="button"
										size="giant"
										label="Agregar proveedor"
										icon={<Plus size={20} />}
										className={`w-full! sm:w-auto! ${quoteFormPrimaryButtonClassName}`}
										onClick={() => { }}
									/>
									<Button
										type="button"
										size="giant"
										label="Seleccionar proveedor"
										icon={<ListChecks size={20} />}
										className={`w-full! sm:w-auto! ${quoteFormOutlineButtonClassName}`}
										onClick={() => setIsSelectSupplierOpen(true)}
									/>
								</div> */}
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

			<SelectSupplierModal
				key={
					isSelectSupplierOpen
						? "select-supplier-open"
						: "select-supplier-closed"
				}
				isOpen={isSelectSupplierOpen}
				onClose={() => setIsSelectSupplierOpen(false)}
				suppliers={registeredSuppliers}
				isLoading={GetSuppliers.isPending || GetSuppliers.isFetching}
				onSelect={() => {

				}}
			/>

			<ConfirmModal
				isOpen={Boolean(supplierToDelete)}
				type="CANCEL"
				title={`¿Está seguro de eliminar a "${supplierToDelete?.name ?? "este proveedor"}"? Se quitarán también sus productos de la cotización.`}
				buttonActionLabel="Eliminar"
				buttonActionClass="rounded-md! bg-red-500! text-white! hover:bg-red-600! dark:bg-red-700!"
				onClose={() => setSupplierToDelete(null)}
				handleFinalAction={confirmDeleteSupplier}
			/>
		</Modal>
	);
}
