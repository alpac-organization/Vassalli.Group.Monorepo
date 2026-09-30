import type {
	MonthlyStationeryReportRow,
	MonthlyStationeryReportSummaryLine,
} from "../types/monthly-stationery-report-pdf.types";

const baseRow = {
	month: "SEPTIEMBRE",
	year: "2026",
	key: "sep-26",
	requestType: "MENSUAL",
	branch: "MANAGUA",
	supplier: "SISTEMAS RCL",
} as const;

export const MONTHLY_STATIONERY_REPORT_MOCK_ROWS: MonthlyStationeryReportRow[] = [
	{
		...baseRow,
		requestingArea: "ALMACEN",
		description: "Lapiceros azules",
		quantity: 12,
		unitPrice: 2.63,
		totalPrice: 31.56,
	},
	{
		...baseRow,
		requestingArea: "ALMACEN",
		description: "Marcador permanente azul",
		quantity: 3,
		unitPrice: 8.55,
		totalPrice: 25.65,
	},
	{
		...baseRow,
		requestingArea: "ALMACEN",
		description: "Clips jumbo",
		quantity: 10,
		unitPrice: 12.5,
		totalPrice: 125.0,
	},
	{
		...baseRow,
		requestingArea: "ALMACEN",
		description: "Grapas standard",
		quantity: 5,
		unitPrice: 18.4,
		totalPrice: 92.0,
	},
	{
		...baseRow,
		requestingArea: "ADMINISTRACION",
		description: "Clamp pequeño 15mm",
		quantity: 48,
		unitPrice: 0.97,
		totalPrice: 46.56,
	},
	{
		...baseRow,
		requestingArea: "ADMINISTRACION",
		description: "Folders manila carta",
		quantity: 25,
		unitPrice: 3.2,
		totalPrice: 80.0,
	},
	{
		...baseRow,
		requestingArea: "ADMINISTRACION",
		description: "Resma papel bond carta",
		quantity: 8,
		unitPrice: 185.0,
		totalPrice: 1480.0,
	},
	{
		...baseRow,
		requestingArea: "INFORMATICA",
		description: "Baterias AAA",
		quantity: 6,
		unitPrice: 48.26,
		totalPrice: 289.56,
	},
	{
		...baseRow,
		requestingArea: "INFORMATICA",
		description: "Mouse pad",
		quantity: 4,
		unitPrice: 45.0,
		totalPrice: 180.0,
	},
	{
		...baseRow,
		requestingArea: "TALENTO HUMANO",
		description: "Lapiceros negros",
		quantity: 20,
		unitPrice: 2.63,
		totalPrice: 52.6,
	},
	{
		...baseRow,
		requestingArea: "TALENTO HUMANO",
		description: "Corrector liquido",
		quantity: 10,
		unitPrice: 22.5,
		totalPrice: 225.0,
	},
	{
		...baseRow,
		requestingArea: "CONTABILIDAD",
		description: "Posticks de colores",
		quantity: 3,
		unitPrice: 68.2,
		totalPrice: 204.6,
	},
	{
		...baseRow,
		requestingArea: "CONTABILIDAD",
		description: "Calculadora de bolsillo",
		quantity: 2,
		unitPrice: 95.0,
		totalPrice: 190.0,
	},
	{
		...baseRow,
		requestingArea: "A.A Managua",
		description: "Cinta adhesiva transparente",
		quantity: 15,
		unitPrice: 14.8,
		totalPrice: 222.0,
	},
	{
		...baseRow,
		requestingArea: "A.A Peñas Blancas",
		description: "Marcadores fluorescentes",
		quantity: 12,
		unitPrice: 9.75,
		totalPrice: 117.0,
	},
	{
		...baseRow,
		requestingArea: "A.A Las Manos",
		description: "Engrapadora mediana",
		quantity: 2,
		unitPrice: 145.0,
		totalPrice: 290.0,
	},
	{
		...baseRow,
		requestingArea: "A.A Guasaule",
		description: "Perforadora 2 huecos",
		quantity: 1,
		unitPrice: 210.0,
		totalPrice: 210.0,
	},
	{
		...baseRow,
		requestingArea: "A.A Esteli",
		description: "Cartulina blanca",
		quantity: 30,
		unitPrice: 5.5,
		totalPrice: 165.0,
	},
];

export const MONTHLY_STATIONERY_REPORT_MOCK_SUMMARY: MonthlyStationeryReportSummaryLine[] = [
	{ label: "TOTAL", amount: 4807.4 },
	{ label: "TOTAL DIF", amount: 1.0 },
];

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

export const buildMonthlyStationeryReportTitle = (
	monthIndex: number,
	year: number,
): string => {
	const monthName = MONTH_NAMES_ES[monthIndex] ?? "MES";
	return `REPORTE MENSUAL PAPELERÍA Y ÚTILES DE OFICINA ${monthName} ${year}`;
};
