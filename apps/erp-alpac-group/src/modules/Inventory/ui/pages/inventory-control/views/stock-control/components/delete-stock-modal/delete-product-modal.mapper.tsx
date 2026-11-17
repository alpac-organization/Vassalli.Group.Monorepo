import type { DeleteProductModalData } from "./delete-product-modal.types";
import type { GetProductResponse } from "@app/modules/product/domain/ApiContract/Responses/product/get-product.response";
import type { InventoryStockData } from "@app/modules/Inventory/domain/api-contract/responses/inventory-stocks.response";

const numberFormatter = new Intl.NumberFormat("es-NI", {
   minimumFractionDigits: 0,
   maximumFractionDigits: 2,
});

// Desde la pantalla de inventario (Control de stock)
export const mapStockToDeleteProductData = (stock: InventoryStockData): DeleteProductModalData => {
   const {
      product_information:      product,
      cost_center_information:  costCenter,
      unit_measure_information: unit,
   } = stock;

   const format   = (value: number) => `${numberFormatter.format(value)} ${unit.symbol}`;
   const hasStock = stock.available_quantity > 0;

   return {
      productId:      product.product_id,
      code:           product.product_code,
      name:           product.product_name,
      description:    product.description,
      categoryName:   product.category_information.name,
      costCenterName: costCenter.cost_center_name,
      metrics: [
        { label: "Disponible",   value: format(stock.available_quantity), highlight: hasStock },
        { label: "Stock mínimo", value: format(stock.minimum_stock) },
        { label: "Stock máximo", value: format(stock.maximum_stock) },
      ],
      warning: hasStock
        ? {
            title:   "Este producto aún tiene existencias",
            message: `Quedan ${format(stock.available_quantity)} disponibles. Al darlo de baja dejarán de estar disponibles en el catálogo.`,
        }
        : undefined,
   };
};

// Desde la pantalla de productos y servicios
export const mapProductToDeleteProductData = (product: GetProductResponse): DeleteProductModalData => {
   const isActive = product.product_status === "Active";

   return {
      productId:      product.product_id,
      code:           product.code,
      name:           product.product_name,
      description:    product.description,
      categoryName:   product.category.name,
      costCenterName: product.cost_center_information.cost_center_name,
      metrics: [
        { label: "Estado",            value: isActive ? "Activo" : "Inactivo", highlight: isActive },
        { label: "Unidad de medida",  value: product.unit_measure_information.name },
        { label: "Proveedores",       value: String(product.suppliers_count) },
      ],
      warning: isActive
        ? {
            title:   "Este producto está activo",
            message: "Al darlo de baja dejará de estar disponible en el catálogo y no podrá usarse en nuevos pedidos.",
        }
        : undefined,
   };
};