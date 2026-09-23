import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Modal } from "@alpac/design-system";
import { PlusIcon } from "lucide-react";
import type { PurchaseRequestEntry, PurchaseRequestModalProps } from "@app/modules/purchasing/ui/pages/purchase-requests/components/purchase-request-modal/purchase-request-modal.types";
import type {
	CreatePurchaseRequestPayload,
	PurchaseRequestItem,
	PurchaseRequestItemAdditionalData,
	PurchaseRequestMainPayload,
} from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/create-purchase-request-payload";
import type { UpdatePurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/update-purchase-request-payload";
import type {
	GetPurchaseRequestDetailResponse,
	PurchaseRequestProductInformationList,
	PurchaseRequestUnitMeasureInformation,
} from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { usePurchase } from "@app/modules/purchasing/ui/hooks/purchase/usePurchase";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { RoleEnum } from "@app/core/enums/role.enum";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { Loader } from "@app/shared/components/loaders/loader";
import { PurchaseRequestDestinationEnum } from "@app/modules/purchasing/domain/enums/purchase-request-destination.enum";
import { PriorityLevelEnum } from "@app/modules/purchasing/domain/enums/purchase-request-priority-level.enum";
import { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import { PurchaseRequestFormBlock } from "../purchase-request-form-block/purchase-request-form-block";
import type { PurchaseRequestFormBlockHandle } from "../purchase-request-form-block/purchase-request-form-block.types";
import { useUnitOfMeasurement } from "@app/modules/unit-of-measurement/hooks/useUnitOfMeasurement";
import { toDataUrl } from "@app/shared/utils/toDataUrl";
import { extractPurchaseRequestItemImages } from "@app/modules/purchasing/ui/pages/purchase-requests/utils/purchase-request-item-images.utils";

const emptyFormValues = (): CreatePurchaseRequestPayload => ({
	branch_id: "",
	cost_center_id: "",
	request_type: 0,
	priority_level: 0,
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

const enumValueFromText = <T extends { textValue: string; value: number }>(
	options: T[],
	textValue: string | undefined | null,
	fallback = 0,
): number =>
	options.find((option) => option.textValue === textValue)?.value ?? fallback;

const normalizeUnitKey = (value: string | null | undefined): string =>
	value?.trim().toLowerCase() ?? "";

type UnitMeasureLookup = {
	byCode: Map<string, string>;
	bySymbol: Map<string, string>;
};

const buildUnitMeasureLookup = (
	units: { unit_measure_id: string; code: string; symbol: string }[],
): UnitMeasureLookup => {
	const byCode = new Map<string, string>();
	const bySymbol = new Map<string, string>();

	for (const unit of units) {
		const codeKey = normalizeUnitKey(unit.code);
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

export const PurchaseRequestModal = ({
	isOpen,
	onClose,
	onSubmit,
	currentBranchId,
	requestType,
	onRequestError,
	onRequestSuccess,
	purchaseRequest = null,
}: PurchaseRequestModalProps) => {

	const { companyId, moduleCode, role, areaId, costCenterId } = useUserStore();

	const { getMappedError } = useMappedError();
	const isAdministrator = role === RoleEnum.ADMINISTRATOR;
	const isRequisition = requestType.textValue === PurchaseRequestEnum.Requisition.textValue;
	const isEditMode = Boolean(purchaseRequest?.purchase_request_id);
	const purchaseRequestId = purchaseRequest?.purchase_request_id ?? "";

	const [entries, setEntries] = useState<PurchaseRequestEntry[]>([]);
	const [editDefaultsReady, setEditDefaultsReady] = useState(false);
	const blockRefs = useRef<Map<string, PurchaseRequestFormBlockHandle>>(new Map());
	const lastBlockRef = useRef<HTMLDivElement>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const defaultData: PurchaseRequestEntry = {
		id: crypto.randomUUID(),
		defaults: {
			branch_id: "",
			cost_center_id: costCenterId,
			destination: -1,
			observations: "",
			request_type: -1,
			priority_level: -1,
			purchase_request_items: [],
		},
	};

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

	const unitsOfMeasurement = useMemo(() => {
		const data = GetUnitMeasurements.data;
		return Array.isArray(data) ? data : [];
	}, [GetUnitMeasurements.data]);

	const details = GetPurchaseRequestDetails.data as
		| GetPurchaseRequestDetailResponse
		| undefined;

	const productsResponse = GetPurchaseRequestProducts.data as
		| PurchaseRequestProductInformationList
		| undefined;

	const isLoadingEditData =
		isEditMode &&
		isOpen &&
		(GetPurchaseRequestDetails.isPending ||
			GetPurchaseRequestDetails.isFetching ||
			GetPurchaseRequestProducts.isPending ||
			GetPurchaseRequestProducts.isFetching ||
			GetUnitMeasurements.isPending ||
			GetUnitMeasurements.isFetching);

	const isSubmitting =
		CreatePurchaseRequest.isPending || UpdatePurchaseRequest.isPending;

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
		if (!isOpen || !isEditMode || isLoadingEditData || editDefaultsReady) return;
		if (!details || !productsResponse) return;

		const products = productsResponse.data ?? [];
		const unitMeasureLookup = buildUnitMeasureLookup(unitsOfMeasurement);

		const editDefaults: CreatePurchaseRequestPayload = {
			branch_id: currentBranchId,
			cost_center_id: costCenterId,
			request_type: Number(requestType.value),
			priority_level: enumValueFromText(
				Object.values(PriorityLevelEnum),
				details.priority_level,
			),
			destination: enumValueFromText(
				Object.values(PurchaseRequestDestinationEnum),
				details.destination,
			),
			observations: details.observations?.trim() ?? "",
			purchase_request_items: products.map((product) => {
				const storedImages = extractPurchaseRequestItemImages(
					product.additional_data,
				);
				const imageDataUrls = storedImages
					.map((image) => toDataUrl(image.image_base64, image.content_type))
					.filter((src): src is string => Boolean(src));

				return {
					purchase_request_item_id: product.purchase_request_item_id,
					product_id: product.product_details.product_id,
					product_name: product.product_details.product_name,
					quantity: product.quantity,
					quantity_unit: product.quantity_unit ?? 0,
					unit_measure_id: resolveUnitMeasureId(
						product.unit_measure_information,
						unitMeasureLookup,
					),
					description: product.description ?? "",
					justification: product.justification ?? "",
					images: {
						images_product_to_changed: imageDataUrls,
					},
				};
			}),
		};

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
		requestType.value,
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

	const buildCreatePayload = (values: CreatePurchaseRequestPayload): CreatePurchaseRequestPayload => ({
		...(isAdministrator && areaId ? { area_id: areaId } : {}),
		branch_id: currentBranchId,
		cost_center_id: costCenterId,
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
		}),
	});

	const buildUpdatePayload = (values: CreatePurchaseRequestPayload): UpdatePurchaseRequestPayload => {
		const productImagesPayload = values.purchase_request_items
			.filter((item): item is PurchaseRequestItem & { purchase_request_item_id: string } =>
				Boolean(item.purchase_request_item_id?.trim()),
			)
			.map((item) => {
				const productJustification = item.justification?.trim() ?? "";
				const productImages = item.images?.images_product_to_changed ?? [];
				const imagesWereTouched = Boolean(item.images?.isDirty);

				return {
					id: item.purchase_request_item_id,
					product_id: item.product_id,
					quantity: Number(item.quantity),
					description: item.description,
					unit_measure_id: item.unit_measure_id,
					...(productJustification ? { justification: productJustification } : {}),
					...(item.quantity_unit != null && Number(item.quantity_unit) > 0
						? { quantity_unit: Number(item.quantity_unit) }
						: {}),
					...(imagesWereTouched
						? { images_product_to_changed: productImages }
						: {}),
				};
			});

		return {
			company_id: companyId,
			module_code: moduleCode,
			purchase_request_id: purchaseRequestId,
			observations: values.observations.trim(),
			destination_request: Number(values.destination),
			...(isRequisition
				? { priority_level: Number(values.priority_level) }
				: { priority_level: PriorityLevelEnum.None.value }),
			purchase_request_items: productImagesPayload,
		};
	};

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

		if (valuesList.length === 0) return;

		try {
			if (isEditMode) {
				await UpdatePurchaseRequest.mutateAsync(buildUpdatePayload(valuesList[0]));
				onRequestSuccess?.("Solicitud de compra actualizada con éxito.");
			} else {
				const mainPayload: PurchaseRequestMainPayload = {
					company_id: companyId,
					module_code: moduleCode,
					purchase_requests: valuesList.map((values) => buildCreatePayload(values)),
				};

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
		} catch (error) {
			const mappedError = getMappedError(error as ApiErrorResponse);
			onRequestError?.(mappedError.description);
		}
	};

	const modalTitle = isEditMode
		? `Actualizar ${requestType.label}`
		: `Registrar ${requestType.label}`;

	const modalDescription = isEditMode
		? "Modifique la información de la solicitud de compra"
		: "Complete la información de la solicitud de compra";

	const showForm = !isEditMode || (editDefaultsReady && !isLoadingEditData);

	return (
		<>
			{isOpen && isLoadingEditData && (
				<Loader title="Cargando solicitud..." />
			)}
			{isOpen && isSubmitting && (
				<Loader
					title={isEditMode ? "Actualizando solicitud..." : "Creando solicitud..."}
				/>
			)}

			<Modal
				isOpen={isOpen}
				onClose={handleClose}
				title={modalTitle}
				variant="default"
				size="8xl"
				description={modalDescription}
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

					{!isEditMode && (
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
					)}

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
