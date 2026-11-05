import { useEffect, useMemo, useRef, useState, type SubmitEvent } from "react";
import { Button, Modal } from "@alpac/design-system";
import { PlusIcon } from "lucide-react";
import type { PurchaseRequestEntry, PurchaseRequestModalProps } from "@app/modules/purchasing/ui/pages/purchase-requests/components/purchase-request-modal/purchase-request-modal.types";
import type {
	CreatePurchaseRequestPayload,
	PurchaseRequestItem,
	PurchaseRequestMainPayload,
} from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/create-purchase-request-payload";
import type {
	UpdateExistingPurchaseRequestItem,
	UpdateNewPurchaseRequestItem,
	UpdatePurchaseRequestPayload,
} from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/update-purchase-request-payload";
import type {
	GetPurchaseRequestDetailResponse,
	PurchaseRequestProductInformationList,
	PurchaseRequestUnitMeasureInformation,
} from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { usePurchase } from "@app/modules/purchasing/ui/hooks/purchase/usePurchase";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { RoleEnum } from "@app/core/enums/role.enum";
import { Loader } from "@app/shared/components/loaders/loader";
import { PurchaseRequestDestinationEnum } from "@app/modules/purchasing/domain/enums/purchase-request-destination.enum";
import { PriorityLevelEnum } from "@app/modules/purchasing/domain/enums/purchase-request-priority-level.enum";
import { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import { PurchaseRequestFormBlock } from "../purchase-request-form-block/purchase-request-form-block";
import { useUnitOfMeasurement } from "@app/modules/unit-of-measurement/hooks/useUnitOfMeasurement";
import { toDataUrl } from "@app/shared/utils/toDataUrl";
import { extractPurchaseRequestItemImages } from "@app/modules/purchasing/ui/pages/purchase-requests/utils/purchase-request-item-images.utils";

import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { PurchaseRequestFormBlockHandle } from "../purchase-request-form-block/purchase-request-form-block.types";

const emptyFormValues = (): CreatePurchaseRequestPayload => ({
	request_type: PurchaseRequestEnum.Requisition.textValue,
	priority_level: PriorityLevelEnum.None.textValue,
	destination: PurchaseRequestDestinationEnum.Internal.textValue,
	observations: "",
	purchase_request_items: [],
});

const createEntry = (defaults: CreatePurchaseRequestPayload = emptyFormValues()): PurchaseRequestEntry => ({
	id: crypto.randomUUID(),
	defaults: {
		...defaults,
		purchase_request_items: defaults.purchase_request_items.map((item) => ({
			...item,
			images: item.additional_data
				? {
					images_product_to_changed: [
						...(item.images.images_product_to_changed ?? []),
					],
				}
				: undefined,
		})),
	},
});

const normalizeUnitKey = (value: string | null | undefined): string =>
	value?.trim().toLowerCase() ?? "";

type UnitMeasureLookup = {
	byCode: Map<string, string>;
	bySymbol: Map<string, string>;
};

//Funcion constructora.
const buildUnitMeasureLookup = (units: { unit_measure_id: string; code: string; symbol: string }[] ): UnitMeasureLookup => {
	const byCode 	= new Map<string, string>();
	const bySymbol 	= new Map<string, string>();

	for (const unit of units) {
		const codeKey 	= normalizeUnitKey(unit.code);
		const symbolKey = normalizeUnitKey(unit.symbol);

		if (codeKey && !byCode.has(codeKey)) {
			byCode.set(codeKey, unit.unit_measure_id);
		}

		if (symbolKey && !bySymbol.has(symbolKey)) {
			bySymbol.set(symbolKey, unit.unit_measure_id);
		}
	}

	return { byCode, bySymbol };
};

const resolveUnitMeasureId = (
	info: PurchaseRequestUnitMeasureInformation,
	lookup: UnitMeasureLookup,
): string => {
	const codeKey = normalizeUnitKey(info.code);
	if (codeKey) {
		const byCode = lookup.byCode.get(codeKey);
		if (byCode) return byCode;
	}

	const symbolKey = normalizeUnitKey(info.symbol);
	if (symbolKey) {
		const bySymbol = lookup.bySymbol.get(symbolKey);
		if (bySymbol) return bySymbol;
	}

	return "";
};

const mapNewCreateItem = (item: PurchaseRequestItem): UpdateNewPurchaseRequestItem => {
	const productJustification = item.justification?.trim() ?? "";
	const productImages = item.additional_data?.images_product_to_changed ?? [];

	const additionalData = productImages.length
		? { images_product_to_changed: productImages }
		: null;

	return {
		product_id: item.product_id ?? "",
		quantity: Number(item.quantity),
		description: item.description ?? "",
		unit_measure_id: item.unit_measure_id ?? "",
		additional_data: additionalData ? JSON.stringify(additionalData) : null,
		...(productJustification ? { justification: productJustification } : {}),
		...(item.quantity_unit != null && Number(item.quantity_unit) > 0
			? { quantity_unit: Number(item.quantity_unit) }
			: {}),
	} as UpdateNewPurchaseRequestItem;
};

// Crear un item
const mapCreateItem = (item: PurchaseRequestItem): PurchaseRequestItem => {
	const mapped 		= mapNewCreateItem(item);
	const unitMeasureId = item.unit_measure_id?.trim();

	return {
		...mapped,

		unit_measure_id: unitMeasureId,
		additional_data: mapped.additional_data ?? null
	};
};

//Actualizar item existente
const mapExistingUpdateItem = (item: PurchaseRequestItem & { purchase_request_item_id: string }): UpdateExistingPurchaseRequestItem => {

	const productJustification = item.justification?.trim() ?? "";

	// Read images from additional_data (backend format: JSON string with images_product_to_changed)
	let imagesProductToChanged: string[] = [];
	if (item.additional_data) {
		try {
			const parsed = JSON.parse(item.additional_data);
			imagesProductToChanged = parsed.images_product_to_changed || [];
		} catch {
			// If JSON parsing fails, use empty array
		}
	}

	return {
		product_id: item.product_id ?? undefined,
		quantity: Number(item.quantity),
		description: item.description ?? undefined,
		unit_measure_id: item.unit_measure_id ?? undefined,
		images_product_to_changed: imagesProductToChanged,
		...(productJustification ? { justification: productJustification } : {}),
		...(item.quantity_unit != null && Number(item.quantity_unit) > 0
			? { quantity_unit: Number(item.quantity_unit) }
			: {}),
} as UpdateExistingPurchaseRequestItem;
};



export const PurchaseRequestModal = (props: PurchaseRequestModalProps) => {

	const {
		isOpen,
		onClose,
		onSubmit,
		currentBranchId,
		requestType,
		onRequestError,
		onRequestSuccess,
		purchaseRequest = null,
	} = props;

	const { getMappedError } = useMappedError();
	const { companyId, moduleCode, role, areaId, costCenterId } = useUserStore();

	const isAdministrator 	= role === RoleEnum.ADMINISTRATOR;
	const isRequisition 	= requestType.textValue === PurchaseRequestEnum.Requisition.textValue;
	
	const isEditMode 		= Boolean(purchaseRequest?.purchase_request_id);
	const purchaseRequestId = purchaseRequest?.purchase_request_id ?? "";

	const [entries, setEntries] = useState<PurchaseRequestEntry[]>([]);
	const [editDefaultsReady, setEditDefaultsReady] = useState(false);

	//#region Referencias

	const blockRefs 		 = useRef<Map<string, PurchaseRequestFormBlockHandle>>(new Map());
	const lastBlockRef 		 = useRef<HTMLDivElement>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	//#endregion

	const defaultData: PurchaseRequestEntry = {
		id: crypto.randomUUID(),
		defaults: {
			observations: "",
			destination: PurchaseRequestDestinationEnum.Internal.textValue,
			request_type: requestType.textValue,
			priority_level: PriorityLevelEnum.None.textValue,
			purchase_request_items: [],
		},
	};

	//#region services
	const {
		CreatePurchaseRequest,
		UpdatePurchaseRequest,
		GetPurchaseRequestDetails,
		GetPurchaseRequestProducts,
	} = usePurchase({
		getPurchaseRequestDetailsPayload: {
			company_id: companyId,
			module_code: moduleCode,
			purchase_request_id: isEditMode && isOpen ? purchaseRequestId : "",
		},
		getPurchaseRequestProductsPayload: {
			company_id: companyId,
			module_code: moduleCode,
			purchase_request_id: isEditMode && isOpen ? purchaseRequestId : "",
		},
	});

	const { GetUnitMeasurements } = useUnitOfMeasurement({
		payloadUnitOfMeasurement: {
			companie_id: companyId,
			module_code: moduleCode,
		},
	});
	//#endregion

	//#region Evaluar estados de submit y fetching 
	const details = GetPurchaseRequestDetails.data as
		| GetPurchaseRequestDetailResponse
		| undefined;
	
	const productsResponse = GetPurchaseRequestProducts.data as
		| PurchaseRequestProductInformationList
		| undefined;
		
		const isLoadingEditData =
		isEditMode &&
		isOpen &&
		(
			GetPurchaseRequestDetails.isPending   ||
			GetPurchaseRequestDetails.isFetching  ||
			GetPurchaseRequestProducts.isPending  ||
			GetPurchaseRequestProducts.isFetching ||
			GetUnitMeasurements.isPending 		  ||
			GetUnitMeasurements.isFetching
		);
		
	const isSubmitting =
		CreatePurchaseRequest.isPending || UpdatePurchaseRequest.isPending;

	//#endregion

	const unitsOfMeasurement = useMemo(() => {
		const data = GetUnitMeasurements.data;
		return Array.isArray(data) ? data : [];
	}, [GetUnitMeasurements.data]);
		
	useEffect(() => {
		if (!isOpen) {
			setEntries([]);
			blockRefs.current.clear();
			setEditDefaultsReady(false);
			return;
		}

		if (!isEditMode) {
			setEntries([defaultData]);
			blockRefs.current.clear();
			setEditDefaultsReady(true);
			return;
		}

		setEditDefaultsReady(false);
		setEntries([]);
		blockRefs.current.clear();
	}, [isOpen, isEditMode, purchaseRequestId]);

	useEffect(() => {
		if (!isOpen  || !isEditMode || isLoadingEditData || editDefaultsReady) return;
		if (!details || !productsResponse) return;
		
		//Productos 
		const products = productsResponse.data ?? [];

		const editDefaults: CreatePurchaseRequestPayload = {
			request_type: 			requestType.textValue,
			priority_level: 		details.priority_level ?? PriorityLevelEnum.None.textValue,
			destination:			details.destination    ?? PurchaseRequestDestinationEnum.Internal.textValue,
			observations: 			details.observations?.trim() ?? "",
			
			purchase_request_items: products.map((product) => {

				console.log(product);

				const storedImages = extractPurchaseRequestItemImages(
					product.additional_data,
				);

				console.log(JSON.stringify(storedImages, null, 3));

				return {
					product_name: 	 product.product_details?.product_name,
					product_id: 	 product.product_details?.product_id 			   ?? "",
					unit_measure_id: product.unit_measure_information?.unit_measure_id ?? "",

					quantity: 		 product.quantity,
					quantity_unit: 	 product.quantity_unit ?? 0,
					description: 	 product.description   ?? "",
					justification: 	 product.justification ?? "",

					// images: 
					// images: {
					// 	images_product_to_changed: imageDataUrls,
					// },
				};
			}),
		};

		// console.log(JSON.stringify(editDefaults, null, 3));

		setEntries([createEntry(editDefaults)]);
		setEditDefaultsReady(true);
	}, [
		isOpen,
		isEditMode,
		isLoadingEditData,
		editDefaultsReady,
		details,
		productsResponse,
		unitsOfMeasurement,
		currentBranchId,
		costCenterId,
		requestType.textValue,
	]);

	const handleClose = () => {
		if (isSubmitting) return;
		setEntries([]);
		blockRefs.current.clear();
		setEditDefaultsReady(false);
		onClose();
	};

	const handleCreate = () => {
		if (isEditMode) return;
		setEntries((prev) => [...prev, createEntry()]);
	};

	useEffect(() => {
		const container = scrollContainerRef.current;
		const block = lastBlockRef.current;

		if (!container || !block || isEditMode) return;

		const top = block.offsetTop - container.offsetTop;

		container.scrollTo({ top, behavior: "smooth" });
	}, [entries.length, isEditMode]);

	const handleDuplicate = (purchaseRequestPayload: CreatePurchaseRequestPayload) => {
		if (isEditMode) return;
		setEntries((prev) => [...prev, createEntry(purchaseRequestPayload)]);
	};

	const handleRemove = (id: string) => {
		if (isEditMode) return;
		blockRefs.current.delete(id);
		setEntries((prev) => prev.filter((entry) => entry.id !== id));
	};

	const buildCreatePayload = (values: CreatePurchaseRequestPayload): CreatePurchaseRequestPayload => {		
		return {
			...(isAdministrator && areaId ? { area_id: areaId } : {}),
			...(isRequisition ? { priority_level: values.priority_level } : {}),

			request_type: 			requestType.textValue,
			destination:			values.destination ?? PurchaseRequestDestinationEnum.Internal.textValue,
			observations: 			values.observations.trim(),
			purchase_request_items: values.purchase_request_items.map((item) =>
				mapCreateItem(item),
			),
		}
	};

	const buildUpdatePayload = (values: CreatePurchaseRequestPayload): UpdatePurchaseRequestPayload => {
		console.log("Called! \"build update payload\"");

		return {
			company_id: 			companyId,
			module_code: 			moduleCode,
			purchase_request_id: 	purchaseRequestId,
			observations: 			values.observations.trim(),
			destination_request: 	values.destination    ?? PurchaseRequestDestinationEnum.Internal.textValue,

			...(
				isRequisition
				? { priority_level: values.priority_level }
				: { priority_level: PriorityLevelEnum.None.textValue }
			),

			// purchase_request_items: values.purchase_request_items.map((item: PurchaseRequestItem): PurchaseRequestItem => ({
			// 	...item
			// })),	
		}
	}
	
	//#region Logica para lanzar actualización o creación
	const handleFormSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!currentBranchId || entries.length === 0) return;

		const valuesList: CreatePurchaseRequestPayload[] = [];

		for (const entry of entries) {
			const block = blockRefs.current.get(entry.id);
			if (!block) continue;

			const isValid = await block.validate();
			if (!isValid) return;

			valuesList.push(block.getValues());
		}

		if (valuesList.length === 0) return;

		try {
			if (isEditMode) {
				await UpdatePurchaseRequest.mutateAsync(buildUpdatePayload(valuesList[0]));

				//Notificar que se realizo la actualización.
				onRequestSuccess?.("Solicitud de compra actualizada con éxito.");
			}
			else {
				
				const mainPayload: PurchaseRequestMainPayload = {
					company_id: 	   companyId,
					module_code: 	   moduleCode,
					purchase_requests: valuesList.map((values) => buildCreatePayload(values)),
				};

				console.log(JSON.stringify(mainPayload, null, 2));

				return;

				//Lanzar el servicio que consume la creación de las solcitudes
				await CreatePurchaseRequest.mutateAsync(mainPayload);

				onRequestSuccess?.(
					valuesList.length === 1
						? "Solicitud de compra creada con éxito."
						: `${valuesList.length} solicitudes de compra creadas con éxito.`,
				);
			}

			setEntries([]);
			blockRefs.current.clear();
			setEditDefaultsReady(false);
			
			onSubmit?.();
			onClose();
		} 
		catch (error) {
			const mappedError = getMappedError(error as ApiErrorResponse);
			onRequestError?.(mappedError.description);
		}
	};
	//#endregion

	//#region casos de labels
	const modalTitle = isEditMode
		? `Actualizar ${requestType.label}`
		: `Registrar  ${requestType.label}`;

	const modalDescription = isEditMode
		? "Modifique la información de la solicitud de compra"
		: "Complete la información de la solicitud de compra";
	//#endregion

	const showForm = !isEditMode || (editDefaultsReady && !isLoadingEditData);

	return (
		<>
			{
				isOpen && isLoadingEditData && (
					<Loader title="Cargando solicitud..." />
				)
			}

			{
				isOpen && isSubmitting && (
					<Loader
						title={isEditMode ? "Actualizando solicitud..." : "Creando solicitud..."}
					/>
				)
			}

			<Modal
				isOpen={isOpen}
				onClose={handleClose}
				title={modalTitle}
				variant="default"
				size="8xl"
				description={modalDescription}
				panelClassName={[
					"flex max-h-[min(94dvh,54rem)] w-[min(calc(100vw-1rem),56rem)] min-w-0 flex-col overflow-hidden",
					"!mx-2 !my-2 sm:!mx-4 sm:!my-6",
					"rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
				].join(" ")}
				contentClassName="flex min-h-0 flex-1 flex-col"
			>
				<form
					onSubmit={handleFormSubmit}
					className="flex min-h-0 flex-1 flex-col"
					noValidate
				>
					<div
						ref={scrollContainerRef}
						className="p-1 scrollbar-dashboard min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain"
					>
						<div className="flex flex-col gap-4 pb-2">
							{!showForm ? (
								<p className="m-0 text-[15px] text-slate-500 dark:text-slate-400">
									Cargando datos de la solicitud...
								</p>
							) : entries.length === 0 ? (
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
										{index > 0 && (
											<div className="my-2 flex items-center gap-3" aria-hidden>
												<div className="h-px flex-1 bg-slate-300 dark:bg-neutral-600" />
												<span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
													{requestType.label} {index + 1}
												</span>
												<div className="h-px flex-1 bg-slate-300 dark:bg-neutral-600" />
											</div>
										)}

										<PurchaseRequestFormBlock
											key={entry.id}
											index={index}
											defaults={entry.defaults}
											requestType={requestType}
											isEditMode={isEditMode}
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

					{
						!isEditMode && (
							<div className="shrink-0 bg-white py-4 dark:bg-[#272b34]">
								<Button
									type="button"
									size="medium"
									icon={<PlusIcon size={16} />}
									label={`Crear ${requestType.label}`}
									onClick={handleCreate}
									className="text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
								/>
							</div>
						)
					}

					<div className="-mx-4 -mb-4 mt-0 shrink-0 border-t border-t-slate-300 bg-white px-4 py-4 dark:border-t-neutral-600 dark:bg-[#272b34] sm:-mx-6 sm:-mb-6 sm:px-6 rounded-b-xl">
						<div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
							<Button
								type="button"
								size="giant"
								label="Cancelar"
								onClick={handleClose}
								disabled={isSubmitting}
								className="text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
							/>
							<Button
								type="submit"
								size="giant"
								label={isEditMode ? "Actualizar Solicitud" : "Crear Solicitud"}
								disabled={isSubmitting || entries.length === 0 || !showForm}
								isLoading={isSubmitting}
								className="text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
							/>
						</div>
					</div>
				</form>
			</Modal>
		</>
	);
};
