import dayjs from "dayjs";
import {
  validateInvoiceDate,
  validateInvoiceNumber,
  validateRegisterEntryForm,
} from "./entradas-register-modal.rules";

const buildValidInput = () => ({
  invoiceNumber: "FAC-001",
  hasEvidence: true,
  items: [
    {
      purchase_order_item_id: "order-item-1",
      cost_center_id: "cost-center-1",
    },
  ],
});

describe("register_inventory_entry_form_rules", () => {
  it("returns valid when invoice, evidence, and product cost center exist", () => {
    const result = validateRegisterEntryForm(buildValidInput());

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("requires an invoice number and enforces max length inline", () => {
    expect(validateInvoiceNumber("   ")).toBe(
      "El número de factura es obligatorio.",
    );
    expect(validateInvoiceNumber("A".repeat(51))).toBe(
      "El número de factura no puede superar los 50 caracteres.",
    );
    expect(validateInvoiceNumber("FAC-001")).toBe(true);
  });

  it("rejects future invoice dates inline", () => {
    expect(validateInvoiceDate(dayjs().add(2, "day"))).toBe(
      "La fecha de la factura no puede ser una fecha futura.",
    );
    expect(validateInvoiceDate(dayjs())).toBe(true);
  });

  it("requires at least one evidence image", () => {
    const result = validateRegisterEntryForm({
      ...buildValidInput(),
      hasEvidence: false,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      "Debe adjuntar al menos una imagen de evidencia de la factura.",
    );
  });

  it("rejects items when a product lacks an associated cost center", () => {
    const result = validateRegisterEntryForm({
      ...buildValidInput(),
      items: [{ purchase_order_item_id: "order-item-1", cost_center_id: null }],
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      "Uno o más productos de la entrada no tienen un centro de costo asociado.",
    );
  });
});
