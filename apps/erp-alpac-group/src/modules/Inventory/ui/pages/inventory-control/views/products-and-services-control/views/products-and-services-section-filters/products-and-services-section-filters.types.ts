export interface ProductsAndServicesFilters {
    category_product_id?:  string;
    product_code?: string;
    page_number?: number;
    page_size?: number;
}

export interface ProductsAndServicesProps {
    filters: ProductsAndServicesFilters
    onApply: (filters: ProductsAndServicesFilters) => void;
    onClear: () => void;
}