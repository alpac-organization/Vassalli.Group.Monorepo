export interface MonthlyStationeryReportRow {
	month: string;
	year: string;
	key: string;
	requestType: string;
	branch: string;
	requestingArea: string;
	supplier: string;
	description: string;
	quantity: number;
	unitPrice: number;
	totalPrice: number;
}

export interface MonthlyStationeryReportSummaryLine {
	label: string;
	amount: number;
}

export interface MonthlyStationeryReportPdfProps {
	title: string;
	logoUrl: string | null;
	rows: MonthlyStationeryReportRow[];
	summaryLines: MonthlyStationeryReportSummaryLine[];
}
