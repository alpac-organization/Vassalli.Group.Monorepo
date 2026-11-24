export const EMPTY_VALUE = "—";

const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const DATE_FORMATTER = new Intl.DateTimeFormat("es-NI", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("es-NI", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const QUANTITY_FORMATTER = new Intl.NumberFormat("es-NI", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const CURRENCY_FORMATTER = new Intl.NumberFormat("es-NI", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Las fechas sin hora ("2026-11-23") se interpretan en hora local para
 * evitar que se muestren con un día de desfase por la zona horaria.
 */
const parseDate = (value: string): Date => {
  if (DATE_ONLY_REGEX.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  return new Date(value);
};

export const formatDate = (value?: string | null): string => {
  if (!value) return EMPTY_VALUE;
  const date = parseDate(value);
  return Number.isNaN(date.getTime()) ? EMPTY_VALUE : DATE_FORMATTER.format(date);
};

export const formatDateTime = (value?: string | null): string => {
  if (!value) return EMPTY_VALUE;
  if (DATE_ONLY_REGEX.test(value)) return formatDate(value);
  const date = parseDate(value);
  return Number.isNaN(date.getTime()) ? EMPTY_VALUE : DATE_TIME_FORMATTER.format(date);
};

export const formatQuantity = (quantity: number, unit?: string | null): string => {
  const formatted = QUANTITY_FORMATTER.format(Number(quantity) || 0);
  return unit ? `${formatted} ${unit}` : formatted;
};

export const formatCurrency = (amount: number): string =>
  `C$ ${CURRENCY_FORMATTER.format(Number(amount) || 0)}`;

export const displayText = (value?: string | null): string =>
  value?.trim() || EMPTY_VALUE;

type BadgeVariant = { label: string; badgeColor: string };

export const resolveBadgeVariant = (
  variants: Record<string, BadgeVariant> & { default: BadgeVariant },
  key?: string | null,
): BadgeVariant => {
  const variant = key ? variants[key] : undefined;

  return {
    label: variant?.label || key || EMPTY_VALUE,
    badgeColor: variant?.badgeColor ?? variants.default.badgeColor,
  };
};
