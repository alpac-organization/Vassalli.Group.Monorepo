import type { TabItem } from "@alpac/design-system";
import { StockControl } from "./views/stock-control/stock-control";
import { ProductsAndServicesControl } from "./views/products-and-services-control/products-and-services-control";

export const GetSectionViewsToInventoryControl = function(): TabItem<string>[] {

   return [
      {
         id: "stock-control",
         label: "Existencias",
         render: () => <StockControl />
      },
      {
         id: "product-and-services",
         label: "Productos y servicios",
         render: () => <ProductsAndServicesControl />
      }      
   ]
}