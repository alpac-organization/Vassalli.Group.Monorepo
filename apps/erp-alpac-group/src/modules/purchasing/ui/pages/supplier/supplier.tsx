import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import { Alert, AnimatedAlertWrapper, Button } from "@alpac/design-system";
import { PackagePlusIcon } from "lucide-react";
import { RoleEnum } from "@app/core/enums/role.enum";
import type { GetSuppliersResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/get-suppliers-response";
import { useSuppliersList } from "@app/modules/purchasing/ui/hooks/supplier/useSupplier";
import { SupplierFilters } from "@app/modules/purchasing/ui/pages/supplier/components/supplier-filters/supplier-filters";
import { SupplierTable } from "@app/modules/purchasing/ui/pages/supplier/components/supplier-table/supplier-table";
import { useDeferredUnmount } from "@app/modules/purchasing/ui/pages/supplier/hooks/use-deferred-unmount";
import type {
  SupplierFilterValues,
  SupplierListFilters,
} from "@app/modules/purchasing/ui/pages/supplier/supplier.types";
import { Loader } from "@app/shared/components/loaders/loader";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useUserStore } from "@app/shared/stores/useUserStore";

const PAGE_SIZE = 5;

const EMPTY_SUPPLIERS: GetSuppliersResponse[] = [];

const addSupplierIcon = <PackagePlusIcon size={20} />;

const initialFilters: SupplierListFilters = { page_number: 1 };

const SupplierModal = lazy(() =>
  import("./components/supplier-modal/supplier-modal").then((module) => ({
    default: module.SupplierModal,
  })),
);

const SupplierDetailsModal = lazy(() =>
  import("./components/supplier-details-modal/supplier-details-modal").then(
    (module) => ({
      default: module.SupplierDetailsModal,
    }),
  ),
);

const SupplierExclusiveStatusModal = lazy(() =>
  import(
    "./components/supplier-exclusive-status-modal/supplier-exclusive-status-modal"
  ).then((module) => ({
    default: module.SupplierExclusiveStatusModal,
  })),
);

const SupplierProductsModal = lazy(() =>
  import("./components/supplier-products-modal/supplier-products-modal").then(
    (module) => ({
      default: module.SupplierProductsModal,
    }),
  ),
);

let supplierModalPreloaded = false;

const preloadSupplierModal = () => {
  if (supplierModalPreloaded) return;
  supplierModalPreloaded = true;
  void import("./components/supplier-modal/supplier-modal");
};

