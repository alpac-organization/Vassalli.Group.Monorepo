import type { GetHistoryQuotesView } from "@app/modules/procurement/ui/pages/quotes/types/quotes-view.types";
import firmaAracellyGuillen from "@app/assets/signatures/alpac/firmaAracellyGuillen.jpg";
export const MOCK_QUOTES: GetHistoryQuotesView[] = [
  {
    id: "quote-1",
    made_by: "Carlos Méndez",
    quote_date: "2026-07-10",
    approximate_cost: 4850.75,
    observations:
      "Cotización para reposición de insumos de oficina y limpieza.",
    additional_data: {
      quotes_made: [
        {
          suppliers_details: {
            its_registered: true,
            supplier_id: "sup-001",
            supplier_legal_name: "Distribuidora Centroamericana S.A.",
            contact_name: "Ana Ruiz",
            contact_phone_number: "+505 8888-1122",
          },
          product_details_quotes: [
            {
              product_name: "Resma de papel bond carta",
              product_cost: 185.5,
              unit_measure_id: "UND",
              observations: "Paquete de 500 hojas",
            },
            {
              product_name: "Detergente industrial 5L",
              product_cost: 320,
              unit_measure_id: "UND",
              observations: null,
            },
          ],
        },
        {
          suppliers_details: {
            its_registered: false,
            supplier_id: null,
            supplier_legal_name: "Comercial El Progreso",
            contact_name: "Luis Ortega",
            contact_phone_number: "+505 8777-3344",
          },
          product_details_quotes: [
            {
              product_name: "Resma de papel bond carta",
              product_cost: 178,
              unit_measure_id: "UND",
              observations: "Entrega en 48 horas",
            },
            {
              product_name: "Detergente industrial 5L",
              product_cost: 295.25,
              unit_measure_id: "UND",
            },
          ],
        },
      ],
    },
  },
  {
    id: "quote-2",
    made_by: "María López",
    quote_date: "2026-07-12",
    approximate_cost: 12500,
    observations: "Equipos de cómputo para nuevas estaciones de trabajo.",
    additional_data: {
      quotes_made: [
        {
          suppliers_details: {
            its_registered: true,
            supplier_id: "sup-014",
            supplier_legal_name: "Tech Solutions Nicaragua",
            contact_name: "Pedro Aguilar",
            contact_phone_number: "+505 8555-9090",
          },
          product_details_quotes: [
            {
              product_name: 'Laptop 15" i5 16GB',
              product_cost: 950,
              unit_measure_id: "UND",
              observations: "Incluye Windows Pro",
            },
            {
              product_name: 'Monitor 24" IPS',
              product_cost: 280,
              unit_measure_id: "UND",
            },
            {
              product_name: "Teclado y mouse inalámbrico",
              product_cost: 45,
              unit_measure_id: "SET",
            },
          ],
        },
      ],
    },
  },
  {
    id: "quote-3",
    made_by: "José Ramírez",
    quote_date: "2026-07-15",
    approximate_cost: 3200.5,
    observations: "Materiales de seguridad industrial para almacén.",
    additional_data: {
      quotes_made: [
        {
          suppliers_details: {
            its_registered: true,
            supplier_id: "sup-008",
            supplier_legal_name: "Seguridad Industrial del Pacífico",
            contact_name: "Carmen Vega",
            contact_phone_number: "+505 8666-2211",
          },
          product_details_quotes: [
            {
              product_name: "Casco de seguridad",
              product_cost: 45.5,
              unit_measure_id: "UND",
              images_base_64: [
                firmaAracellyGuillen,
                firmaAracellyGuillen,
                firmaAracellyGuillen,
              ],
            },
            {
              product_name: "Guantes anticorte",
              product_cost: 28,
              unit_measure_id: "PAR",
              observations: "Talla L",
            },
            {
              product_name: "Chaleco reflectante",
              product_cost: 22,
              unit_measure_id: "UND",
            },
          ],
        },
        {
          suppliers_details: {
            its_registered: false,
            supplier_legal_name: "Protección Total",
            contact_name: "Roberto Silva",
            contact_phone_number: "+505 8444-5566",
          },
          product_details_quotes: [
            {
              product_name: "Casco de seguridad",
              product_cost: 42,
              unit_measure_id: "UND",
            },
            {
              product_name: "Guantes anticorte",
              product_cost: 30.5,
              unit_measure_id: "PAR",
            },
          ],
        },
      ],
    },
  },
];
