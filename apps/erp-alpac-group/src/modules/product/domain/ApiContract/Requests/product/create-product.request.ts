export interface CreateProductRequest {
   company_id: string;
   module_code: string;
   product_code: string;
   product_name: string;
   description?: string;   
   category_id: string; 
}