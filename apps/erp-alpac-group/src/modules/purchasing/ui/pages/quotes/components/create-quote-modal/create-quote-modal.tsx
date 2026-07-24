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
	DatePicker,
	Dropdown,
	InputText,
	Modal,
	Textarea,
} from "@alpac/design-system";
import { SaveIcon, XIcon } from "lucide-react";
import dayjs from "dayjs";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { toDateOnly } from "@app/modules/payroll/ui/pages/collaborator-profile/utils/date-input";
import { useSuppliers } from "@app/modules/purchasing/ui/hooks/suppliers/useSuppliers";
import { ConfirmModal } from "@app/shared/components/confirm-modal/confirm-modal";
import type { CreateQuoteModalProps } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/create-quote-modal.types";
import {
	type CatalogProductOption,
	type CreateQuoteFormValues,
} from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/create-quote-form.types";
import { ProductQuoteAccordion } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/components/product-quote-accordion";
import { mapCreateQuoteFormToView } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/create-quote-form.mapper";
import {
	quoteFormInputClassName,
	quoteFormLabelClassName,
	quoteFormPrimaryButtonClassName,
	quoteFormSecondaryButtonClassName,
} from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/create-quote-form.styles";
import { useCompanies } from "@app/modules/auth/ui/hooks/useCompanies";
import { useAreas } from "@app/modules/admin/ui/hooks/areas/useAreas";

const productMock: CatalogProductOption[] = [
	{
		product_id: "90c68967-7758-4fd5-bc33-793470d10fd0",
		product_name: "Aceite Motor 15W40",
		quantity: 12,
		unit_measure_id: "3c338ea1-badb-48f9-8362-0ca58ecd264b",
		unit_measure_name: "Galón",
	},
	{
		product_id: "a1b2c3d4-1111-4aaa-8bbb-1234567890ab",
		product_name: "Filtro de aire",
		quantity: 6,
		unit_measure_id: "4d449fb2-cbec-59g0-9473-1db69fde375c",
		unit_measure_name: "Unidad",
	},
	{
		product_id: "b2c3d4e5-2222-4bbb-9ccc-2345678901bc",
		product_name: "Resma de papel bond carta",
		quantity: 20,
		unit_measure_id: "4d449fb2-cbec-59g0-9473-1db69fde375c",
		unit_measure_name: "Unidad",
	},
	{
		product_id: "c3d4e5f6-3333-4ccc-addd-3456789012cd",
		product_name: "Detergente industrial 5L",
		quantity: 8,
		unit_measure_id: "4d449fb2-cbec-59g0-9473-1db69fde375c",
		unit_measure_name: "Unidad",
	},
	{
		product_id: "d4e5f6a7-4444-4ddd-beee-4567890123de",
		product_name: "Casco de seguridad",
		quantity: 15,
		unit_measure_id: "4d449fb2-cbec-59g0-9473-1db69fde375c",
		unit_measure_name: "Unidad",
	},
	{
		product_id: "e5f6a7b8-5555-4eee-cfff-5678901234ef",
		product_name: "Guantes anticorte",
		quantity: 30,
		unit_measure_id: "5e55a0c3-dcfd-60h1-a584-2ec70gef486d",
		unit_measure_name: "Par",
	},
]

export function CreateQuoteModal({ isOpen, onClose, onQuoteCreated }: CreateQuoteModalProps) {

	const { companyId, moduleCode } = useUserStore();

	const methods = useForm<CreateQuoteFormValues>({
		defaultValues: {
			area_id: "",
			branch_id: "",
			application_code: "",
			quote_date: "",
			observations: "",
			quote_details: [],
			products: productMock,
		},
		mode: "onSubmit",
	});

	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = methods;

	const { fields, remove } = useFieldArray({
		control,
		name: "products",
	});

	const [openProducts, setOpenProducts] = useState<string[]>(() =>
		productMock.map((product) => product.product_id),
	);

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

	const { GetAreasByCompany } = useAreas({
		company_id: companyId
	});

	const { data: branches } = GetBranchesQuery;
	const { data: areas } = GetAreasByCompany;

	const branchOptions = useMemo(() => {
		if (!branches || !Array.isArray(branches)) return [];
		return branches.map(branch => {
			return {
				value: branch.branch_id,
				label: branch.branch_name
			}
		});
	}, [branches]);

	const areasOptions = useMemo(() => {
		if (!areas || !Array.isArray(areas)) return [];
		return areas.map(area => {
			return {
				value: area.work_area_id,
				label: area.work_area_name
			}
		});
	}, [branches]);

	const resetForm = () => {
		reset({
			area_id: "",
			branch_id: "",
			application_code: "",
			quote_date: "",
			observations: "",
			quote_details: [],
			products: productMock,
		});
		setOpenProducts(productMock.map((product) => product.product_id));
	};

	const handleCancel = () => {
		resetForm();
		onClose();
	};

	const onSubmit = (values: CreateQuoteFormValues) => {
		console.log("Testing: ", values);
		onQuoteCreated(mapCreateQuoteFormToView(values));
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
					onSubmit={handleSubmit(onSubmit, () => { })}
					className="flex min-h-0 flex-1 flex-col"
					noValidate
				>
					<div className="scrollbar-dashboard min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
						<div className="flex flex-col gap-8">
							<section className="flex flex-col gap-6 p-1">

								<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">

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
										name="application_code"
										control={control}
										rules={{ required: "Se requiere un código de solicitud" }}
										render={({ field }) => {
											return (
												<InputText
													value={field.value}
													onChange={(value) => field.onChange(value)}
													label="Código de solicitud"
													placeholder="Código"
													labelClassName={quoteFormLabelClassName}
													className={quoteFormInputClassName}
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
													options={areasOptions ?? []}
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

							<section className="flex flex-col gap-4 dark:border-t-neutral-600">
								<div className="flex items-center gap-2">
									<h3 className="m-0! text-[16px]! font-bold text-slate-800 dark:text-white!">
										Cotizaciones por producto
									</h3>
								</div>

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
									className="gap-3"
								>
									{fields.map((field, index) => (
										<ProductQuoteAccordion
											key={field.id}
											index={index}
											accordionValue={field.product_id}
											canRemove={fields.length > 0}
											productName={field.product_name}
											productId={field.product_id}
											unitOfMeasure={field.unit_measure_name}
											unitMeasureId={field.unit_measure_id}
											quantity={field.quantity}
											suppliers={registeredSuppliers}
											isLoadingSuppliers={
												GetSuppliers.isPending || GetSuppliers.isFetching
											}
											onRemove={() => {
												remove(index);
												setOpenProducts((current) =>
													current.filter(
														(value) => value !== field.product_id,
													),
												);
											}}
										/>
									))}
								</AccordionGroup>
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

			<ConfirmModal
				isOpen={false}
				type="CANCEL"
				title={`¿Está seguro de eliminar a?`}
				buttonActionLabel="Eliminar"
				buttonActionClass="rounded-md! bg-red-500! text-white! hover:bg-red-600! dark:bg-red-700!"
				onClose={() => {}}
				handleFinalAction={() => {}}
			/>
		</Modal>
	);
}
