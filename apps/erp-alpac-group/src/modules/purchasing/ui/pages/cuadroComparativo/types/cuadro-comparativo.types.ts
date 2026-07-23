export type SupplierQuote = {
  brand: string;
  unitPrice: number | null;
  iva: number | null;
  ivaLabel?: string;
  totalPrice: number;
};

export type ComparisonItem = {
  quantity: number;
  unit: string;
  description: string;
  quotes: SupplierQuote[];
};

export type SupplierTotals = {
  subtotal: number;
  iva: number | null;
  total: number;
};

export type SupplierCriteria = {
  inventoryAvailability: string;
  paymentMethod: string;
  quality: string;
  deliveryTime: string;
  transport: string;
  warrantyPeriod: string;
  afterSalesService: string;
};

export type CuadroComparativoData = {
  elaborationDate: string;
  suppliers: string[];
  supplierHeaderColors: string[];
  items: ComparisonItem[];
  totals: SupplierTotals[];
  criteria: SupplierCriteria[];
  technicianSuggestion: string;
  administratorSuggestion: string;
  selectedSupplier: string;
  justification: string[];
  preparedBy: string;
  approvedBy: string;
};
