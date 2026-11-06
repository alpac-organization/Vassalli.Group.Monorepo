import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductServices } from "@app/modules/product/infrastructure/services/ProductServices";
import { httpHandler } from "@app/core/adapters";

import type { GetProductCategoryRequest } from "@app/modules/product/domain/ApiContract/Requests/product-category/get-product-category.request";
import type { GetProductRequest } from "@app/modules/product/domain/ApiContract/Requests/product/get-product.request";
import type { CreateProductRequest } from "@app/modules/product/domain/ApiContract/Requests/product/create-product.request";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { CreateProductResponse } from "@app/modules/product/domain/ApiContract/Responses/product/create-product.response";
import type { CreateProductCategoryRequest } from "@app/modules/product/domain/ApiContract/Requests/product-category/create-product-category.request";
import type { CreateProductCategoryResponse } from "@app/modules/product/domain/ApiContract/Responses/product-category/create-product-category.response";
import type { GetProductDetailsRequest } from "@app/modules/product/domain/ApiContract/Requests/product/get-product-details.request";
import type { GetProductDetailsResponse } from "@app/modules/product/domain/ApiContract/Responses/product/get-product-details.response";
import type { UpdateProductRequest } from "@app/modules/product/domain/ApiContract/Requests/product/update-product.request";
import type { UpdateProductSupplierPriceRequest } from "@app/modules/product/domain/ApiContract/Requests/product/update-product-supplier-price.request";
import type { GetProductSupplierPriceHistoryRequest } from "@app/modules/product/domain/ApiContract/Requests/product/get-product-supplier-price-history.request";
import type { GetProductSupplierPriceHistoryResponse } from "@app/modules/product/domain/ApiContract/Responses/product/get-product-supplier-price-history.response";
import type { DeleteProductSupplierLinkRequest } from "@app/modules/product/domain/ApiContract/Requests/product/delete-product-supplier-link.request";

const productServices = new ProductServices(httpHandler);

interface useProductProps {
	getProductPayload?: GetProductRequest;
	getProductCategoryPayload?: GetProductCategoryRequest;
	getProductDetailsPayload?: GetProductDetailsRequest;
	getPriceHistoryPayload?: GetProductSupplierPriceHistoryRequest;
}

export const useProduct = (props?: useProductProps) => {
	const queryClient = useQueryClient();

	const {
		getProductPayload,
		getProductCategoryPayload,
		getProductDetailsPayload,
		getPriceHistoryPayload,
	} = props || {};

	const productEnabled = Boolean(
		(getProductPayload?.company_id?.trim() &&
			getProductPayload?.module_code?.trim()) ||
			getProductPayload?.category_product_id?.trim(),
	);

	const productCategoryEnabled = Boolean(
		getProductCategoryPayload?.company_id?.trim() &&
			getProductCategoryPayload?.module_code?.trim(),
	);

	const productDetailsEnabled = Boolean(
		getProductDetailsPayload?.company_id?.trim() &&
			getProductDetailsPayload?.module_code?.trim() &&
			getProductDetailsPayload?.product_id?.trim(),
	);

	const priceHistoryEnabled = Boolean(
		getPriceHistoryPayload?.company_id?.trim() &&
			getPriceHistoryPayload?.module_code?.trim() &&
			getPriceHistoryPayload?.product_id?.trim() &&
			getPriceHistoryPayload?.supplier_id?.trim(),
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

	const GetProductDetails = useQuery<GetProductDetailsResponse, ApiErrorResponse>({
		queryKey: ["get-product-details", getProductDetailsPayload],
		queryFn: () => productServices.GetProductDetails(getProductDetailsPayload!),
		enabled: productDetailsEnabled,
		refetchOnWindowFocus: false,
		retry: 1,
	});

	const GetProductSupplierPriceHistory = useQuery<
		GetProductSupplierPriceHistoryResponse,
		ApiErrorResponse
	>({
		queryKey: ["get-product-supplier-price-history", getPriceHistoryPayload],
		queryFn: () =>
			productServices.GetProductSupplierPriceHistory(getPriceHistoryPayload!),
		enabled: priceHistoryEnabled,
		refetchOnWindowFocus: false,
		retry: 1,
	});

	const CreateProduct = useMutation<
		CreateProductResponse,
		ApiErrorResponse,
		CreateProductRequest
	>({
		mutationKey: ["create-product"],
		mutationFn: (payload: CreateProductRequest) =>
			productServices.CreateProduct(payload),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["get-products"] }),
		retry: 1,
	});

	const UpdateProduct = useMutation<void, ApiErrorResponse, UpdateProductRequest>({
		mutationKey: ["update-product"],
		mutationFn: (payload) => productServices.UpdateProduct(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["get-products"] });
			queryClient.invalidateQueries({ queryKey: ["get-product-details"] });
		},
		retry: 1,
	});

	const UpdateProductSupplierPrice = useMutation<
		void,
		ApiErrorResponse,
		UpdateProductSupplierPriceRequest
	>({
		mutationKey: ["update-product-supplier-price"],
		mutationFn: (payload) => productServices.UpdateProductSupplierPrice(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["get-product-details"] });
			queryClient.invalidateQueries({
				queryKey: ["get-product-supplier-price-history"],
			});
			queryClient.invalidateQueries({ queryKey: ["supplier-details"] });
		},
		retry: 1,
	});

	const DeleteProductSupplierLink = useMutation<
		void,
		ApiErrorResponse,
		DeleteProductSupplierLinkRequest
	>({
		mutationKey: ["delete-product-supplier-link"],
		mutationFn: (payload) => productServices.DeleteProductSupplierLink(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["get-product-details"] });
			queryClient.invalidateQueries({ queryKey: ["get-products"] });
			queryClient.invalidateQueries({ queryKey: ["supplier-details"] });
		},
		retry: 1,
	});

	const CreateProductCategory = useMutation<
		CreateProductCategoryResponse,
		ApiErrorResponse,
		CreateProductCategoryRequest
	>({
		mutationKey: ["create-product-category"],
		mutationFn: (payload: CreateProductCategoryRequest) =>
			productServices.CreateProductCategory(payload),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["get-product-categories"] }),
		retry: 1,
	});

	return {
		GetProductCategories,
		GetProducts,
		GetProductDetails,
		GetProductSupplierPriceHistory,
		CreateProduct,
		UpdateProduct,
		UpdateProductSupplierPrice,
		DeleteProductSupplierLink,
		CreateProductCategory,
	};
};
