import type { GetHistoryQuotesView } from "@app/modules/procurement/ui/pages/quotes/types/quotes-view.types";
import type { CreateQuoteFormValues } from "@app/modules/procurement/ui/pages/quotes/components/create-quote-modal/create-quote-form.types";

export const mapCreateQuoteFormToView = (
  values: CreateQuoteFormValues,
): GetHistoryQuotesView => ({
  id: `quote-${crypto.randomUUID()}`,
  made_by: values.made_by.trim(),
  quote_date: values.quote_date,
  approximate_cost: Number(values.approximate_cost) || 0,
  currency: values.currency,
  observations: values.observations.trim(),
  additional_data: {
    quotes_made: values.suppliers.map((supplier) => ({
      suppliers_details: {
        its_registered: Boolean(supplier.its_registered),
        supplier_id: supplier.supplier_id,
        supplier_legal_name: supplier.supplier_legal_name.trim(),
        contact_name: supplier.contact_name.trim(),
        contact_phone_number: supplier.contact_phone_number.trim(),
      },
      product_details_quotes: supplier.products.map((product) => ({
        product_id: product.product_id.trim() || undefined,
        product_name: product.product_name.trim(),
        product_cost: Number(product.product_cost) || 0,
        unit_measure_id: product.unit_measure_id,
        observations: product.observations.trim() || null,
        images_base_64: product.images_base_64,
      })),
    })),
  },
});
