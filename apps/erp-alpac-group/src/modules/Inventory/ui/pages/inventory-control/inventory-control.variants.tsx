import type { TabItem } from "@alpac/design-system";
import { StockControl } from "./views/stock-control/stock-control";
import { KardexMovement } from "./views/kardex-movement/kardex-movement";
import { ProductsAndServicesControl } from "./views/products-and-services-control/products-and-services-control";

export const GetSectionViewsToInventoryControl = function(): TabItem<string>[] {

   return [
      {
         id: "stock-control",
         label: "Existencias",
         render: () => <StockControl />
      },
      {
         id: "kardex-movement",
         label: "Kardex",
         render: () => <KardexMovement />
      },
      {
         id: "product-and-services",
         label: "Productos y servicios",
         render: () => <ProductsAndServicesControl />
      }      
   ]
}