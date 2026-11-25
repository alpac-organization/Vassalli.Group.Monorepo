import type { IHttpHandler } from "@app/core/ports";
import { InventoryEntriesServices } from "@app/modules/Inventory/infrastructure/services/inventory-entries-services";

describe("inventory_entries_services_infrastructure", () => {
  let service: InventoryEntriesServices;
  let http_handler_mock: IHttpHandler;

  const inventoryEntry = {
    inventory_entry_id: crypto.randomUUID(),
    code: "IE-001",
    purchase_request_code: null,
    created_at: new Date().toISOString(),
    entry_type: "Buy" as const,
    entry_status: "ApprovedEntry" as const,
    branch_information: null,
    work_area_information: null,
  };

  beforeEach(() => {
    http_handler_mock = {
      get: vi.fn(),
      post: vi.fn().mockResolvedValue(inventoryEntry),
    } as unknown as IHttpHandler;

    service = new InventoryEntriesServices(http_handler_mock);
  });

  it("posts the register payload to the inventory entry endpoint", async () => {
    const payload = {
      company_id: "company-1",
      module_code: "INVENTORY",
      inventory_entry_id: "entry-1",
      invoice_number: "FAC-001",
      invoice_date: "2026-11-18",
      observations: null,
      evidence_images_base64: ["base64-image"],
      items: [
        {
          purchase_order_item_id: "order-item-1",
        },
      ],
    };

    const result = await service.RegisterInventoryEntry(payload);

    expect(http_handler_mock.post).toHaveBeenCalledWith(
      "/companies/company-1/modules/INVENTORY/inventory-entries/entry-1/register",
      {
        invoice_number: "FAC-001",
        invoice_date: "2026-11-18",
        observations: null,
        evidence_images_base64: ["base64-image"],
        items: [
          {
            purchase_order_item_id: "order-item-1",
          },
        ],
      },
    );
    expect(result).toEqual(inventoryEntry);
  });
});
