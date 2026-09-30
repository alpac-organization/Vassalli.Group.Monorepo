import { warehouseHttpHandler } from "@app/core/adapters/axiosAdapter";
import { PurchaseServices } from "@app/modules/purchasing/infrastructure/services/purchase/PurchaseServices";
import { SupplierServices } from "@app/modules/purchasing/infrastructure/services/supplier/SupplierServices";
import type { GetPurchaseOrderDetailsResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-order-details-response";
import type { PurchaseRequestProductInformation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { buildPurchaseOrderPdfViewModels } from "@app/modules/purchasing/ui/pages/purchase-order/components/reports/purchase-order-pdf/utils/purchase-order-pdf.utils";
import type { FetchPurchaseOrderPdfParams } from "@app/modules/purchasing/ui/pages/purchase-order/components/reports/purchase-order-pdf/types/purchase-order-pdf.types";

const purchaseServices = new PurchaseServices(warehouseHttpHandler);
const supplierServices = new SupplierServices(warehouseHttpHandler);

async function openPdfBlob(blob: Blob): Promise<void> {
	const url = URL.createObjectURL(blob);
	window.open(url, "_blank", "noopener,noreferrer");
}

async function renderPurchaseOrderPdfBlob(
	detail: GetPurchaseOrderDetailsResponse,
	products: PurchaseRequestProductInformation[],
	companyId: string,
	moduleCode: string
): Promise<Blob> {
	const companyLogoUrl = useCompanyStore.getState().urlImage;
	const viewModels = await buildPurchaseOrderPdfViewModels({
		detail,
		products,
		companyLogoUrl,
		companyId,
		moduleCode,
		supplierServices,
	});

	const [{ pdf }, { PurchaseOrderPdfDocument }] = await Promise.all([
		import("@react-pdf/renderer"),
		import(
			"@app/modules/purchasing/ui/pages/purchase-order/components/reports/purchase-order-pdf/purchase-order-pdf-document"
		),
	]);

	return pdf(<PurchaseOrderPdfDocument viewModels={viewModels} />).toBlob();
}

/**
 * Carga detalle + productos (en paralelo cuando hay purchaseRequestId)
 * y abre el PDF de orden de compra (uno por cada proveedor adjudicado).
 */
export async function fetchAndOpenPurchaseOrderPdf(
	params: FetchPurchaseOrderPdfParams,
): Promise<void> {
	const { companyId, moduleCode, purchaseOrderId, purchaseRequestId } = params;

	if (!companyId.trim() || !moduleCode.trim() || !purchaseOrderId.trim()) {
		throw new Error("Faltan datos para generar la orden de compra.");
	}

	const detailsPromise = purchaseServices.GetPurchaseOrderDetails({
		company_id: companyId,
		module_code: moduleCode,
		purchase_order_id: purchaseOrderId,
	});

	let detail: GetPurchaseOrderDetailsResponse;
	let products: PurchaseRequestProductInformation[];

	if (purchaseRequestId?.trim()) {
		const [detailsResult, productsResponse] = await Promise.all([
			detailsPromise,
			purchaseServices.GetPurchaseRequestProducts({
				company_id: companyId,
				module_code: moduleCode,
				purchase_request_id: purchaseRequestId,
			}),
		]);
		detail = detailsResult;
		products = productsResponse.data ?? [];
	} else {
		detail = await detailsPromise;
		const resolvedRequestId =
			detail.purchase_request?.purchase_request_id ||
			detail.purchase_request_details?.purchase_request_id;

		if (!resolvedRequestId) {
			throw new Error("No se encontró la solicitud de compra asociada.");
		}

		const productsResponse = await purchaseServices.GetPurchaseRequestProducts({
			company_id: companyId,
			module_code: moduleCode,
			purchase_request_id: resolvedRequestId,
		});
		products = productsResponse.data ?? [];
	}

	const blob = await renderPurchaseOrderPdfBlob(detail, products, companyId, moduleCode);
	await openPdfBlob(blob);
}
