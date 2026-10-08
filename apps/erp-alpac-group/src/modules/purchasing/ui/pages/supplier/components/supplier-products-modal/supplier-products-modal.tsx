import { useCallback, useMemo, useState } from "react";
import {
  Button,
  DataTable,
  Dropdown,
  InputText,
  Modal,
  Pagination,
  type TableColumn,
} from "@alpac/design-system";
import { useSupplier } from "@app/modules/purchasing/ui/hooks/supplier/useSupplier";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useUnitOfMeasurement } from "@app/modules/unit-of-measurement/hooks/useUnitOfMeasurement";
import { Loader } from "@app/shared/components/loaders/loader";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import type { SupplierLinkedProduct } from "@app/modules/purchasing/domain/ApiContract/shared/supplier/supplier-product";
import {
  dropdownClassName,
  inputClassName,
  labelClassName,
} from "@app/modules/purchasing/ui/pages/supplier/utils/style";
import type { SupplierProductsModalProps } from "@app/modules/purchasing/ui/pages/supplier/components/supplier-products-modal/supplier-products-modal.types";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";

const PAGE_SIZE = 10;

type ProductFilters = {
  code: string;
  unit_measure_id: string | null;
  page_number: number;
};

const emptyFilters: ProductFilters = {
  code: "",
  unit_measure_id: null,
  page_number: 1,
};

export const SupplierProductsModal = ({
  isOpen,
  onClose,
  selectedSupplier,
}: SupplierProductsModalProps) => {
  const { companyId, moduleCode } = useUserStore();
  const [draftFilters, setDraftFilters] =
    useState<ProductFilters>(emptyFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<ProductFilters>(emptyFilters);

  const codeFilter = appliedFilters.code.trim() || undefined;
  const unitMeasureFilter = appliedFilters.unit_measure_id || undefined;

  const { GetSupplierDetails } = useSupplier({
    supplierDetailFilters:
      isOpen && selectedSupplier?.supplier_id
        ? {
            company_id: companyId,
            module_code: moduleCode,
            supplier_id: selectedSupplier.supplier_id,
            page_number: appliedFilters.page_number,
            page_size: PAGE_SIZE,
            code: codeFilter,
            unit_measure_id: unitMeasureFilter,
          }
        : undefined,
  });

  const { GetUnitMeasurements } = useUnitOfMeasurement({
    payloadUnitOfMeasurement: {
      companie_id: companyId,
      module_code: moduleCode,
    },
    enabled: isOpen,
  });

  const { data: supplierDetails, isPending, isFetching } = GetSupplierDetails;

  const productsPage = supplierDetails?.products;
  const products = productsPage?.data ?? [];
  const totalRecords = productsPage?.total ?? 0;

  const unitOptions = useMemo(() => {
    const units = GetUnitMeasurements.data;
    if (!units || !Array.isArray(units)) return [];
    return units.map((item) => ({
      value: item.unit_measure_id,
      label: item.symbol ? `${item.name} (${item.symbol})` : item.name,
    }));
  }, [GetUnitMeasurements.data]);

  const supplierName =
    supplierDetails?.supplier_legal_name ??
    selectedSupplier?.supplier_legal_name ??
    "proveedor";

  const productColumns: TableColumn<SupplierLinkedProduct>[] = useMemo(
    () => [
      {
        key: "code",
        label: "Código",
        render: (row) => row.code || "—",
      },
      { key: "product_name", label: "Producto" },
      {
        key: "unit_price",
        label: "Precio unitario",
        render: (row) => formatCurrency(row.unit_price),
      },
      {
        key: "last_price_update",
        label: "Última actualización",
        render: (row) =>
          row.last_price_update
            ? formatDateToSpanishWords(row.last_price_update)
            : "—",
      },
      {
        key: "tier_prices",
        label: "Precio preferencial",
        render: (row) => String(row.tier_prices?.length ?? 0),
      },
    ],
    [],
  );

  const handleApplyFilters = () => {
    setAppliedFilters({
      ...draftFilters,
      code: draftFilters.code.trim(),
      page_number: 1,
    });
  };

  const handleClearFilters = () => {
    setDraftFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
  };

  const handlePageChange = useCallback((page: number) => {
    setAppliedFilters((prev) => ({
      ...prev,
      page_number: page,
    }));
  }, []);

  const handleClose = () => {
    setDraftFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    onClose();
  };

  const isLoading = isOpen && (isPending || isFetching);

  return (
    <>
      {isLoading && <Loader title="Cargando productos del proveedor..." />}

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Productos del proveedor"
        variant="form"
        size="5xl"
        description={`Catálogo vinculado a ${supplierName}`}
      >
        <div className="flex flex-col gap-4">
          <form
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end"
            onSubmit={(event) => {
              event.preventDefault();
              handleApplyFilters();
            }}
          >
            <InputText
              label="Código"
              placeholder="Ej. ALP-01-001"
              className={inputClassName}
              labelClassName={labelClassName}
              value={draftFilters.code}
              onChange={(event) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  code: event.target.value,
                }))
              }
            />

            <Dropdown
              label="Unidad de medida"
              placeholder="Seleccione..."
              appearance="dark"
              options={unitOptions}
              value={draftFilters.unit_measure_id}
              onChange={(value) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  unit_measure_id:
                    value === null || value === undefined || value === ""
                      ? null
                      : String(value),
                }))
              }
              className={dropdownClassName}
              labelClassName={labelClassName}
              valueClassName={labelClassName}
              disabled={GetUnitMeasurements.isPending}
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

          <DataTable
            title="Productos vinculados"
            data={products}
            columns={productColumns}
            pagination={
              <Pagination
                currentPage={appliedFilters.page_number}
                pageSize={PAGE_SIZE}
                totalRecords={totalRecords}
                onPageChange={handlePageChange}
                disabled={isFetching}
              />
            }
          />
        </div>
      </Modal>
    </>
  );
};
