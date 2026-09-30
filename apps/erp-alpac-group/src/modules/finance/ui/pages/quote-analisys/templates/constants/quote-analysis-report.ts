export const FIXED_WIDTH = {
	qty: "7%",
	um: "9%",
	desc: "18%",
} as const;

export const FIXED_COLUMNS_TOTAL_WIDTH = "34%";
export const PROVIDERS_TOTAL_WIDTH = "66%";
export const QUALITATIVE_LABEL_WIDTH = "28%";
export const QUALITATIVE_PROVIDERS_WIDTH = "72%";
export const SUB_COL_WIDTH = "25%";
export const SUB_COL_COUNT = 4;

export const PROVIDER_HEADER_COLORS = ["#BDD7EE", "#FCE4D6", "#C6EFCE"] as const;
export const PROVIDERS_GROUP_HEADER_COLOR = "#D9E1F2";

export const EMPTY_CELL = "—";

export const PROVIDER_SUB_HEADERS = [
	"Marca",
	"P/U",
	"IVA",
	"Precio total",
] as const;

export const TOTALS_ROWS = [
	{ key: "subtotal", label: "Sub total" },
	{ key: "iva", label: "IVA" },
	{ key: "total", label: "TOTAL" },
] as const;

export const QUALITATIVE_ROWS = [
	{ key: "delivery", label: "* Plazo de entrega" },
	{ key: "transport", label: "* Transporte" },
	{ key: "warranty", label: "* Período de garantía" },
	{ key: "quality", label: "* Calidad" },
	{ key: "inventory", label: "* Disponibilidad de inventario" },
	{ key: "paymentMethod", label: "* Forma de pago" },
] as const;
