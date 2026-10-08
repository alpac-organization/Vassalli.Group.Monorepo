import {
  Alert,
  AnimatedAlertWrapper,
  Button,
  ContextMenu,
  DataTable,
  Dropdown,
  Pagination,
  type TableColumn,
} from "@alpac/design-system";
import { Loader } from "@app/shared/components/loaders/loader";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { BlocksIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useProduct } from "@app/modules/product/ui/hooks/useProduct";
import type { GetProductRequest } from "@app/modules/product/domain/ApiContract/Requests/product/get-product.request";
import type { GetProductResponse } from "@app/modules/product/domain/ApiContract/Responses/product/get-product.response";
import { useUserStore } from "@app/shared/stores/useUserStore";
import type { GetProductCategoryResponse } from "@app/modules/product/domain/ApiContract/Responses/product-category/get-product-category.response";
import { CreateProductModal } from "@app/modules/product/ui/views/create-product-modal/create-product-modal";
import { ProductDetailsModal } from "@app/modules/product/ui/views/product-details-modal/product-details-modal";
import { ProductSuppliersModal } from "@app/modules/product/ui/views/product-suppliers-modal/product-suppliers-modal";

const dropdownClassName =
  "w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";
const labelClassName = "text-black! dark:text-white!";
const contextMenuButton =
  "rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";
const PAGE_SIZE = 5;

export const Product = () => {
  const { companyId, moduleCode } = useUserStore();
  const {
    alertState,
    handleCloseAlert,
    handleRequestError,
    handleRequestSuccess,
  } = useAlertState();

  const [isCreateProductModalOpen, setIsCreateProductModalOpen] =
    useState(false);
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false);
  const [isProductSuppliersOpen, setIsProductSuppliersOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<GetProductResponse | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [filters, setFilters] = useState<GetProductRequest>({
    company_id: companyId,
    module_code: moduleCode,
    category_product_id: "",
    page_number: 1,
    page_size: PAGE_SIZE,
  });

  const { GetProductCategories, GetProducts } = useProduct({
    getProductPayload: {
      ...filters,
      company_id: companyId,
      module_code: moduleCode,
      page_size: PAGE_SIZE,
    },
    getProductCategoryPayload: {
      company_id: companyId,
      module_code: moduleCode,
    },
  });

  const products = GetProducts.data?.data ?? [];
  const totalRecords = GetProducts.data?.total ?? 0;
  const currentPage = filters.page_number ?? 1;
  const isLoadingProducts = GetProducts.isPending || GetProducts.isFetching;

  const productCategories = useMemo(() => {
    if (
      !GetProductCategories.data ||
      !Array.isArray(GetProductCategories.data)
    ) {
      return [];
    }

    const categories: GetProductCategoryResponse[] = GetProductCategories.data;
    return categories.map((item) => ({
      value: item.id,
      label: item.name,
    }));
  }, [GetProductCategories.data]);

  const handleApplyFilters = () => {
    setFilters({
      company_id: companyId,
      module_code: moduleCode,
      category_product_id: categoryId || "",
      page_number: 1,
      page_size: PAGE_SIZE,
    });
  };

  const handleClearFilters = () => {
    setCategoryId("");
    setFilters({
      company_id: companyId,
      module_code: moduleCode,
      category_product_id: "",
      page_number: 1,
      page_size: PAGE_SIZE,
    });
  };

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({
      ...prev,
      page_number: page,
      page_size: PAGE_SIZE,
    }));
  }, []);

  const onViewDetails = (row: GetProductResponse) => {
    setSelectedProduct(row);
    setIsProductDetailsOpen(true);
  };

  const onViewSuppliers = (row: GetProductResponse) => {
    setSelectedProduct(row);
    setIsProductSuppliersOpen(true);
  };

  const columnConfig: TableColumn<GetProductResponse>[] = useMemo(
    () => [
      {
        key: "code",
        label: "Código",
        render: (row) => row.code || "—",
      },
      { key: "product_name", label: "Producto" },
      { key: "description", label: "Descripción" },
      {
        key: "category",
        label: "Categoría",
        render: (row) => row.category?.name ?? "—",
      },
      {
        key: "suppliers_count",
        label: "Proveedores",
        render: (row) => String(row.suppliers_count ?? 0),
      },
      {
        key: "actions",
        label: "Acciones",
        render: (row) => (
          <ContextMenu
            triggerClassName={contextMenuButton}
            items={[
              { label: "Ver detalle", onClick: () => onViewDetails(row) },
              {
                label: "Ver proveedores",
                onClick: () => onViewSuppliers(row),
              },
            ]}
          />
        ),
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-4">
      {isLoadingProducts && <Loader title="Cargando productos..." />}

      <div className="w-full flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:justify-start">
        <Button
          type="button"
          size="giant"
          label="Registrar Producto"
          icon={<BlocksIcon size={20} />}
          className="w-full! md:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
          onClick={() => setIsCreateProductModalOpen(true)}
        />
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
        <div className="flex flex-col justify-center">
          <h3 className="p-0! m-0!">Filtros</h3>
          <small className="text-gray-500 dark:text-gray-300">
            Filtre la lista de productos
          </small>
        </div>
      </div>

      <form
        onSubmit={(evt) => {
          evt.preventDefault();
          handleApplyFilters();
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-end"
      >
        <Dropdown
          label="Categoría"
          placeholder={
            GetProductCategories.isPending || GetProductCategories.isFetching
              ? "Cargando categorías..."
              : "Seleccione..."
          }
          appearance="dark"
          options={productCategories}
          value={categoryId}
          onChange={(value) => setCategoryId(String(value ?? ""))}
          className={dropdownClassName}
          labelClassName={labelClassName}
          valueClassName={labelClassName}
        />

        <Button
          type="submit"
          size="giant"
          label="Aplicar filtros"
          className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
        />

        <Button
          type="button"
          size="giant"
          label="Limpiar filtros"
          onClick={handleClearFilters}
          className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
        />
      </form>

      <div className="flex flex-col">
        <DataTable
          title="Lista de productos"
          data={products}
          columns={columnConfig}
          pagination={
            <Pagination
              currentPage={currentPage}
              pageSize={PAGE_SIZE}
              totalRecords={totalRecords}
              onPageChange={handlePageChange}
              disabled={GetProducts.isFetching}
            />
          }
        />
      </div>

      <CreateProductModal
        isOpen={isCreateProductModalOpen}
        onClose={() => setIsCreateProductModalOpen(false)}
        onRequestSuccess={handleRequestSuccess}
        onRequestError={handleRequestError}
      />

      <ProductDetailsModal
        isOpen={isProductDetailsOpen}
        onClose={() => {
          setIsProductDetailsOpen(false);
          setSelectedProduct(null);
        }}
        selectedProduct={selectedProduct}
      />

      <ProductSuppliersModal
        isOpen={isProductSuppliersOpen}
        onClose={() => {
          setIsProductSuppliersOpen(false);
          setSelectedProduct(null);
        }}
        selectedProduct={selectedProduct}
        onRequestSuccess={handleRequestSuccess}
        onRequestError={handleRequestError}
      />

      <AnimatedAlertWrapper open={alertState?.open ?? false}>
        <Alert
          type={alertState?.type!}
          title={alertState?.title}
          message={alertState?.message!}
          onClose={handleCloseAlert}
        />
      </AnimatedAlertWrapper>
    </div>
  );
};
