import { useEffect, useMemo, useRef } from "react";
import { Button, Dropdown, Modal, Textarea } from "@alpac/design-system";
import { Controller, FormProvider, useForm } from "react-hook-form";
import dayjs from "dayjs";
import type {
	CreatePurchaseRequestFormValues,
	PurchaseRequestModalProps,
} from "./purchase-request-modal.types";
import { PurchaseRequestDetail } from "../purchase-request-detail/purchase-request-detail";
import type { CreatePurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/create-purchase-request-payload";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { usePurchase } from "@app/modules/purchasing/ui/hooks/purchase/usePurchase";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { useAreas } from "@app/modules/admin/ui/hooks/areas/useAreas";
import { RoleEnum } from "@app/core/enums/role.enum";
import { Loader } from "@app/shared/components/loaders/loader";

const inputClassName =
	"w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const dropdownClassName =
	"w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";
const labelClassName = "text-black! dark:text-white!";

const emptyFormValues = (): CreatePurchaseRequestFormValues => ({
	area_id: "",
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
	const methods = useForm<CreatePurchaseRequestFormValues>({
		defaultValues: emptyFormValues(),
		mode: "onSubmit",
	});

	const isAdministrator = role === RoleEnum.ADMINISTRATOR;

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = methods;

	const { GetAreasByCompany } = useAreas({ company_id: companyId });
	const { CreatePurchaseRequest } = usePurchase();

	const areaOptions = useMemo(
		() =>
			(GetAreasByCompany.data ?? []).map((area) => ({
				label: area.work_area_name,
				value: area.work_area_id,
			})),
		[GetAreasByCompany.data],
	);

	const scrollContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		reset(emptyFormValues());
	}, [isOpen, reset]);

	const isCreating = CreatePurchaseRequest.isPending;

	const handleClose = () => {
		if (isCreating) return;
		reset(emptyFormValues());
		onClose();
	};

	const handleFormSubmit = handleSubmit((values) => {
		if (!currentBranchId) return;

		const payload: CreatePurchaseRequestPayload = {
			company_id: companyId,
			module_code: moduleCode,
			...(isAdministrator ? { area_id: values.area_id } : {}),
			branch_id: currentBranchId,
			request_date: dayjs().format("YYYY-MM-DD"),
			request_type: Number(requestType.value),
			observations: values.observations.trim(),						
			purchase_request_items: values.purchase_request_items.map((item) => {
				const productJustification = item.justification?.trim() ?? "";

				return {
					product_id: item.product_id,
					quantity: Number(item.quantity),
					description: item.description,
					unit_measure_id: item.unit_measure_id,
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
				size="9xl"
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
						<div ref={scrollContainerRef} className="scrollbar-dashboard min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
							<div className="flex flex-col gap-4 pb-2">

								{
									isAdministrator &&
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
												placeholder="Todas las áreas"
												value={field.value}
												onChange={(value) => field.onChange(value)}
												options={areaOptions}
												labelClassName={labelClassName}
												valueClassName={labelClassName}
												className={dropdownClassName}
												error={errors.area_id?.message}
											/>
										)}
									/>
								}

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
											label="Observaciones"
											placeholder="Observaciones de la solicitud..."
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

								<PurchaseRequestDetail />
							</div>
						</div>

						<div className="-mx-4 -mb-4 mt-0 shrink-0 border-t border-t-slate-300 bg-white px-4 py-4 dark:border-t-neutral-600 dark:bg-[#272b34] sm:-mx-6 sm:-mb-6 sm:px-6 rounded-b-xl">
							<div className="flex justify-end gap-3">
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
