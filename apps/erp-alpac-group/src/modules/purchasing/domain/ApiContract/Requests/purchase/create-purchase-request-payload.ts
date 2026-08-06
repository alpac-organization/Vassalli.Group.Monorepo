
export interface CreatePurchaseRequestPayload {
   company_id: string;
   module_code: string;

   area_id?: string;
   branch_id: string;
   request_date: string;
   request_type: number;
   observations: string;


   purchase_request_items: PurchaseRequestItem[];
}

export interface PurchaseRequestItem {
   quantity: number;
   quantity_unit?: number;
   product_id: string;
   unit_measure_id: string;
   description: string;
   justification?: string;
}

/* {
  "area_id": "3f2504e0-4f89-11d3-9a0c-0305e82c3301",
  "branch_id": "6fa459ea-ee8a-3ca4-894e-db77e160355e",
  "request_date": "2025-06-10",
  "observations": "Compra urgente para mantenimiento de equipos",
  "request_type": 1,
  "purchase_request_items": [
    {
      "quantity": 10,
      "quantity_unit": 1,
      "product_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "unit_measure_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "description": "Guantes de nitrilo",
      "justification": "Reposición de stock en almacén"
    },
    {
      "quantity": 5,
      "quantity_unit": null,
      "product_id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
      "unit_measure_id": "d4e5f6a7-b8c9-0123-def1-234567890123",
      "description": "Filtros de aceite",
      "justification": "Mantenimiento preventivo de maquinaria"
    }
  ]
} */