export const Supplier = () => {
  const companyId = useUserStore((state) => state.companyId);
  const moduleCode = useUserStore((state) => state.moduleCode);
  const isAdministrator = useUserStore(
    (state) => state.role === RoleEnum.ADMINISTRATOR,
  );

  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [isSupplierDetailModalOpen, setIsSupplierDetailModalOpen] =
    useState(false);
  const [isExclusiveStatusModalOpen, setIsExclusiveStatusModalOpen] =
    useState(false);
  const [isSupplierProductsModalOpen, setIsSupplierProductsModalOpen] =
    useState(false);
  const [selectedSupplier, setSelectedSupplier] =
    useState<GetSuppliersResponse | null>(null);
  const [filters, setFilters] = useState<SupplierListFilters>(initialFilters);

  const {
    alertState,
    handleCloseAlert,
    handleRequestError,
    handleRequestSuccess,
  } = useAlertState();

  const suppliersQueryFilters = useMemo(
    () => ({
      ...filters,
      company_id: companyId,
      module_code: moduleCode,
      page_size: PAGE_SIZE,
    }),
    [companyId, filters, moduleCode],
  );

  const suppliersQuery = useSuppliersList(suppliersQueryFilters);
  const suppliers = suppliersQuery.data?.data ?? EMPTY_SUPPLIERS;
  const totalRecords = suppliersQuery.data?.total ?? 0;
  const currentPage = filters.page_number;

  const shouldRenderSupplierModal = useDeferredUnmount(isSupplierModalOpen);
  const shouldRenderSupplierDetailModal = useDeferredUnmount(
    isSupplierDetailModalOpen,
  );
  const shouldRenderExclusiveStatusModal = useDeferredUnmount(
    isExclusiveStatusModalOpen,
  );
  const shouldRenderSupplierProductsModal = useDeferredUnmount(
    isSupplierProductsModalOpen,
  );

  const handleApplyFilters = useCallback((next: SupplierFilterValues) => {
    setFilters({
      page_number: 1,
      ...next,
    });
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((current) => ({
      ...current,
      page_number: page,
    }));
  }, []);

  const openCreateSupplier = useCallback(() => {
    setSelectedSupplier(null);
    setIsSupplierModalOpen(true);
  }, []);

  const onEditSupplier = useCallback((row: GetSuppliersResponse) => {
    setSelectedSupplier(row);
    setIsSupplierModalOpen(true);
  }, []);

  const onViewDetails = useCallback((row: GetSuppliersResponse) => {
    setSelectedSupplier(row);
    setIsSupplierDetailModalOpen(true);
  }, []);

  const onManageExclusivity = useCallback((row: GetSuppliersResponse) => {
    setSelectedSupplier(row);
    setIsExclusiveStatusModalOpen(true);
  }, []);

  const onViewProducts = useCallback((row: GetSuppliersResponse) => {
    setSelectedSupplier(row);
    setIsSupplierProductsModalOpen(true);
  }, []);

  const closeSupplierModal = useCallback(() => {
    setIsSupplierModalOpen(false);
    setSelectedSupplier(null);
  }, []);

  const closeSupplierDetailModal = useCallback(() => {
    setIsSupplierDetailModalOpen(false);
    setSelectedSupplier(null);
  }, []);

  const closeExclusiveStatusModal = useCallback(() => {
    setIsExclusiveStatusModalOpen(false);
    setSelectedSupplier(null);
  }, []);

  const closeSupplierProductsModal = useCallback(() => {
    setIsSupplierProductsModalOpen(false);
    setSelectedSupplier(null);
  }, []);

  const handleExclusiveStatusSuccess = useCallback(
    (message: string) => {
      setIsExclusiveStatusModalOpen(false);
      setSelectedSupplier(null);
      handleRequestSuccess(message);
    },
    [handleRequestSuccess],
  );

  return (
    <div className="flex flex-col gap-4">
      {suppliersQuery.isPending ? (
        <Loader title="Cargando proveedores..." />
      ) : null}

      <div className="w-full flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:justify-start">
        <div
          className="w-full md:w-auto"
          onMouseEnter={preloadSupplierModal}
          onFocusCapture={preloadSupplierModal}
        >
          <Button
            type="button"
            size="giant"
            label="Agregar Proveedor"
            icon={addSupplierIcon}
            className="w-full! md:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
            onClick={openCreateSupplier}
          />
        </div>
      </div>

      <SupplierFilters
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      <SupplierTable
        suppliers={suppliers}
        totalRecords={totalRecords}
        currentPage={currentPage}
        pageSize={PAGE_SIZE}
        isFetching={suppliersQuery.isFetching}
        isAdministrator={isAdministrator}
        onPageChange={handlePageChange}
        onEdit={onEditSupplier}
        onViewDetails={onViewDetails}
        onViewProducts={onViewProducts}
        onManageExclusivity={onManageExclusivity}
      />

      <Suspense fallback={<Loader title="Cargando..." />}>
        {shouldRenderSupplierModal ? (
          <SupplierModal
            isOpen={isSupplierModalOpen}
            onClose={closeSupplierModal}
            onSubmit={closeSupplierModal}
            onRequestSuccess={handleRequestSuccess}
            onRequestError={handleRequestError}
            selectedSupplier={selectedSupplier}
          />
        ) : null}

        {shouldRenderSupplierDetailModal ? (
          <SupplierDetailsModal
            isOpen={isSupplierDetailModalOpen}
            onClose={closeSupplierDetailModal}
            selectedSupplier={selectedSupplier}
          />
        ) : null}

        {shouldRenderExclusiveStatusModal ? (
          <SupplierExclusiveStatusModal
            isOpen={isExclusiveStatusModalOpen}
            onClose={closeExclusiveStatusModal}
            selectedSupplier={selectedSupplier}
            onRequestSuccess={handleExclusiveStatusSuccess}
            onRequestError={handleRequestError}
          />
        ) : null}

        {shouldRenderSupplierProductsModal ? (
          <SupplierProductsModal
            isOpen={isSupplierProductsModalOpen}
            onClose={closeSupplierProductsModal}
            selectedSupplier={selectedSupplier}
            onRequestSuccess={handleRequestSuccess}
            onRequestError={handleRequestError}
          />
        ) : null}
      </Suspense>

      <AnimatedAlertWrapper open={alertState?.open ?? false}>
        {alertState ? (
          <Alert
            type={alertState.type}
            title={alertState.title}
            message={alertState.message}
            onClose={handleCloseAlert}
          />
        ) : null}
      </AnimatedAlertWrapper>
    </div>
  );
};
