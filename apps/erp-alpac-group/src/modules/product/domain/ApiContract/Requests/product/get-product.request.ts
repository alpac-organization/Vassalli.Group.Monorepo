export interface GetProductRequest {
   company_id: string;
   module_code: string;
   // CategoryProductId
   category_product_id?: string;
   page_number?: number;   
   page_size?: number;   
}