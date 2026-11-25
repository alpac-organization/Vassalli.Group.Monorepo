import { useCallback, useState } from "react";
import { useProduct } from "@app/modules/product/ui/hooks/useProduct";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { DataTable, Pagination, SectionHeader } from "@alpac/design-system";

import { useAlertState } from "@app/shared/hooks/useAlertState";
import { CreateProductModal } from "@app/modules/product/ui/views/create-product-modal/create-product-modal";
import { DEFAULT_PRODUCT_FILTERS, GetProductColumnsToTable } from "./products-and-services-control.variant";
import { ProductsAndServicesSectionFilters } from "./views/products-and-services-section-filters/products-and-services-section-filters";
import { DeleteProductModal } from "../stock-control/components/delete-stock-modal/delete-product-modal";
import { mapProductToDeleteProductData } from "../stock-control/components/delete-stock-modal/delete-product-modal.mapper";

import { RoleEnum } from "@app/core/enums/role.enum";
import { canDeleteProduct } from "./products-and-services-control.rules";

import type { GetProductResponse } from "@app/modules/product/domain/ApiContract/Responses/product/get-product.response";
import type { ProductsAndServicesFilters } from "./views/products-and-services-section-filters/products-and-services-section-filters.types";

const PAGE_SIZE = 5;

export const ProductsAndServicesControl = function () {

	const { AlertComponent, handleRequestError, handleRequestSuccess } = useAlertState();

	const [pageNumber, setPageNumber] = useState(1);
	const [filters, setFilters] = useState<ProductsAndServicesFilters>(DEFAULT_PRODUCT_FILTERS);

	const [productToEdit, setProductToEdit] = useState<GetProductResponse | null>(null);
	const [isProductFormOpen, setIsProductFormOpen] = useState(false);

	const [productToDelete, setProductToDelete] = useState<GetProductResponse | null>(null);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const { companyId, moduleCode, role } = useUserStore();
	const isSupervisor = role === RoleEnum.SUPERVISOR;

	const { GetProducts } = useProduct({
		getProductPayload: {
			company_id: companyId,
			module_code: moduleCode,
			product_usage_type: "Operational",
			...filters,
			page_size:   PAGE_SIZE,
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
			if (!canDeleteProduct(row.product_status)) {
				handleRequestError("Este producto no se puede dar de baja en su estado actual.");
				return;
			}

			setProductToDelete(row);
			setIsDeleteModalOpen(true);
		},
		!isSupervisor,
	);

	//#region Manejadores de filtros y paginación
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
	//#endregion

	//#region Cerrado de modales
	const handleCloseProductForm = () => {
		setIsProductFormOpen(false);
		setProductToEdit(null);
	};

	const handleCloseDeleteModal = () => {
		setIsDeleteModalOpen(false);
		setProductToDelete(null);
	};
	//#endregion

	const handleDeleteSuccess = (message: string) => {
		handleRequestSuccess(message);

		const isLastRowOfPage = (productsData?.data.length ?? 0) <= 1;

		if (isLastRowOfPage && pageNumber > 1) {
			setPageNumber(pageNumber - 1);
		} else {
			GetProducts.refetch();
		}
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

			{/* Modales */}
			<CreateProductModal
				typeProductToRegister="Operational"
				isOpen={isProductFormOpen}
				onClose={handleCloseProductForm}
				onRequestError={handleRequestError}
				onRequestSuccess={handleRequestSuccess}
				selectedProduct={productToEdit}
			/>

			{
				isDeleteModalOpen && (
					<DeleteProductModal
						data={productToDelete ? mapProductToDeleteProductData(productToDelete) : null}
						isOpen={isDeleteModalOpen}
						onClose={handleCloseDeleteModal}
						handleRequestError={handleRequestError}
						handleRequestSuccess={handleDeleteSuccess}
					/>
				)
			}

			{ AlertComponent }
		</div>
	);
};