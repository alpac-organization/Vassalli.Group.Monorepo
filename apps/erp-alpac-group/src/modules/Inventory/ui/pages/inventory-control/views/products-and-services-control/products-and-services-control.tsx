import { useCallback, useState } from "react";
import { useProduct } from "@app/modules/product/ui/hooks/useProduct";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { DataTable, Pagination, SectionHeader } from "@alpac/design-system";

import { useAlertState } from "@app/shared/hooks/useAlertState";
import { CreateProductModal } from "@app/modules/product/ui/views/create-product-modal/create-product-modal";
import { DeactivateProductModal } from "./views/delete-product-or-services/delete-product-or-services-modal";
import { DEFAULT_PRODUCT_FILTERS, GetProductColumnsToTable } from "./products-and-services-control.variant";
import { ProductsAndServicesSectionFilters } from "./views/products-and-services-section-filters/products-and-services-section-filters";

import type { GetProductResponse } from "@app/modules/product/domain/ApiContract/Responses/product/get-product.response";
import type { ProductsAndServicesFilters } from "./views/products-and-services-section-filters/products-and-services-section-filters.types";

const PAGE_SIZE = 5;

export const ProductsAndServicesControl = function () {

	const { AlertComponent, handleRequestError, handleRequestSuccess } = useAlertState();

	const [pageNumber, setPageNumber] = useState(1);
	const [filters, setFilters] = useState<ProductsAndServicesFilters>(DEFAULT_PRODUCT_FILTERS);

	const [productToEdit, setProductToEdit] 		= useState<GetProductResponse | null>(null);
	const [productToDelete, setProductToDelete]		= useState<GetProductResponse | null>(null);
	const [isProductFormOpen, setIsProductFormOpen] = useState(false);

	const { companyId, moduleCode } = useUserStore();
	
	const { GetProducts, DeleteProduct } = useProduct({
		getProductPayload: {
			company_id: companyId,
			module_code: moduleCode,
			product_usage_type: "Operational",
			...(filters.category_product_id && { category_product_id: filters.category_product_id }),
			...(filters.product_code?.trim() && { product_code: filters.product_code.trim() }),
			...(filters.status && { status: filters.status }),
			page_size: PAGE_SIZE,
			page_number: pageNumber,
		},
	});

	const { data: productsData, isPending, isFetching } = GetProducts;

	const productsAndServicesColumns = GetProductColumnsToTable(
		(row) => {
			setProductToEdit(row);
			setIsProductFormOpen(true);
		},
		(row) => {
			setProductToDelete(row);
		},
	);

	const handleApplyFilters = (newFilters: ProductsAndServicesFilters) => {
		setFilters(newFilters);
		setPageNumber(1);
	};

	const handleClearFilters = () => {
		setFilters(DEFAULT_PRODUCT_FILTERS);
		setPageNumber(1);
	};

	const handlePageChange = useCallback((page: number) => {
		setPageNumber(page);
	}, []);

	const handleCloseProductForm = () => {
		setIsProductFormOpen(false);
		setProductToEdit(null);
	};

	return (
		<div className="flex flex-col gap-5">
			<SectionHeader
				title="Filtros de búsqueda"
				subtitle="Utiliza los filtros de búsqueda para encontrar más rápido lo que necesitas."
			/>

			{/* Filtros de búsqueda para productos */}
			<ProductsAndServicesSectionFilters
				filters={filters}
				onApply={handleApplyFilters}
				onClear={handleClearFilters}
			/>

			{/* Productos y servicios */}
			<DataTable
				isLoading={isPending || isFetching}
				title="Productos y Servicios"
				data={productsData?.data ?? []}
				columns={productsAndServicesColumns}
				pagination={
					<Pagination
						pageSize={productsData?.page_size ?? 0}
						totalRecords={productsData?.total ?? 0}
						currentPage={productsData?.page_number ?? 0}
						onPageChange={handlePageChange}
					/>
				}
			/>

			<CreateProductModal
				typeProductToRegister="Operational"
				isOpen={isProductFormOpen}
				onClose={handleCloseProductForm}
				onRequestError={handleRequestError}
				onRequestSuccess={handleRequestSuccess}
				selectedProduct={productToEdit}
			/>
			
			{ AlertComponent }
		</div>
	);
};
