export interface CreateProductRequest {
   company_id: string;
   module_code: string;
   product_name: string;
   description?: string;   
   usage_type: number
   category_id: string; 
}