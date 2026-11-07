import { warehouseHttpHandler } from "@app/core/adapters/axiosAdapter";
import type { PurchaseRequestProductInformation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import { PurchaseServices } from "@app/modules/purchasing/infrastructure/services/purchase/PurchaseServices";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { mapPurchaseOrderReportToPdfViewModel } from "@app/modules/purchasing/ui/pages/purchase-order/components/reports/purchase-order-pdf/utils/map-purchase-order-report-to-pdf";
import type { FetchPurchaseOrderPdfParams } from "@app/modules/purchasing/ui/pages/purchase-order/components/reports/purchase-order-pdf/types/purchase-order-pdf.types";
import { fetchAllPurchaseRequestProducts } from "@app/modules/purchasing/ui/pages/purchase-order/utils/fetch-purchase-request-products";

const purchaseServices = new PurchaseServices(warehouseHttpHandler);

async function openPdfBlob(blob: Blob): Promise<void> {
	const url = URL.createObjectURL(blob);
	window.open(url, "_blank", "noopener,noreferrer");
}

export async function fetchAndOpenPurchaseOrderPdf(
	params: FetchPurchaseOrderPdfParams,
): Promise<void> {
	const {
		companyId,
		moduleCode,
		purchaseOrderId,
		purchaseRequestId,
		branchName,
	} = params;

	if (!companyId.trim() || !moduleCode.trim() || !purchaseOrderId.trim()) {
		throw new Error("Faltan datos para generar la orden de compra.");
	}

	const trimmedRequestId = purchaseRequestId?.trim() || "";

	const reportPromise = purchaseServices.GetPurchaseOrderReport({
		company_id: companyId,
		module_code: moduleCode,
		purchase_order_id: purchaseOrderId,
	});

	const productsPromise = trimmedRequestId
		? fetchAllPurchaseRequestProducts({
				purchaseServices,
				companyId,
				moduleCode,
				purchaseRequestId: trimmedRequestId,
			}).catch(() => [] as PurchaseRequestProductInformation[])
		: Promise.resolve([] as PurchaseRequestProductInformation[]);

	const [report, purchaseRequestProducts] = await Promise.all([
		reportPromise,
		productsPromise,
	]);

	const companyLogoUrl = useCompanyStore.getState().urlImage;
	const viewModel = mapPurchaseOrderReportToPdfViewModel({
		report,
		companyLogoUrl,
		branchName,
		purchaseRequestProducts,
	});

	const [{ pdf }, { PurchaseOrderPdfDocument }] = await Promise.all([
		import("@react-pdf/renderer"),
		import(
			"@app/modules/purchasing/ui/pages/purchase-order/components/reports/purchase-order-pdf/purchase-order-pdf-document"
		),
	]);

	const blob = await pdf(
		<PurchaseOrderPdfDocument viewModel={viewModel} />,
	).toBlob();
	await openPdfBlob(blob);
}
