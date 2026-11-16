import { useCallback, useState } from "react";
import { Badges, DataTable, Pagination } from "@alpac/design-system";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useInventoryStocks } from "@app/modules/Inventory/ui/hooks/useInventoryStocks";

import type { TableColumn } from "@alpac/design-system";
import type { InventoryStockData } from "@app/modules/Inventory/domain/api-contract/responses/inventory-stocks.response";
import type { StockControlFilters } from "@app/modules/Inventory/ui/pages/inventory-control/views/stock-control/stock-control.types";
import { DEFAULT_STOCK_FILTERS } from "@app/modules/Inventory/ui/pages/inventory-control/views/stock-control/stock-control.variants";

const columns: TableColumn<InventoryStockData>[] = [
  {
    key: "product_name",
    label: "Producto",
    render(item) {
      return <span>{item.product_information?.product_name}</span>;
    },
  },
  {
    key: "unit",
    label: "Unidad de medida",
    render(item) {
      return (
        <Badges
          color="info"
          className="bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
          label={item.unit_measure_information?.name}
        />
      );
    },
  },
  {
    key: "available_quantity",
    label: "Cantidad disponible",
    render(item) {
      return <span>{item.available_quantity}</span>;
    },
  },
];

export function InventoryStocksTable() {
  const { companyId, moduleCode } = useUserStore();

  const [filters, setFilters] = useState<StockControlFilters>({
    ...DEFAULT_STOCK_FILTERS,
    page_number: 1,
  });

  const { GetInventoryStocksQuery } = useInventoryStocks({
    payloadGetInventoryStocksRequest: companyId && moduleCode
      ? {
          company_id: companyId,
          module_code: moduleCode,
          ...filters,
          is_fuel: true,
        }
      : undefined,
  });

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({
      ...prev,
      page_number: page,
    }));
  }, []);

  const { data, isPending, isFetching } = GetInventoryStocksQuery;

  return (
    <div className="flex flex-col gap-4 min-w-0">
      <DataTable
        isLoading={isPending || isFetching}
        title="Existencias y niveles de stock"
        data={data?.data ?? []}
        columns={columns}
        pagination={
          <Pagination
            pageSize={data?.page_size ?? 0}
            totalRecords={data?.total ?? 0}
            currentPage={data?.page_number ?? 0}
            onPageChange={handlePageChange}
          />
        }
      />
    </div>
  );
}

export default InventoryStocksTable;
