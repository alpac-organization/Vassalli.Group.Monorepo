import { InventoryStockStatus } from "@app/core/enums/inventory-stock-status.enum"
import { Badges, ContextMenu, InputText } from "@alpac/design-system"
import { contextMenuButton } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/utils/styles"

import type { ContextMenuItem, Option, TableColumn } from "@alpac/design-system"
import type { InventoryStockData } from "@app/modules/Inventory/domain/api-contract/responses/inventory-stocks.response"
import type { InventoryStockStatusEnum } from "@app/core/enums/inventory-stock-status.enum"
import type { StockControlFilters } from "./stock-control.types"
import type { GetProductCategoryResponse } from "@app/modules/product/domain/ApiContract/Responses/product-category/get-product-category.response"

export const GetInventoryStocksColumnsToTable = function(): TableColumn<InventoryStockData>[]{
   return [
      { 
         key: "product_code",       
         label: "Codigo",
         render(item){
            return <span>{item.product_information.product_code}</span>
         }
      },
      { 
         key: "product_name",       
         label: "Producto",
         render(item){
            return <span>{item.product_information.product_name}</span>
         }
      },
      { 
         key: "category_name",      
         label: "Categoria",
         render(item){
            return (
               <Badges 
                  color="info"
                  className="bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                  label={item.product_information.category_information.name}
               />
            )
         }
      },
      { 
         key: "unit", 
         label: "Unidad Medida",
         render(item){
            return (
               <Badges 
                  color="info"
                  className="bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                  label={item.unit_measure_information.name}
               />
            )
         }
      },
      { 
         key: "available_quantity", 
         label: "Cantidad Disponible",
         render(item){
            return <span>{item.available_quantity}</span>
         }
      },
      { 
         key: "minimum_stock",      
         label: "Stock Minimo",
         render(item){
            return (
               <InputText 
                  readOnly 
                  disabled
                  value={item.minimum_stock} 
                  className="bg-transparent! w-[130px]! border-slate-600!"
               />
            )
         }
      },
      { 
         key: "maximum_stock",      
         label: "Stock Maximo",
         render(item){
            return (
               <InputText 
                  readOnly 
                  disabled
                  value={item.maximum_stock} 
                  className="bg-transparent! w-[130px]! border-slate-600!"
               />
            )
         }
      },
      { 
         key: "cost_center_name",   
         label: "Centro Costo",
         render(item){
            return <span>{item.cost_center_information.cost_center_name}</span>
         }
      },
      { 
         key: "status", 
         label: "Estado",
         render(item){
            return (
               <Badges 
                  color="info"
                  className={InvetoryStockStatusColorBadges[item.status]}
                  label={InventoryStockStatus[item.status].label}
               />
            )
         }
      },
      { 
         key: "cost", 
         label: "Costo Promedio",
         render(item){
            return (
               <span> C$ { item.weighted_average_cost }</span>
            )
         }
      },
      {
         key: "options",
         label: "Opciones",
         render(){
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

//Optiones de menu de item row
const ContextMenuItems: ContextMenuItem[] = [
   {
      label: "Editar Stock",
      onClick(){
      }
   },
   {
      label: "Sacar del Inventario",
      onClick(){
      }
   }
]

export const InvetoryStockStatusColorBadges: Record<InventoryStockStatusEnum, string> = {
   Empty:    "bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
   LowStock: "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
   Stable:   "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
}


//Valores iniciales
export const DEFAULT_STOCK_FILTERS: StockControlFilters = {
   product_code: "",
   category_id:  "",
}

export const GetProductCategoryOptions = function(data: GetProductCategoryResponse[]): Option[] {
   return data?.map(category =>  {
      return {
         label: category.name,
         value: category.id,
         disabled: false
      }
   });
}