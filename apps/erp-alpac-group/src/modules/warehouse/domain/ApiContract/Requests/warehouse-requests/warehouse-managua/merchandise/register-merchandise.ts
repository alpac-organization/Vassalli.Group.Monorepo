export interface RegisterMerchandiseRequest {
    company_id: string;
    module_code: string;
    merchandise_name: string;
    description?: string;
    category_id: string;
}
