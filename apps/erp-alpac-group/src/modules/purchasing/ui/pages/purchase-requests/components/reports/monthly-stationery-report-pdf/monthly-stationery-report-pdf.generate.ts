import { createElement } from "react";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import {
	MONTHLY_STATIONERY_REPORT_MOCK_ROWS,
	MONTHLY_STATIONERY_REPORT_MOCK_SUMMARY,
	buildMonthlyStationeryReportTitle,
} from "./mock/monthly-stationery-report-pdf.mock";

async function openPdfBlob(blob: Blob): Promise<void> {
	const url = URL.createObjectURL(blob);
	window.open(url, "_blank", "noopener,noreferrer");
}

export async function generateMonthlyStationeryReportMockPdf(
	monthIndex = 7,
	year = 2026,
): Promise<void> {
	const logoUrl = useCompanyStore.getState().urlImage || null;

	const [{ pdf }, { MonthlyStationeryReportPDF }] = await Promise.all([
		import("@react-pdf/renderer"),
		import(
			"@app/modules/purchasing/ui/pages/purchase-requests/components/reports/monthly-stationery-report-pdf/monthly-stationery-report-pdf"
		),
	]);

	const blob = await pdf(
		createElement(MonthlyStationeryReportPDF, {
			title: buildMonthlyStationeryReportTitle(monthIndex, year),
			logoUrl,
			rows: MONTHLY_STATIONERY_REPORT_MOCK_ROWS,
			summaryLines: MONTHLY_STATIONERY_REPORT_MOCK_SUMMARY,
		}),
	).toBlob();

	await openPdfBlob(blob);
}
