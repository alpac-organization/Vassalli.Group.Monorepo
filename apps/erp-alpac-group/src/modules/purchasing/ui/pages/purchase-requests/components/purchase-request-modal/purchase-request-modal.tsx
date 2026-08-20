import { useEffect, useRef, useState } from "react";
import { Button, Modal } from "@alpac/design-system";
import { PlusIcon } from "lucide-react";
import type { PurchaseRequestEntry, PurchaseRequestModalProps } from "./purchase-request-modal.types";
import type {
	CreatePurchaseRequestPayload,
	PurchaseRequestItem,
	PurchaseRequestItemAdditionalData,
	PurchaseRequestMainPayload,
} from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/create-purchase-request-payload";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { usePurchase } from "@app/modules/purchasing/ui/hooks/purchase/usePurchase";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { RoleEnum } from "@app/core/enums/role.enum";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { Loader } from "@app/shared/components/loaders/loader";
import { PurchaseRequestDestinationEnum } from "@app/modules/purchasing/domain/enums/purchase-request-destination.enum";
import { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import { PurchaseRequestFormBlock } from "../purchase-request-form-block/purchase-request-form-block";
import type { PurchaseRequestFormBlockHandle } from "../purchase-request-form-block/purchase-request-form-block.types";

const emptyFormValues = (): CreatePurchaseRequestPayload => ({
	area_id: "",
	branch_id: "",
	request_type: 0,
	priority_level: undefined,
	destination: PurchaseRequestDestinationEnum.Internal.value,
	observations: "",
	purchase_request_items: [],
});

const createEntry = (defaults: CreatePurchaseRequestPayload = emptyFormValues()): PurchaseRequestEntry => ({
	id: crypto.randomUUID(),
	defaults: {
		...defaults,
		purchase_request_items: defaults.purchase_request_items.map((item) => ({
			...item,
			images: item.images
				? {
					images_product_to_changed: [
						...(item.images.images_product_to_changed ?? []),
					],
				}
				: undefined,
		})),
	},
});

export const PurchaseRequestModal = ({
	isOpen,
	onClose,
	onSubmit,
	currentBranchId,
	requestType,
	onRequestError,
	onRequestSuccess,
}: PurchaseRequestModalProps) => {

	const { companyId, moduleCode, role, } = useUserStore();

	const { getMappedError } = useMappedError();
	const isAdministrator = role === RoleEnum.ADMINISTRATOR;
	const isRequisition = requestType.textValue === PurchaseRequestEnum.Requisition.textValue;

	const [entries, setEntries] = useState<PurchaseRequestEntry[]>([]);
	const blockRefs = useRef<Map<string, PurchaseRequestFormBlockHandle>>(new Map());
	const lastBlockRef = useRef<HTMLDivElement>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const defaultData: PurchaseRequestEntry = {
		id: crypto.randomUUID(),
		defaults: {
			branch_id: "",
			destination: -1,
			observations: "",
			request_type: -1,
			priority_level: -1,
			purchase_request_items: []
		}
	}


	const { CreatePurchaseRequest } = usePurchase();

	useEffect(() => {
		setEntries([defaultData]);
		blockRefs.current.clear();
	}, [isOpen]);

	const isCreating = CreatePurchaseRequest.isPending;

	const handleClose = () => {
		if (isCreating) return;
		setEntries([]);
		blockRefs.current.clear();
		onClose();
	};

	const handleCreate = () => {
		setEntries((prev) => [...prev, createEntry()]);
	};

	useEffect(() => {
		const container = scrollContainerRef.current;
		const block = lastBlockRef.current;

		if (!container || !block) return;

		const top = block.offsetTop - container.offsetTop;

		container.scrollTo({ top, behavior: "smooth" });
	}, [entries.length]);

	const handleDuplicate = (purchaseRequestPayload: CreatePurchaseRequestPayload) => {
		setEntries((prev) => [...prev, createEntry(purchaseRequestPayload)]);
	};

	const handleRemove = (id: string) => {
		blockRefs.current.delete(id);
		setEntries((prev) => prev.filter((entry) => entry.id !== id));
	};

	const buildPayload = (values: CreatePurchaseRequestPayload): CreatePurchaseRequestPayload => {

		return ({
			...(isAdministrator ? { area_id: values.area_id } : {}),
			branch_id: currentBranchId,
			request_type: Number(requestType.value),
			...(isRequisition ? { priority_level: Number(values.priority_level) } : {}),
			...(values.service_order_id && { service_order_id: values.service_order_id }),
			destination: values.destination,
			observations: values.observations.trim(),
			purchase_request_items: values.purchase_request_items.map((item: PurchaseRequestItem) => {
				const productJustification = item.justification?.trim() ?? "";
				const productImages = item.images?.images_product_to_changed ?? [];
				const additionalData: PurchaseRequestItemAdditionalData | null = productImages.length
					? { images_product_to_changed: productImages }
					: null;

				return {
					product_id: item.product_id,
					quantity: Number(item.quantity),
					description: item.description,
					unit_measure_id: item.unit_measure_id,
					additional_data: additionalData ? JSON.stringify(additionalData) : null,
					...(productJustification ? { justification: productJustification } : {}),
					...(item.quantity_unit != null && Number(item.quantity_unit) > 0
						? { quantity_unit: Number(item.quantity_unit) }
						: {}),
				};
			})
		})
	}

	const handleFormSubmit = async () => {

		if (!currentBranchId || entries.length === 0) return;

		const valuesList: CreatePurchaseRequestPayload[] = [];

		for (const entry of entries) {
			const block = blockRefs.current.get(entry.id);
			if (!block) continue;

			const isValid = await block.validate();
			if (!isValid) return;

			valuesList.push(block.getValues());
		}

		try {
			const mainPayload: PurchaseRequestMainPayload = {
				company_id: companyId,
				module_code: moduleCode,
				purchase_requests: valuesList.map((values) => buildPayload(values)),
			};

			await CreatePurchaseRequest.mutateAsync(mainPayload);

			onRequestSuccess?.(
				valuesList.length === 1
					? "Solicitud de compra creada con éxito."
					: `${valuesList.length} solicitudes de compra creadas con éxito.`,
			);
			setEntries([]);
			blockRefs.current.clear();
			onSubmit?.();
			onClose();

			console.log("valuesList: ", valuesList);
		} catch (error) {
			const mappedError = getMappedError(error as ApiErrorResponse);
			onRequestError?.(mappedError.description);
		}
	};

	return (
		<>
			{isOpen && isCreating && <Loader title="Creando solicitud..." />}

			<Modal
				isOpen={isOpen}
				onClose={handleClose}
				title={`Registrar ${requestType.label}`}
				variant="default"
				size="8xl"
				description="Complete la información de la solicitud de compra"
				panelClassName="flex h-[54rem] w-[min(calc(100vw-1rem),56rem)] min-w-0 flex-col"
				contentClassName="flex min-h-0 flex-1 flex-col"
			>
				<form
					onSubmit={(evt) => {
						evt.preventDefault();
						handleFormSubmit();
					}}
					className="flex min-h-0 flex-1 flex-col"
					noValidate
				>
					<div
						ref={scrollContainerRef}
						className="p-1 scrollbar-dashboard min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">

						<div className="flex flex-col gap-4 pb-2">

							{entries.length === 0 ? (
								<p className="m-0 text-[15px] text-slate-500 dark:text-slate-400">
									Aún no hay registros. Use “Crear {requestType?.label}” para
									agregar el primero.
								</p>
							) : (
								entries.map((entry, index) => (
									<div
										key={entry.id}
										ref={index === entries.length - 1 ? lastBlockRef : undefined}
									>
										<PurchaseRequestFormBlock
											key={entry.id}
											index={index}
											defaults={entry.defaults}
											role={role as RoleEnum}
											requestType={requestType}
											onDuplicate={handleDuplicate}
											onRemove={() => handleRemove(entry.id)}
											onRequestError={onRequestError}
											onRequestSuccess={onRequestSuccess}
											ref={(instance) => {
												if (instance) {
													blockRefs.current.set(entry.id, instance);
												} else {
													blockRefs.current.delete(entry.id);
												}
											}}
										/>
									</div>
								))
							)}
						</div>
					</div>

					<div className="sticky top-0 right-0 z-10 bg-white dark:bg-[#272b34] py-4">
						<Button
							type="button"
							size="medium"
							icon={<PlusIcon size={16} />}
							label={`Crear ${requestType.label}`}
							onClick={handleCreate}
							className="text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
						/>
					</div>

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
								disabled={isCreating || entries.length === 0}
								isLoading={isCreating}
								className="text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
							/>
						</div>
					</div>
				</form>
			</Modal>
		</>
	);
};
