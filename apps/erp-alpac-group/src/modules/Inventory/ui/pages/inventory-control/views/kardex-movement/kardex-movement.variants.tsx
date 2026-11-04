import { Badges, ContextMenu } from "@alpac/design-system";
import { formatCurrency } from "@app/shared/utils/currency.utils";

import { KardexType } from "@app/core/enums/kardex-type.enum";
import { KardexMovementType, type KardexMovementTypeEnum } from "@app/core/enums/kardex-movement-type.enum";
import { contextMenuButton } from "@app/modules/purchasing/ui/pages/supplier/components/supplier-table/constants/supplier-table.constants";

import type { ContextMenuItem, TableColumn } from "@alpac/design-system";
import type { KardexMovementFilters } from "./kardex-movements.types";
import type { KardexMovementsData } from "@app/modules/Inventory/domain/api-contract/responses/kardex-movements.response";

export const KardexMovementTypeColorBadges: Record<KardexMovementTypeEnum, string> = {
   Buys:    "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
   Exit:    "bg-orange-100 text-orange-800 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
   Returns: "bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
};

const ColumnBadgeColors = {
   category:     "bg-indigo-100 text-indigo-800 border border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
   kardexType:   "bg-cyan-100 text-cyan-800 border border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800",
} as const;

export const GetKardexMovementsColumnsToTable = function(): TableColumn<KardexMovementsData>[]{
   return [
      {
         key: "product_code",
         label: "Código del Producto",
         render(item){
            return <span>{item.product_information.product_code}</span>
         }
      },
      {
         key: "product_name",
         label: "Nombre del Producto",
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
                  className={ColumnBadgeColors.category}
                  label={item.product_information.category_information.name}
               />
            )
         }
      },
      {
         key: "kardex_type",
         label: "Tipo",
         render(item){
            return (
               <Badges
                  color="info"
                  className={ColumnBadgeColors.kardexType}
                  label={KardexType[item.kardex_type].label}
               />
            )
         }
      },
      {
         key: "movement_type",
         label: "Movimiento",
         render(item){
            return (
               <Badges
                  color="info"
                  className={KardexMovementTypeColorBadges[item.movement_type]}
                  label={KardexMovementType[item.movement_type].label}
               />
            )
         }
      },
      {
         key: "unit_cost",
         label: "Costo Unitario",
         render(item){
            return <span>{formatCurrency(item.unit_cost)}</span>
         }
      },
      {
         key: "total_input",
         label: "Total de entrada",
         render(item){
            return <span>{formatCurrency(item.total_input)}</span>
         }
      },
      {
         key: "total_output",
         label: "Total de salida",
         render(item){
            return <span>{formatCurrency(item.total_output)}</span>
         }
      },
      {
         key: "average_cost",
         label: "Costo Promedio",
         render(item){
            return <span>{formatCurrency(item.average_cost)}</span>
         }
      },
      {
         key: "total_kardex",
         label: "Total en Kardex",
         render(item){
            return <span>{formatCurrency(item.total_kardex)}</span>
         }
      },
      {
         key: "options",
         label: "Opciones",
         render(){
            return (
               <ContextMenu
                  triggerClassName={contextMenuButton}
                  items={GetContextMenuItems()}
                  openUpOnMobile
               />
            )
         }
      }
   ]
}

const GetContextMenuItems = function(): ContextMenuItem[] {
   return [
      {
         label: "Ver detalle del movimiento",
         onClick(){
         }
      }
   ]
}

export const GetMovementTypeOptions = function() {
   return Object.entries(KardexMovementType).map(([key, value]) => ({
      label: value.label,
      value: key
   }));
}

export const DEFAULT_KARDEX_MOVEMENT_FILTERS: KardexMovementFilters = {
   product_code: "",
   category_id:  "",
   kardex_type:  null,
   movement_type: null,

   page_number:  0,
   page_size:    5
}