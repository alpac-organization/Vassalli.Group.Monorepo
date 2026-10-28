import { useCallback, useState } from "react";
import { Loader } from "@app/shared/components/loaders/loader";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useProduct } from "@app/modules/product/ui/hooks/useProduct"
import { DataTable, Pagination, SectionHeader } from "@alpac/design-system"

import { ProductsAndServicesSectionFilters } from "./views/products-and-services-section-filters";
import { DEFAULT_PRODUCT_FILTERS, GetProductColumnsToTable } from "./products-and-services-control.variant";
import type { ProductsAndServicesFilters } from "./views/products-and-services-section-filters.types";

const PAGE_SIZE = 5;

export const ProductsAndServicesControl = function() {

   const [filters, setFilters] = useState<ProductsAndServicesFilters>(DEFAULT_PRODUCT_FILTERS);

   const { companyId, moduleCode } = useUserStore();
   const { GetProducts } = useProduct({
      getProductPayload: {
         company_id: companyId,
         module_code: moduleCode,
         product_usage_type: "Operational",  
         ...(filters.category_product_id  && { category_product_id: filters.category_product_id  }),
         
         page_size: PAGE_SIZE,
         page_number: 1
      }
   });

   const { data: ProductsData, isPending, isFetching } = GetProducts;
   const productsAndServicesColumns = GetProductColumnsToTable();

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
         {
            (isPending || isFetching) &&  (
               <Loader title="Cargado productos operativos" />
            )
         }

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
				title="Productos y Servicios"
				data={ProductsData?.data ?? []}
				columns={productsAndServicesColumns}
				pagination={
					<Pagination
						pageSize={0}
						totalRecords={0}
						currentPage={0}
						onPageChange={handlePageChange}
					/>
				}
			/>
		</div>
	)
}