export interface GetProductRequest {
   company_id: string;
   module_code: string;   
   category_product_id?: string;
   page_number?: number;   
   page_size?: number;   
}