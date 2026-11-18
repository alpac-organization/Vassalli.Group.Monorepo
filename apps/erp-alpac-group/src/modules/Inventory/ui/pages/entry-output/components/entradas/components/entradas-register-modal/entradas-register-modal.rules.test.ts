import { validateRegisterEntryForm } from "./entradas-register-modal.rules";

const buildValidInput = () => ({
  invoiceNumber: "FAC-001",
  hasEvidence: true,
  items: [{ purchase_order_item_id: "order-item-1" }],
  costCenters: { "order-item-1": "cost-center-1" },
});

describe("register_inventory_entry_form_rules", () => {
  it("returns valid when all required data is provided", () => {
    const result = validateRegisterEntryForm(buildValidInput());

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("requires an invoice number", () => {
    const result = validateRegisterEntryForm({
      ...buildValidInput(),
      invoiceNumber: "   ",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("El número de factura es obligatorio.");
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

  it("requires a cost center for every item", () => {
    const result = validateRegisterEntryForm({
      ...buildValidInput(),
      costCenters: {},
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      "Debe asignar el centro de costo a todos los ítems.",
    );
  });
});
