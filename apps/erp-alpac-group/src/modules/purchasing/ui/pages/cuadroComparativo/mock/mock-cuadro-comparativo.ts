import type { CuadroComparativoData } from "@app/modules/purchasing/ui/pages/cuadroComparativo/types/cuadro-comparativo.types";

export const MOCK_CUADRO_COMPARATIVO: CuadroComparativoData = {
  elaborationDate: "22/07/2026",
  suppliers: ["Inditec", "compuexpress", "tecnolite"],
  supplierHeaderColors: ["FFBDD7EE", "FFF8CBAD", "FFC6E0B4"],
  items: [
    {
      quantity: 6,
      unit: "UNIDAD",
      description: "camaras ip Bullet 4mp micro sd",
      quotes: [
        {
          brand: "UNV",
          unitPrice: 3137.22,
          iva: null,
          ivaLabel: "N/A",
          totalPrice: 18823.32,
        },
        {
          brand: "",
          unitPrice: null,
          iva: 0,
          totalPrice: 0,
        },
        {
          brand: "",
          unitPrice: 3662.06,
          iva: 3295.85,
          totalPrice: 21972.36,
        },
      ],
    },
    {
      quantity: 50,
      unit: "",
      description: "conectores rj45 cat6",
      quotes: [
        {
          brand: "",
          unitPrice: null,
          iva: null,
          ivaLabel: "N/A",
          totalPrice: 0,
        },
        {
          brand: "",
          unitPrice: 16.74,
          iva: 125.55,
          totalPrice: 837,
        },
        {
          brand: "",
          unitPrice: 49.44,
          iva: 370.8,
          totalPrice: 2472,
        },
      ],
    },
    {
      quantity: 1,
      unit: "UNIDAD",
      description: "caja de cable cat 6 100% cobre exterior 305mts",
      quotes: [
        {
          brand: "",
          unitPrice: 6330.51,
          iva: null,
          ivaLabel: "N/A",
          totalPrice: 6330.51,
        },
        {
          brand: "",
          unitPrice: null,
          iva: 0,
          totalPrice: 0,
        },
        {
          brand: "",
          unitPrice: null,
          iva: 0,
          totalPrice: 0,
        },
      ],
    },
  ],
  totals: [
    { subtotal: 25153.83, iva: null, total: 25153.83 },
    { subtotal: 837, iva: 125.55, total: 962.55 },
    { subtotal: 24444.36, iva: 3666.65, total: 28111.01 },
  ],
  criteria: [
    {
      inventoryAvailability: "inmediata",
      paymentMethod: "contado",
      quality: "ALTA",
      deliveryTime: "1 DIAS",
      transport: "SI",
      warrantyPeriod: "1 mes",
      afterSalesService: "N/A",
    },
    {
      inventoryAvailability: "Inmediata",
      paymentMethod: "contado",
      quality: "ALTA",
      deliveryTime: "2 DIAS",
      transport: "NO",
      warrantyPeriod: "1 mes",
      afterSalesService: "N/A",
    },
    {
      inventoryAvailability: "Inmediata",
      paymentMethod: "contado",
      quality: "ALTA",
      deliveryTime: "2 DIAS",
      transport: "NO",
      warrantyPeriod: "1 mes",
      afterSalesService: "N/A",
    },
  ],
  technicianSuggestion: "N/A",
  administratorSuggestion: "N/A",
  selectedSupplier: "",
  justification: [
    "Inditec: Se adquirirán las cámaras y el cableado por precio y calidad.",
    "CompuExpress: Se adquirirán los conectores RJ45 por precio y calidad.",
  ],
  preparedBy: "Gabriel Morales",
  approvedBy: "",
};
