import { useCallback, useState } from "react";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useProduct } from "@app/modules/product/ui/hooks/useProduct"
import { DataTable, Pagination, SectionHeader } from "@alpac/design-system"

import { CreateProductModal } from "@app/modules/product/ui/views/create-product-modal/create-product-modal";
import { ProductsAndServicesSectionFilters } from "./views/products-and-services-section-filters/products-and-services-section-filters";
import { DEFAULT_PRODUCT_FILTERS, GetProductColumnsToTable } from "./products-and-services-control.variant";
import type { ProductsAndServicesFilters } from "./views/products-and-services-section-filters/products-and-services-section-filters.types";
import type { GetProductResponse } from "@app/modules/product/domain/ApiContract/Responses/product/get-product.response";
import { useAlertState } from "@app/shared/hooks/useAlertState";

const PAGE_SIZE = 5;

export const ProductsAndServicesControl = function() {

   const [openProductEditModal, setOpenProductEditModal] = useState(false);
   const [productSelected, setProductSelected] = useState<GetProductResponse | null>(null);
   const { AlertComponent, handleRequestSuccess, handleRequestError } = useAlertState();
   
   const [filters, setFilters] = useState<ProductsAndServicesFilters>(DEFAULT_PRODUCT_FILTERS);

   const { companyId, moduleCode } = useUserStore();

   const { GetProducts } = useProduct({
      getProductPayload: {
         company_id: companyId,
         module_code: moduleCode,
         product_usage_type: "Operational",
         ...filters,         
      }
   });
   
   //#region Acciones del producto
   const handleOpenModalToEditProduct = function(){
      setOpenProductEditModal(true);
   }

   const handleCloseModal = function(){
      setOpenProductEditModal(false);
   }

   const handleSelectProduct = function(product: GetProductResponse) {
      setProductSelected(product);  
   }
   //#endregion

   const { data: productsData, isPending, isFetching } = GetProducts;
   
   const productsAndServicesColumns = GetProductColumnsToTable({
      selectProductToEdit: handleSelectProduct,
      openModalToEdit: handleOpenModalToEditProduct
   });

   //Metodos de filtrado
   const handleApplyFilters = (newFilters: ProductsAndServicesFilters) => {
      setFilters(newFilters);
   };

   const handleClearFilters = () => {
      setFilters(DEFAULT_PRODUCT_FILTERS);
   };

   const handlePageChange = useCallback((page: number) => {
      setFilters((prev) => ({
         ...prev,
         page_number: page,
      }));
   },[]);

   return (
		<div className="flex flex-col gap-5">
         <SectionHeader
				title="Filtros de búsqueda"
				subtitle="Utiliza los filtros de busquedas para una busqueda mas rapida."
			/>

         {/* Filtros de busqueda para productos */}
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
						pageSize={PAGE_SIZE}
						totalRecords={productsData?.page_size ?? 0}
						currentPage={productsData?.page_number ?? 0}
						onPageChange={handlePageChange}
					/>
				}
			/>
         
         {/* Modal para editar un producto */}
         <CreateProductModal 
            isOpen={openProductEditModal}
            onClose={handleCloseModal}
            typeProductToRegister="Operational"
            selectedProduct={productSelected}
            onRequestError={handleRequestError}
            onRequestSuccess={handleRequestSuccess}
         />

         { AlertComponent }
		</div>
	)
}