export type ProductStatusFilter = "Active" | "Inactive";

export interface ProductsAndServicesFilters {
	category_product_id?: string;
	product_code?: string;
	status?: ProductStatusFilter;
}

export interface ProductsAndServicesProps {
	filters: ProductsAndServicesFilters;
	onApply: (filters: ProductsAndServicesFilters) => void;
	onClear: () => void;
}