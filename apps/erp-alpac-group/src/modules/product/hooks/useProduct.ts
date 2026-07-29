import { useQuery } from "@tanstack/react-query";
import type { GetProductCategoryRequest } from "../domain/ApiContract/Requests/product-category/get-product-category.request";
import { ProductServices } from "../infrastructure/services/ProductServices";
import { httpHandler } from "@app/core/adapters";
import type { GetProductRequest } from "../domain/ApiContract/Requests/product/get-product.request";

const productServices = new ProductServices(httpHandler);

interface useProductProps {
  productPayload?: GetProductRequest;
  productCategoryPayload?: GetProductCategoryRequest;
}

export const useProduct = (props?: useProductProps) => {
  const { productPayload } = props || {};
  const { productCategoryPayload } = props || {};

  const productEnabled = Boolean(
  (productPayload?.company_id?.trim() &&
    productPayload?.module_code?.trim()) ||
    productPayload?.product_id?.trim(),
  );

  const productCategoryEnabled = Boolean(
    productCategoryPayload?.company_id?.trim() &&
    productCategoryPayload?.module_code?.trim(),
  );

  const GetProductCategories = useQuery({
    queryKey: ["get-product-categories", productCategoryPayload],
    queryFn: () =>
      productServices.GetProductCategories(productCategoryPayload!),
    enabled: productCategoryEnabled,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });

  const GetProducts = useQuery({
    queryKey: ["get-products", productPayload],
    queryFn: () => productServices.GetProducts(productPayload!),
    enabled: productEnabled,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { GetProductCategories, GetProducts };
};
