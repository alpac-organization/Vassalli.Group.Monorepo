import type { MonthlyPurchaseReportItemDto } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-monthly-purchase-report-response";

export type GenerateMonthlyPurchaseReportPdfParams = {
	items: MonthlyPurchaseReportItemDto[];
	logoUrl?: string | null;
	year?: number;
	month?: number;
};

/**
 * Dynamically loads `@react-pdf/renderer` and the PDF document only when generating,
 * keeping the main purchasing bundle lean (`bundle-dynamic-imports`).
 */
export async function generateMonthlyPurchaseReportPdf(
	params: GenerateMonthlyPurchaseReportPdfParams,
): Promise<Blob> {
	const [{ pdf }, { MonthlyPurchaseReportPdf }] = await Promise.all([
		import("@react-pdf/renderer"),
		import("./monthly-purchase-report-pdf"),
	]);

	return pdf(
		<MonthlyPurchaseReportPdf
			items={params.items}
			logoUrl={params.logoUrl}
			year={params.year}
			month={params.month}
		/>,
	).toBlob();
}
