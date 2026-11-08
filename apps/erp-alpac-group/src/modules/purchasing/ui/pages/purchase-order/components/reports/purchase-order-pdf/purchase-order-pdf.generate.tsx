import { warehouseHttpHandler } from "@app/core/adapters/axiosAdapter";
import { PurchaseServices } from "@app/modules/purchasing/infrastructure/services/purchase/PurchaseServices";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { mapPurchaseOrderReportToPdfViewModel } from "@app/modules/purchasing/ui/pages/purchase-order/components/reports/purchase-order-pdf/utils/map-purchase-order-report-to-pdf";
import type { FetchPurchaseOrderPdfParams } from "@app/modules/purchasing/ui/pages/purchase-order/components/reports/purchase-order-pdf/types/purchase-order-pdf.types";

const purchaseServices = new PurchaseServices(warehouseHttpHandler);

async function openPdfBlob(blob: Blob): Promise<void> {
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener,noreferrer");
}

/**
 * la funcion Pide el reporte de la orden, lo mapea al PDF y lo abre en otra pestaña.
 * react-pdf se carga aquí para no meterlo en el bundle de la lista.
 */
export async function fetchAndOpenPurchaseOrderPdf(
  params: FetchPurchaseOrderPdfParams,
): Promise<void> {
  const { companyId, moduleCode, purchaseOrderId, branchName } = params;

  if (!companyId.trim() || !moduleCode.trim() || !purchaseOrderId.trim()) {
    throw new Error("Faltan datos para generar la orden de compra.");
  }

  const report = await purchaseServices.GetPurchaseOrderReport({
    company_id: companyId,
    module_code: moduleCode,
    purchase_order_id: purchaseOrderId,
  });

  const companyLogoUrl = useCompanyStore.getState().urlImage;
  const viewModel = mapPurchaseOrderReportToPdfViewModel({
    report,
    companyLogoUrl,
    branchName,
  });

  const [{ pdf }, { PurchaseOrderPdfDocument }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("@app/modules/purchasing/ui/pages/purchase-order/components/reports/purchase-order-pdf/purchase-order-pdf-document"),
  ]);

  const blob = await pdf(
    <PurchaseOrderPdfDocument viewModel={viewModel} />,
  ).toBlob();
  await openPdfBlob(blob);
}
