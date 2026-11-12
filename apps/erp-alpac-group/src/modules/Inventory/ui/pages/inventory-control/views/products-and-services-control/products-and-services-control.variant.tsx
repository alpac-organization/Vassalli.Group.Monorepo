import { Badges, ContextMenu }  from "@alpac/design-system"

import { ProductUsageType } from "@app/core/enums/product-usage-type.enum"
import { contextMenuButton } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/utils/styles"

import type { ContextMenuItem, TableColumn } from "@alpac/design-system"
import type { GetProductResponse } from "@app/modules/product/domain/ApiContract/Responses/product/get-product.response"
import type { ProductsAndServicesFilters } from "./views/products-and-services-section-filters/products-and-services-section-filters.types"
import type { GetProductColumnsToTableProps } from "./products-and-services-control.types"
import { ProductStatus } from "@app/core/enums/product-status.enum"

export const GetProductColumnsToTable = function(props: GetProductColumnsToTableProps): TableColumn<GetProductResponse>[]{
   return [
      { 
         key: "product_code",       
         label: "Codigo",
         render(item){
            return <span>{item.code}</span>
         }
      },
      { 
         key: "product_name",       
         label: "Producto"
      },
      {
         key: "status",       
         label: "Estado",
         render(item) {
            return (
               <Badges 
                  color="info"
                  className={ProductStatus[item.product_status ?? "Active"].BadgeColor}
                  label={ProductStatus[item.product_status ?? "Active"].label}
               />
            )
         },
      },
      {
         key: "category",       
         label: "Categoria",
         render(item) {
            return (
               <Badges 
                  color="info"
                  className="bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                  label={item.category?.name ?? "-"}
               />
            )
         },
      },
      {
         key: "usage_type",       
         label: "Tipo de uso",
         render(item){
            return (
               <Badges 
                  color="info"
                  className="bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                  label={ ProductUsageType[item.usage_type ?? "Operational"].label ?? "-"}
               />
            )
         }
      },
      {
         key: "options",
         label: "Opciones",
         render(item){

            props.item = item;
            const ContextMenuItems = getContexMenuItems(props);

            return (
               <ContextMenu
                  triggerClassName={contextMenuButton}
                  items={ContextMenuItems}
                  openUpOnMobile
               />
            )
         }
      }
   ]
}

const getContexMenuItems = function(subProps: GetProductColumnsToTableProps): ContextMenuItem[] {
   const { item, openModalToEdit, openModalToDelete, selectProduct } = subProps;

   if (!item)
   {
      return [];
   }
   
   return [
      {
         label: "Editar",
         onClick(){
            selectProduct(item);
            openModalToEdit();
         }
      },
      {
         label: "Elminar Producto",
         onClick(){
            selectProduct(item);
            openModalToDelete()
         }
      }
   ]
}

export const DEFAULT_PRODUCT_FILTERS: ProductsAndServicesFilters = {
   product_code:       "",
   category_product_id:"",
   page_number:        1,
   page_size:          5
}