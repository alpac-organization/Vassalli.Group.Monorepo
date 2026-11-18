export interface RegisterEntryValidationItem {
  purchase_order_item_id: string | null;
}

export interface RegisterEntryValidationInput {
  invoiceNumber: string;
  hasEvidence: boolean;
  items: RegisterEntryValidationItem[];
  costCenters: Record<string, string>;
}

export interface RegisterEntryValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateRegisterEntryForm = (
  input: RegisterEntryValidationInput,
): RegisterEntryValidationResult => {
  const errors: string[] = [];

  if (!input.invoiceNumber.trim()) {
    errors.push("El número de factura es obligatorio.");
  }

  if (!input.hasEvidence) {
    errors.push("Debe adjuntar al menos una imagen de evidencia de la factura.");
  }

  if (input.items.length === 0) {
    errors.push("La entrada no tiene ítems para registrar.");
  }

  const hasItemWithoutCostCenter = input.items.some((item) => {
    if (!item.purchase_order_item_id) return true;
    return !input.costCenters[item.purchase_order_item_id]?.trim();
  });

  if (hasItemWithoutCostCenter) {
    errors.push("Debe asignar el centro de costo a todos los ítems.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
