export interface ProductsAndServicesFilters {
    category_product_id?:  string;
    product_code?: string;
}

export interface ProductsAndServicesProps {
    filters: ProductsAndServicesFilters
    onApply: (filters: ProductsAndServicesFilters) => void;
    onClear: () => void;
}