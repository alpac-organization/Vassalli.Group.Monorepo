import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Chips, Dropdown, InputText, Modal, RadioButton, Textarea } from "@alpac/design-system";
import { Controller, FormProvider, useForm } from "react-hook-form";
import type {
	CreatePurchaseRequestFormValues,
	PurchaseRequestModalProps
} from "./purchase-request-modal.types";
import { PurchaseRequestDetail } from "../purchase-request-detail/purchase-request-detail";
import type {
	CreatePurchaseRequestPayload,
	PurchaseRequestItemAdditionalData,
} from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/create-purchase-request-payload";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { usePurchase } from "@app/modules/purchasing/ui/hooks/purchase/usePurchase";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { useAreas } from "@app/modules/admin/ui/hooks/areas/useAreas";
import { RoleEnum } from "@app/core/enums/role.enum";
import { Loader } from "@app/shared/components/loaders/loader";
import type { CostCenters } from "@app/modules/admin/domain/ApiContract/responses/areas/get-areas.response";
import { SelectServiceOrderModal } from "../select-service-order-modal/select-service-order-modal";
import type { GetServiceOrdersResponse } from "@app/modules/service-order/domain/ApiContract/Responses/service-order-responses/get-service-orders.response";
import { PriorityLevelOptions } from "@app/modules/purchasing/domain/enums/purchase-request-priority-level.enum";
import { PurchaseRequestDestinationEnum, type PurchaseRequestDestinationType } from "@app/modules/purchasing/domain/enums/purchase-request-destination.enum";
import { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import { PlusIcon } from "lucide-react";

const inputClassName =
	"w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const dropdownClassName =
	"w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";
const labelClassName = "text-black! dark:text-white!";

const emptyFormValues = (): CreatePurchaseRequestFormValues => ({
	area_id: "",
	cost_center_id: "",
	priority_level_id: "",
	observations: "",
	purchase_request_items: [],
});

export const PurchaseRequestModal = ({
	isOpen,
	onClose,
	onSubmit,
	currentBranchId,
	requestType,
	onRequestError,
	onRequestSuccess
}: PurchaseRequestModalProps) => {

	const { companyId, moduleCode, role } = useUserStore();
	const { getMappedError } = useMappedError();

	const [costCenters, setCostCenters] = useState<CostCenters[]>([]);
	const [selectedOrigen, setSelectedOrigin] = useState<PurchaseRequestDestinationType>("Internal");
	const [isSelectServiceOrderModalOpen, setIsSelectServiceOrderModalOpen] = useState(false);
	const [selectedServiceOrder, setSelectedServiceOrder] = useState<GetServiceOrdersResponse | null>(null);

	const methods = useForm<CreatePurchaseRequestFormValues>({
		defaultValues: emptyFormValues(),
		mode: "onSubmit",
	});

	const isAdministrator = role === RoleEnum.ADMINISTRATOR;
	const isRequisition = requestType.textValue === PurchaseRequestEnum.Requisition.textValue;
	const isEventual = requestType.textValue === PurchaseRequestEnum.Eventual.textValue;

	const {
		control,
		handleSubmit,
		reset,
		setValue,
		formState: { errors },
	} = methods;

	const areaId = methods.watch("area_id");
	const costCenterId = methods.watch("cost_center_id");
	const priorityLevelId = methods.watch("priority_level_id");
	const observations = methods.watch("observations");

	const hasPrioritySelected = Number(priorityLevelId) > 0;

	const isDisabledActions = Boolean(
		(isAdministrator && !areaId?.trim()) ||
		(isAdministrator && !costCenterId?.trim()) ||
		(isRequisition && !hasPrioritySelected) ||
		!observations?.trim() ||
		(selectedOrigen === "ServiceOrder" && !selectedServiceOrder)
	);

	const { GetAreasByCompany } = useAreas({ company_id: companyId });
	const { CreatePurchaseRequest } = usePurchase();

	const areaOptions = useMemo(
		() => {
			const areas = GetAreasByCompany.data ?? [];
			return areas.map(area => ({
				label: area.work_area_name,
				value: area.work_area_id,
				cost_centers: area.cost_centers
			}))
		}, [GetAreasByCompany.data]
	);

	const costCenterOptions = useMemo(
		() => {
			return costCenters.map(center => ({
				label: center.cost_center_name, value: center.cost_center_id
			}))
		},
		[costCenters, GetAreasByCompany.data]
	);

	const scrollContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		reset(emptyFormValues());
		setSelectedOrigin("Internal");
		setSelectedServiceOrder(null);
		setIsSelectServiceOrderModalOpen(false);
	}, [isOpen, reset]);

	const isCreating = CreatePurchaseRequest.isPending;

	const handleClose = () => {
		if (isCreating) return;
		reset(emptyFormValues());
		setSelectedOrigin("Internal");
		setSelectedServiceOrder(null);
		setIsSelectServiceOrderModalOpen(false);
		onClose();
	};

	const handleOriginChange = (origin: PurchaseRequestDestinationType) => {
		setSelectedOrigin(origin);
		if (origin !== "ServiceOrder") {
			setSelectedServiceOrder(null);
		}
	};

	const handleFormSubmit = handleSubmit((values) => {
		if (!currentBranchId) return;

		const payload: CreatePurchaseRequestPayload = {
			company_id: companyId,
			module_code: moduleCode,
			...(isAdministrator ? { area_id: values.area_id } : {}),
			cost_center_id: values.cost_center_id,
			branch_id: currentBranchId,
			request_type: Number(requestType.value),
			...(isRequisition
				? { priority_level: Number(values.priority_level_id) }
				: {}),
			destination: PurchaseRequestDestinationEnum[selectedOrigen].value,
			observations: values.observations.trim(),
			purchase_request_items: values.purchase_request_items.map((item) => {
				const productJustification = item.justification?.trim() ?? "";
				const productImages = item.product_images?.filter(Boolean) ?? [];
				const additionalData: PurchaseRequestItemAdditionalData | null =
					productImages.length
						? { images_product_to_changed: productImages }
						: null;

				return {
					product_id: item.product_id,
					quantity: Number(item.quantity),
					description: item.description,
					unit_measure_id: item.unit_measure_id,
					additional_data: additionalData
						? JSON.stringify(additionalData)
						: null,
					...(productJustification
						? { justification: productJustification }
						: {}),
					...(item.quantity_unit != null && Number(item.quantity_unit) > 0
						? { quantity_unit: Number(item.quantity_unit) }
						: {}),
				};
			}),
		};

		CreatePurchaseRequest.mutate(payload, {
			onSuccess() {
				onRequestSuccess?.("Solicitud de compra creada con éxito.");
				reset(emptyFormValues());
				onSubmit?.();
				onClose();
			},
			onError(error) {
				const mappedError = getMappedError(error);
				onRequestError?.(mappedError.description);
			},
		});
	});

	return (
		<>
			{isOpen && isCreating && (
				<Loader title="Creando solicitud..." />
			)}

			<Modal
				isOpen={isOpen}
				onClose={handleClose}
				title={`Registrar ${requestType.label}`}
				variant="form"
				size="8xl"
				description="Complete la información de la solicitud de compra"
				panelClassName="flex h-[min(94dvh,54rem)] w-[min(calc(100vw-1rem),56rem)] min-w-0 flex-col"
				contentClassName="flex min-h-0 flex-1 flex-col"
			>
				<FormProvider {...methods}>
					<form
						onSubmit={handleFormSubmit}
						className="flex min-h-0 flex-1 flex-col"
						noValidate
					>
						<div ref={scrollContainerRef} className="p-1 scrollbar-dashboard min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">

							<div className="flex flex-col gap-4 pb-2">

								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">

									{isAdministrator && (
										<div className="min-w-0">
											<Controller
												name="area_id"
												control={control}
												rules={{
													required: "El área es requerida",
												}}
												render={({ field }) => (
													<Dropdown
														label="Área de trabajo"
														isRequired
														appearance="dark"
														placeholder="Seleccione una de las áreas de la empresa"
														value={field.value}
														onChange={(value) => {
															const [filteredAreas] = areaOptions.filter(area => area.value === value);
															const filteredCostCenters = filteredAreas?.cost_centers;
															setCostCenters(filteredCostCenters ?? []);
															field.onChange(value);
															setValue("cost_center_id", "");
														}}
														options={areaOptions}
														labelClassName={labelClassName}
														valueClassName={labelClassName}
														className={`${dropdownClassName} `}
														error={errors.area_id?.message}
													/>
												)}
											/>
										</div>
									)}


									<div className="min-w-0">
										{
											isAdministrator ?
												<Controller
													name="cost_center_id"
													control={control}
													rules={{
														required: "El centro de costo asociado es requerido",
													}}
													render={({ field }) => (
														<Dropdown
															label="Centro de costo"
															isRequired
															appearance="dark"
															placeholder="Seleccione un centro de costo"
															value={field.value}
															onChange={(value) => field.onChange(value)}
															options={costCenterOptions ?? []}
															labelClassName={labelClassName}
															valueClassName={labelClassName}
															className={`${dropdownClassName} `}
															error={errors.cost_center_id?.message}
														/>
													)}
												/> :
												<InputText
													readOnly
													value={"Aquí va el centro de costo"}
													label="Centro de costo"
													className={`${inputClassName} cursor-not-allowed`}
													labelClassName={labelClassName}
													disabled

												/>
										}

									</div>

									{isRequisition && (
										<div className="min-w-0 w-full">
											<Controller
												name="priority_level_id"
												control={control}
												rules={{
													required: isRequisition ? "El nivel de prioridad es requerida" : false,
												}}
												render={({ field }) => (
													<Dropdown
														label="Nivel de prioridad"
														isRequired
														appearance="dark"
														placeholder="Seleccione la prioridad de la solicitud"
														value={field.value}
														onChange={(value) => { field.onChange(value) }}
														options={PriorityLevelOptions ?? []}
														labelClassName={labelClassName}
														valueClassName={labelClassName}
														className={`${dropdownClassName} `}
														error={errors.priority_level_id?.message}
													/>
												)}
											/>
										</div>
									)}

									<div
										className={
											isEventual || !isAdministrator
												? "flex min-w-0 w-full flex-col gap-3 md:col-span-2"
												: "flex min-w-0 w-full flex-col gap-3"
										}
									>
										<span className="text-[15px] text-black dark:text-white">
											Asociar a:
										</span>

										<div
											className={
												isEventual
													? "flex min-w-0 w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
													: "flex min-h-12 min-w-0 w-full flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-3"
											}
										>
											<div className="flex min-w-0 flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-3">
												<RadioButton
													id="suppliesRadiusButton"
													value={PurchaseRequestDestinationEnum.Internal.textValue}
													label="Insumos"
													labelPosition="right"
													labelClassName={labelClassName}
													checked={selectedOrigen === "Internal"}
													onChange={() => { handleOriginChange("Internal") }}
												/>

												<RadioButton
													id="serviceOrderRadiusButton"
													value={PurchaseRequestDestinationEnum.ServiceOrder.textValue}
													label="Orden de Servicio"
													labelPosition="right"
													labelClassName={labelClassName}
													checked={selectedOrigen === "ServiceOrder"}
													onChange={() => { handleOriginChange("ServiceOrder") }}
												/>
											</div>

											{isEventual && selectedOrigen === "ServiceOrder" && (
												<div className="flex min-w-0 w-full flex-col gap-2 sm:w-auto sm:flex-1 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
													<span className="text-[14px] font-medium text-black dark:text-white">
														Orden de Servicio Vinculada:
													</span>
													{selectedServiceOrder ? (
														<Chips
															key={selectedServiceOrder.service_order_id}
															label={selectedServiceOrder.code}
															onClose={() => setSelectedServiceOrder(null)}
														/>
													) : (
														<Button
															type="button"
															size="medium"
															icon={<PlusIcon size={16} />}
															label="Asignar orden de servicio"
															className="w-full! sm:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
															onClick={() => setIsSelectServiceOrderModalOpen(true)}
														/>
													)}
												</div>
											)}
										</div>
									</div>
								</div>

								{selectedOrigen === "ServiceOrder" && !isEventual && (
									<div className="flex flex-wrap items-center gap-3">

										<div className="flex flex-row flex-wrap items-center gap-2">
											<span className="text-[14px] font-medium text-black dark:text-white">
												Orden de Servicio Vinculada:
											</span>
											{selectedServiceOrder && (
												<Chips
													key={selectedServiceOrder?.service_order_id}
													label={selectedServiceOrder?.code}
													onClose={() => setSelectedServiceOrder(null)}
												/>
											)}
										</div>

										{!selectedServiceOrder && (
											<Button
												type="button"
												size="medium"
												icon={<PlusIcon size={16} />}
												label="Asignar orden de servicio"
												className="text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
												onClick={() => setIsSelectServiceOrderModalOpen(true)}
											/>
										)}

									</div>
								)}

								<Controller
									name="observations"
									control={control}
									rules={{
										required: "Las observaciones son requerida",
										validate: (value) =>
											value.trim().length > 0 || "Las observaciones son requerida",
									}}
									render={({ field }) => (
										<Textarea
											label="Contexto"
											placeholder="Ej. Solicitud de material de oficina para reposición en el área de finanzas."
											isRequired
											className={inputClassName}
											labelClassName={labelClassName}
											value={field.value}
											onChange={field.onChange}
											error={errors.observations?.message}
											maxLength={500}
											enableCharacterCount
											style={{
												resize: "none",
												minHeight: "100px",
											}}
										/>
									)}
								/>

								<PurchaseRequestDetail
									disableActions={isDisabledActions}
									onRequestError={onRequestError}
									onRequestSuccess={onRequestSuccess}
								/>
							</div>
						</div>

						<SelectServiceOrderModal
							selectionType="single"
							isOpen={isSelectServiceOrderModalOpen}
							onClose={() => setIsSelectServiceOrderModalOpen(false)}
							onSelect={(serviceOrders) => {

								const existingCodes = selectedServiceOrder?.code ? new Set([selectedServiceOrder?.code]) : new Set();

								const newOrder = serviceOrders.find(item => !existingCodes.has(item.code));

								setSelectedServiceOrder(newOrder ?? null);
							}}
						/>

						<div className="-mx-4 -mb-4 mt-0 shrink-0 border-t border-t-slate-300 bg-white px-4 py-4 dark:border-t-neutral-600 dark:bg-[#272b34] sm:-mx-6 sm:-mb-6 sm:px-6 rounded-b-xl">
							<div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
								<Button
									type="button"
									size="giant"
									label="Cancelar"
									onClick={handleClose}
									disabled={isCreating}
									className="text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
								/>
								<Button
									type="submit"
									size="giant"
									label="Crear Solicitud"
									disabled={isCreating}
									isLoading={isCreating}
									className="text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
								/>
							</div>
						</div>
					</form>
				</FormProvider>
			</Modal>
		</>
	);
};
