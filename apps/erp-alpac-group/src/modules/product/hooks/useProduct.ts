import { useQuery } from "@tanstack/react-query"
import type { GetProductCategoryRequest } from "../domain/ApiContract/Requests/product-category/get-product-category.request";
import { ProductServices } from "../infrastructure/services/ProductServices";
import { httpHandler } from "@app/core/adapters";

const productServices = new ProductServices(httpHandler);

interface useProductProps {
   productCategoryPayload: GetProductCategoryRequest
}

export const useProduct = (props?: useProductProps) => {

   const { productCategoryPayload } = props || {};

   const productCategoryEnabled = Boolean(
      productCategoryPayload?.company_id?.trim() &&
      productCategoryPayload?.module_code?.trim()
   );

   const GetProductCategories = useQuery({
      queryKey: ['get-product-categories', productCategoryPayload],
      queryFn: () => productServices.GetProductCategories(productCategoryPayload!),
      enabled: productCategoryEnabled,      
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 2,
      retry: 1,
   });

   return { GetProductCategories }
}