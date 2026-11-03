import type { TableColumn } from "@alpac/design-system";
import type { KardexMovementFilters } from "./kardex-movements.types";
import type { KardexMovementsData } from "@app/modules/Inventory/domain/api-contract/responses/kardex-movements.response";

import { KardexType } from "@app/core/enums/kardex-type.enum";
import { KardexMovementType } from "@app/core/enums/kardex-movement-type.enum";

export const GetKardexMovementsColumnsToTable = function(): TableColumn<KardexMovementsData>[]{
   return [
      {
         key: "kardex_type",
         label: "Tipo",
         render(item){
            return <span>{KardexType[item.kardex_type].label}</span>
         }
      },
      {
         key: "movement_type",
         label: "Movimiento",
         render(item){
            return <span>{KardexMovementType[item.movement_type].label}</span>
         }
      },
      // {
      //    key: "category_name",
      //    label: "Categoria",
      //    render(item){
      //       return (
      //          <Badges
      //             color="info"
      //             className="bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
      //             label={item.product_information.category_information.name}
      //          />
      //       )
      //    }
      // },
      // {
      //    key: "unit",
      //    label: "Unidad Medida",
      //    render(item){
      //       return (
      //          <Badges
      //             color="info"
      //             className="bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
      //             label={item.unit_measure_information.name}
      //          />
      //       )
      //    }
      // },
      // {
      //    key: "available_quantity",
      //    label: "Cantidad Disponible",
      //    render(item){
      //       return <span>{item.available_quantity}</span>
      //    }
      // },
      // {
      //    key: "minimum_stock",
      //    label: "Stock Minimo",
      //    render(item){
      //       return (
      //          <InputText
      //             readOnly
      //             disabled
      //             value={item.minimum_stock}
      //             className="bg-transparent! w-[130px]! border-slate-600!"
      //          />
      //       )
      //    }
      // },
      // {
      //    key: "maximum_stock",
      //    label: "Stock Maximo",
      //    render(item){
      //       return (
      //          <InputText
      //             readOnly
      //             disabled
      //             value={item.maximum_stock}
      //             className="bg-transparent! w-[130px]! border-slate-600!"
      //          />
      //       )
      //    }
      // },
      // {
      //    key: "cost_center_name",
      //    label: "Centro Costo",
      //    render(item){
      //       return <span>{item.cost_center_information.cost_center_name}</span>
      //    }
      // },
      // {
      //    key: "status",
      //    label: "Estado",
      //    render(item){
      //       return (
      //          <Badges
      //             color="info"
      //             className={InventoryStockStatusColorBadges[item.status]}
      //             label={InventoryStockStatus[item.status].label}
      //          />
      //       )
      //    }
      // },
      // {
      //    key: "cost",
      //    label: "Costo Promedio",
      //    render(item){
      //       return (
      //          <span> C$ { item.weighted_average_cost }</span>
      //       )
      //    }
      // },
      // {
      //    key: "options",
      //    label: "Opciones",
      //    render(item){
      //       return (
      //          <ContextMenu
      //             triggerClassName={contextMenuButton}
      //             items={[]}
      //             openUpOnMobile
      //          />
      //       )
      //    }
      // }
   ]
}


export const DEFAULT_STOCK_FILTERS: KardexMovementFilters = {
   product_code: "",
   category_id:  "",
   kardex_type:  null,
   movement_type: null,


   page_number:  0,
   page_size:    5
}