import dayjs from "dayjs";
import type { DatePickerValue } from "@alpac/design-system";

export const MAX_INVOICE_NUMBER_LENGTH = 50;
export const MAX_OBSERVATIONS_LENGTH = 500;

export interface RegisterEntryValidationItem {
  purchase_order_item_id: string | null;
  cost_center_id?: string | null;
  cost_center_information?: {
    cost_center_id?: string | null;
  } | null;
}

export interface RegisterEntryValidationInput {
  invoiceNumber: string;
  invoiceDate?: DatePickerValue | null;
  observations?: string;
  hasEvidence: boolean;
  items: RegisterEntryValidationItem[];
}

export interface RegisterEntryValidationResult {
  isValid: boolean;
  errors: string[];
}

export const resolveEntryItemCostCenterId = (
  item: RegisterEntryValidationItem,
): string | null => {
  const fromInfo = item.cost_center_information?.cost_center_id?.trim();
  if (fromInfo) return fromInfo;

  const fromFlat = item.cost_center_id?.trim();
  return fromFlat || null;
};

export const validateInvoiceNumber = (value: string): true | string => {
  const trimmed = value.trim();

  if (!trimmed) {
    return "El número de factura es obligatorio.";
  }

  if (trimmed.length > MAX_INVOICE_NUMBER_LENGTH) {
    return `El número de factura no puede superar los ${MAX_INVOICE_NUMBER_LENGTH} caracteres.`;
  }

  return true;
};

export const validateInvoiceDate = (
  value: DatePickerValue | null | undefined,
): true | string => {
  if (!value) return true;

  const parsed = dayjs.isDayjs(value)
    ? value
    : dayjs((value as { $d?: Date })?.$d ?? (value as dayjs.ConfigType));

  if (!parsed.isValid()) {
    return "La fecha de la factura no es válida.";
  }

  if (parsed.isAfter(dayjs(), "day")) {
    return "La fecha de la factura no puede ser una fecha futura.";
  }

  return true;
};

export const validateObservations = (value: string): true | string => {
  if (value.trim().length > MAX_OBSERVATIONS_LENGTH) {
    return `Las observaciones no pueden superar los ${MAX_OBSERVATIONS_LENGTH} caracteres.`;
  }

  return true;
};

export const validateEvidenceImages = (count: number): true | string => {
  if (count <= 0) {
    return "Debe adjuntar al menos una imagen de evidencia de la factura.";
  }

  return true;
};

export const validateRegisterEntryForm = (
  input: RegisterEntryValidationInput,
): RegisterEntryValidationResult => {
  const errors: string[] = [];

  const invoiceNumberCheck = validateInvoiceNumber(input.invoiceNumber);
  if (invoiceNumberCheck !== true) {
    errors.push(invoiceNumberCheck);
  }

  const invoiceDateCheck = validateInvoiceDate(input.invoiceDate);
  if (invoiceDateCheck !== true) {
    errors.push(invoiceDateCheck);
  }

  if (input.observations !== undefined) {
    const observationsCheck = validateObservations(input.observations);
    if (observationsCheck !== true) {
      errors.push(observationsCheck);
    }
  }

  const evidenceCheck = validateEvidenceImages(input.hasEvidence ? 1 : 0);
  if (evidenceCheck !== true) {
    errors.push(evidenceCheck);
  }

  if (input.items.length === 0) {
    errors.push("La entrada no tiene ítems para registrar.");
  }

  const hasItemWithoutAssociatedCostCenter = input.items.some(
    (item) => !item.purchase_order_item_id || !resolveEntryItemCostCenterId(item),
  );

  if (hasItemWithoutAssociatedCostCenter) {
    errors.push(
      "Uno o más productos de la entrada no tienen un centro de costo asociado.",
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
