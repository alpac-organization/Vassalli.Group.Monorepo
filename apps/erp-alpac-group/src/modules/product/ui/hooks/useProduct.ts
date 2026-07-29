import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductServices } from "../../infrastructure/services/ProductServices";
import { httpHandler } from "@app/core/adapters";

import type { GetProductCategoryRequest } from "../../domain/ApiContract/Requests/product-category/get-product-category.request";
import type { GetProductRequest } from "../../domain/ApiContract/Requests/product/get-product.request";
import type { CreateProductRequest } from "../../domain/ApiContract/Requests/product/create-product.request";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";

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
		getProductPayload?.product_id?.trim(),
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
		retry: 1,
	});

	const CreateProduct = useMutation<void, ApiErrorResponse, CreateProductRequest>({
		mutationKey: ["create-product"],
		mutationFn: (payload: CreateProductRequest) => productServices.CreateProduct(payload),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["get-products"] }),
		retry: 1,
	});

	return { GetProductCategories, GetProducts, CreateProduct };
};
