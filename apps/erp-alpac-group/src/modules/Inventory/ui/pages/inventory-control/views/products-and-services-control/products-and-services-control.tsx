import { DataTable, Pagination, SectionHeader } from "@alpac/design-system"
import { useProduct } from "@app/modules/product/ui/hooks/useProduct"
import { useUserStore } from "@app/shared/stores/useUserStore";

export const ProductsAndServicesControl = function() {

   const { companyId, moduleCode } = useUserStore();

   const { GetProducts } = useProduct({
      getProductPayload: {
         company_id: companyId,
         module_code: moduleCode,
         product_usage_type: "Operational"
      }
   });

   const { data: ProductsData } = GetProducts;

   console.log(JSON.stringify(ProductsData, null, 3));

   return (
		<div className="flex flex-col gap-5">
         <SectionHeader
				title="Filtros de búsqueda"
				subtitle="Utiliza los filtros de busquedas para una busqueda mas rapida."
			/>

         {/* Productos y servicios */}

         <DataTable
				title="Productos y Servicios"
				data={[]}
				columns={[]}
				pagination={
					<Pagination
						pageSize={0}
						totalRecords={0}
						currentPage={0}
						onPageChange={() => {}}
					/>
				}
			/>
		</div>
	)
}