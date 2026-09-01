import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductServices } from "@app/modules/product/infrastructure/services/ProductServices";
import { httpHandler } from "@app/core/adapters";

import type { GetProductCategoryRequest } from "@app/modules/product/domain/ApiContract/Requests/product-category/get-product-category.request";
import type { GetProductRequest } from "@app/modules/product/domain/ApiContract/Requests/product/get-product.request";
import type { CreateProductRequest } from "@app/modules/product/domain/ApiContract/Requests/product/create-product.request";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { CreateProductResponse } from "@app/modules/product/domain/ApiContract/Responses/product/create-product.response";
import type { CreateProductCategoryRequest } from "@app/modules/product/domain/ApiContract/Requests/product-category/create-product-category.request";
const productServices = new ProductServices(httpHandler);

interface useProductProps {
	getProductPayload?: GetProductRequest;
	getProductCategoryPayload?: GetProductCategoryRequest;
}

export const useProduct = (props?: useProductProps) => {
	const queryClient = useQueryClient();

	const { getProductPayload, getProductCategoryPayload } = props || {};

	const productEnabled = Boolean(
		(getProductPayload?.company_id?.trim() &&
			getProductPayload?.module_code?.trim()) ||
		getProductPayload?.category_product_id?.trim(),
	);

	const productCategoryEnabled = Boolean(
		getProductCategoryPayload?.company_id?.trim() &&
		getProductCategoryPayload?.module_code?.trim(),
	);

	const GetProductCategories = useQuery({
		queryKey: ["get-product-categories", getProductCategoryPayload],
		queryFn: () =>
			productServices.GetProductCategories(getProductCategoryPayload!),
		enabled: productCategoryEnabled,
		refetchOnWindowFocus: false,
		staleTime: 1000 * 60 * 2,
		retry: 1,
	});

	const GetProducts = useQuery({
		queryKey: ["get-products", getProductPayload],
		queryFn: () => productServices.GetProducts(getProductPayload!),
		enabled: productEnabled,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		retry: 1,
	});

	const CreateProduct = useMutation<CreateProductResponse, ApiErrorResponse, CreateProductRequest>({
		mutationKey: ["create-product"],
		mutationFn: (payload: CreateProductRequest) => productServices.CreateProduct(payload),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["get-products"] }),
		retry: 1,
	});

		const CreateProductCategory = useMutation<boolean, ApiErrorResponse, CreateProductCategoryRequest>({
		mutationKey: ["create-product-category"],
		mutationFn: (payload: CreateProductCategoryRequest) => productServices.CreateProductCategory(payload),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["get-product-categories"] }),
		retry: 1,
	});

	return { GetProductCategories, GetProducts, CreateProduct, CreateProductCategory };
};


