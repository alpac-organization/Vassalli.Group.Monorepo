import type { GetHistoryQuotesView } from "@app/modules/procurement/ui/pages/quotes/types/quotes-view.types";
import type { CreateQuoteFormValues } from "@app/modules/procurement/ui/pages/quotes/components/create-quote-modal/create-quote-form.types";

export const mapCreateQuoteFormToView = (
	values: CreateQuoteFormValues,
	madeBy = "",
): GetHistoryQuotesView => {
	const approximateCost = values.suppliers.reduce((supplierTotal, supplier) => {
		const productsTotal = supplier.products.reduce(
			(productTotal, product) =>
				productTotal + (Number(product.product_cost) || 0),
			0,
		);
		return supplierTotal + productsTotal;
	}, 0);

	return {
		id: `quote-${crypto.randomUUID()}`,
		made_by: madeBy.trim(),
		quote_date: values.quote_date,
		approximate_cost: approximateCost,
		observations: values.observations.trim(),
		additional_data: {
			quotes_made: values.suppliers.map((supplier) => ({
				suppliers_details: {
					its_registered: !supplier.is_new_supplier,
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
	};
};
