import type {
	CreatePurchaseRequestApiPayload,
	CreatePurchaseRequestItemApi,
	CreatePurchaseRequestPayload,
	NewPurchaseRequestProduct,
	PurchaseRequestItem,
} from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/create-purchase-request-payload";
import { PriorityLevelEnum } from "@app/modules/purchasing/domain/enums/purchase-request-priority-level.enum";
import { PurchaseRequestDestinationEnum } from "@app/modules/purchasing/domain/enums/purchase-request-destination.enum";
import { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import type { PurchaseRequestType } from "@app/modules/purchasing/domain/enums/purchase-request.enum";

export type MapCreatePurchaseRequestContext = {
	branchId: string;
	costCenterId: string;
	requestType: PurchaseRequestType;
	isAdministrator: boolean;
	areaId?: string | null;
};

const serializeItemAdditionalData = (
	item: PurchaseRequestItem,
): string | null => {
	const images = item.images?.images_product_to_changed ?? [];
	if (images.length === 0) return null;
	return JSON.stringify({ images_product_to_changed: images });
};

const mapNewProduct = (
	newProduct: NewPurchaseRequestProduct,
): NewPurchaseRequestProduct => ({
	product_name: newProduct.product_name.trim(),
	description: newProduct.description?.trim() || null,
	category_id: newProduct.category_id,
	unit_measure_id: newProduct.unit_measure_id,
	product_usage_type: newProduct.product_usage_type,
	is_tax_exempt: Boolean(newProduct.is_tax_exempt),
	suppliers: newProduct.suppliers.map((supplier) => ({
		supplier_id: supplier.supplier_id,
		unit_price: Number(supplier.unit_price),
	})),
});

export const mapCreatePurchaseRequestItem = (
	item: PurchaseRequestItem,
): CreatePurchaseRequestItemApi => {
	const justification = item.justification?.trim() || null;
	const description = item.description?.trim() || null;
	const additionalData = serializeItemAdditionalData(item);
	const quantityUnit = Number(item.quantity_unit ?? 0);
	const unitMeasureId = item.unit_measure_id?.trim() || null;
	const additionalSupplierIds = item.additional_supplier_ids?.filter(Boolean);

	const base: CreatePurchaseRequestItemApi = {
		quantity: Number(item.quantity),
		quantity_unit: Number.isFinite(quantityUnit) ? quantityUnit : 0,
		unit_measure_id: unitMeasureId,
		description,
		...(justification ? { justification } : {}),
		...(additionalSupplierIds?.length
			? { additional_supplier_ids: additionalSupplierIds }
			: {}),
		...(additionalData ? { additional_data: additionalData } : {}),
	};

	if (item.new_product) {
		return {
			...base,
			new_product: mapNewProduct(item.new_product),
		};
	}

	const productId = item.product_id?.trim() || null;
	return {
		...base,
		product_id: productId,
	};
};

export const mapCreatePurchaseRequest = (
	values: CreatePurchaseRequestPayload,
	context: MapCreatePurchaseRequestContext,
): CreatePurchaseRequestApiPayload => {
	const isRequisition =
		context.requestType === PurchaseRequestEnum.Requisition.textValue;

	const observations = values.observations?.trim() || null;

	return {
		...(context.isAdministrator && context.areaId
			? { area_id: context.areaId }
			: {}),
		branch_id: context.branchId,
		cost_center_id: context.costCenterId,
		request_type: context.requestType,
		destination:
			values.destination ?? PurchaseRequestDestinationEnum.Internal.textValue,
		observations,
		priority_level: isRequisition
			? values.priority_level
			: PriorityLevelEnum.None.textValue,
		purchase_request_items: values.purchase_request_items.map(
			mapCreatePurchaseRequestItem,
		),
	};
};

export const hasProductOrNewProduct = (item: PurchaseRequestItem): boolean => {
	const hasExisting = Boolean(item.product_id?.trim());
	const hasNew = Boolean(item.new_product?.product_name?.trim());
	return hasExisting || hasNew;
};
