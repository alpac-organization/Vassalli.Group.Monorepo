import type { MonthlyPurchaseReportItemDto } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-monthly-purchase-report-response";
import { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";

const MONTH_NAMES_ES = [
	"ENERO",
	"FEBRERO",
	"MARZO",
	"ABRIL",
	"MAYO",
	"JUNIO",
	"JULIO",
	"AGOSTO",
	"SEPTIEMBRE",
	"OCTUBRE",
	"NOVIEMBRE",
	"DICIEMBRE",
] as const;

export const getMonthNameEs = (month: number): string => {
	if (month < 1 || month > 12) return "";
	return MONTH_NAMES_ES[month - 1];
};

export const resolveReportPeriod = (
	items: MonthlyPurchaseReportItemDto[],
	year?: number,
	month?: number,
): { year: number; month: number } => {
	const first = items[0];
	return {
		year: year ?? first?.year ?? new Date().getUTCFullYear(),
		month: month ?? first?.month ?? new Date().getUTCMonth() + 1,
	};
};

export const formatCordoba = (value: number): string => {
	const formatted = new Intl.NumberFormat("es-NI", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(value);

	return `C$ ${formatted}`;
};

export const formatQuantity = (value: number): string => {
	return new Intl.NumberFormat("es-NI", {
		maximumFractionDigits: 2,
	}).format(value);
};

export const resolveRequestTypeLabel = (
	requestType: string | null | undefined,
): string => {
	const match = Object.values(PurchaseRequestEnum).find(
		(option) => option.textValue === requestType,
	);
	return match?.label.toUpperCase() ?? (requestType?.toUpperCase() ?? "");
};

export const sumTotalPrice = (items: MonthlyPurchaseReportItemDto[]): number =>
	items.reduce((acc, item) => acc + (Number(item.total_price) || 0), 0);

export const buildReportTitle = (year: number, month: number): string => {
	const monthName = getMonthNameEs(month);
	return `REPORTE MENSUAL PAPELERÍA Y ÚTILES DE OFICINA ${monthName} ${year}`;
};
