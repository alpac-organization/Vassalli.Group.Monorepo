import type { ProductUsageType } from "@app/core/enums/product-usage-type.enum";

export interface GetProductRequest {
   company_id: string;
   module_code: string;   
   category_product_id?: string;
   product_usage_type?: ProductUsageType;
   page_number?: number;   
   page_size?: number;   
}