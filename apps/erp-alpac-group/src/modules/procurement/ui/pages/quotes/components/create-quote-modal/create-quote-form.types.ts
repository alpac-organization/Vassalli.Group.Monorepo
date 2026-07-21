export type QuoteCurrency = "NIO" | "USD";

export type ProductQuoteFormValues = {
  client_id: string;
  product_id: string;
  product_name: string;
  product_cost: number;
  unit_measure_id: string;
  observations: string;
  images_base_64: string[];
};

export type SupplierQuoteFormValues = {
  client_id: string;
  supplier_id: string | null;
  its_registered: boolean;
  supplier_legal_name: string;
  contact_name: string;
  contact_phone_number: string;
  products: ProductQuoteFormValues[];
};

export type CreateQuoteFormValues = {
  made_by: string;
  quote_date: string;
  approximate_cost: number;
  currency: QuoteCurrency;
  observations: string;
  suppliers: SupplierQuoteFormValues[];
};

export type CatalogProductOption = {
  product_id: string;
  product_name: string;
  product_cost: number;
  unit_measure_id: string;
};

export const createEmptyProduct = (): ProductQuoteFormValues => ({
  client_id: crypto.randomUUID(),
  product_id: "",
  product_name: "",
  product_cost: 0,
  unit_measure_id: "",
  observations: "",
  images_base_64: [],
});

export const createEmptySupplier = (): SupplierQuoteFormValues => ({
  client_id: crypto.randomUUID(),
  supplier_id: null,
  its_registered: false,
  supplier_legal_name: "",
  contact_name: "",
  contact_phone_number: "",
  products: [createEmptyProduct()],
});

export const createQuoteDefaultValues = (
  madeBy: string,
): CreateQuoteFormValues => ({
  made_by: madeBy,
  quote_date: new Date().toISOString().slice(0, 10),
  approximate_cost: 0,
  currency: "NIO",
  observations: "",
  suppliers: [createEmptySupplier()],
});
