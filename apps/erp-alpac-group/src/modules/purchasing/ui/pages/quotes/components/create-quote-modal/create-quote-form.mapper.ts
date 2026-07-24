import type { GetHistoryQuotesView } from "@app/modules/purchasing/ui/pages/quotes/types/quotes-view.types";
import type { CreateQuoteFormValues } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/create-quote-form.types";

export const mapCreateQuoteFormToView = (
	values: CreateQuoteFormValues,
	madeBy = "",
): GetHistoryQuotesView => {
	const approximateCost = values.quote_details.reduce(
		(total, detail) => total + (Number(detail.amount) || 0),
		0,
	);

	const quotesBySupplier = new Map<
		string,
		CreateQuoteFormValues["quote_details"]
	>();

	values.quote_details.forEach((detail) => {
		const current = quotesBySupplier.get(detail.supplier_id) ?? [];
		quotesBySupplier.set(detail.supplier_id, [...current, detail]);
	});

	return {
		id: `quote-${crypto.randomUUID()}`,
		made_by: madeBy.trim(),
		quote_date: values.quote_date,
		approximate_cost: approximateCost,
		observations: values.observations.trim(),
		additional_data: {
			quotes_made: Array.from(quotesBySupplier.entries()).map(
				([supplierId, details]) => ({
					suppliers_details: {
						its_registered: true,
						supplier_id: supplierId,
						supplier_legal_name: "",
						contact_name: "",
						contact_phone_number: "",
					},
					product_details_quotes: details.map((detail) => ({
						product_id: detail.product_id || undefined,
						product_name: "",
						product_cost: Number(detail.amount) || 0,
						unit_measure_id: detail.unit_measure_id,
						observations: null,
						images_base_64: [],
					})),
				}),
			),
		},
	};
};
