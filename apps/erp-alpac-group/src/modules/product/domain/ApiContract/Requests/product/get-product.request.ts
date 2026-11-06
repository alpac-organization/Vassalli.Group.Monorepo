import type { ProductUsageTypeEnum } from "@app/core/enums/product-usage-type.enum";

export interface GetProductRequest {
   company_id:           string;
   module_code:          string;   
   product_usage_type:   ProductUsageTypeEnum;
   category_product_id?: string;
   page_number?:         number;   
   page_size?:           number;   
}