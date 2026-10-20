import { lazy, Suspense, useMemo } from "react";
import { Button, Modal, Tabs, type TabItem } from "@alpac/design-system";
import { Loader } from "@app/shared/components/loaders/loader";
import { SupplierBankAccountsTab } from "@app/modules/purchasing/ui/pages/supplier/components/supplier-modal/supplier-bank-accounts-tab";
import { SupplierCommercialTab } from "@app/modules/purchasing/ui/pages/supplier/components/supplier-modal/supplier-commercial-tab";
import { SupplierGeneralTab } from "@app/modules/purchasing/ui/pages/supplier/components/supplier-modal/supplier-general-tab";
import type { SupplierModalProps } from "@app/modules/purchasing/ui/pages/supplier/components/supplier-modal/supplier-modal.types";
import { useDeferredUnmount } from "@app/modules/purchasing/ui/pages/supplier/hooks/use-deferred-unmount";
import {
  useSupplierModalSession,
  type SupplierModalTab,
} from "@app/modules/purchasing/ui/pages/supplier/components/supplier-modal/use-supplier-modal-session";

const SupplierProductsTab = lazy(() =>
  import("./supplier-products-tab").then((module) => ({
    default: module.SupplierProductsTab,
  })),
);

const SelectProductModal = lazy(() =>
  import(
    "@app/modules/product/ui/views/select-product-modal/select-product-modal"
  ).then((module) => ({
    default: module.SelectProductModal,
  })),
);

export const SupplierModal = ({
  isOpen,
  onClose,
  onSubmit,
  onRequestError,
  onRequestSuccess,
  selectedSupplier,
}: SupplierModalProps) => {
  const session = useSupplierModalSession({
    isOpen,
    onClose,
    onSubmit,
    onRequestError,
    onRequestSuccess,
    selectedSupplier,
  });
  const shouldRenderProductPicker = useDeferredUnmount(
    session.isSelectProductOpen,
  );

  const tabItems = useMemo<TabItem<string>[]>(
    () => [
      {
        id: "general",
        label: session.hasGeneralErrors
          ? "Datos Generales (!)"
          : "Datos Generales",
        render: () => (
          <SupplierGeneralTab
            control={session.control}
            register={session.register}
            setValue={session.setValue}
            clearErrors={session.clearErrors}
            errors={session.errors}
            trackField={session.trackField}
            trackDetailField={session.trackDetailField}
          />
        ),
      },
      {
        id: "commercial",
        label: session.hasCommercialErrors
          ? "Condiciones y Régimen Fiscal (!)"
          : "Condiciones y Régimen Fiscal",
        render: () => (
          <SupplierCommercialTab
            control={session.control}
            register={session.register}
            setValue={session.setValue}
            getValues={session.getValues}
            errors={session.errors}
            isEditMode={session.isEditMode}
            trackField={session.trackField}
            trackDetailField={session.trackDetailField}
            trackMultipleDetailFields={session.trackMultipleDetailFields}
          />
        ),
      },
      {
        id: "products",
        label: `Productos (${session.productLinks.length})`,
        render: () => (
          <Suspense
            fallback={
              <p className="text-sm text-slate-500 dark:text-slate-300">
                Cargando productos...
              </p>
            }
          >
            <SupplierProductsTab
              companyId={session.companyId}
              moduleCode={session.moduleCode}
              items={session.productLinks}
              onChange={session.handleProductLinksChange}
              onAddClick={() => session.setIsSelectProductOpen(true)}
              disabled={session.isSubmitting}
            />
          </Suspense>
        ),
      },
      {
        id: "bank_accounts",
        label: `Cuentas Bancarias (${session.currentBankAccounts.length})`,
        render: () => (
          <SupplierBankAccountsTab
            isEditMode={session.isEditMode}
            accounts={session.currentBankAccounts}
            companyId={session.companyId}
            moduleCode={session.moduleCode}
            supplierId={session.supplierId}
            setLocalBankAccounts={session.setLocalBankAccounts}
            createBankAccount={session.CreateBankAccount}
            updateBankAccount={session.UpdateBankAccount}
            deleteBankAccount={session.DeleteBankAccount}
            onRequestSuccess={session.onRequestSuccess}
            onRequestError={session.onRequestError}
            getMappedError={session.getMappedError}
          />
        ),
      },
    ],
    [session],
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={session.handleClose}
        title={
          session.isEditMode
            ? "Actualizar proveedor"
            : "Registro de nuevo proveedor"
        }
        variant="form"
        size="5xl"
        description={
          session.isEditMode
            ? "Modifique la información general, financiera y cuentas bancarias del proveedor"
            : "Complete los datos del proveedor y configure sus cuentas bancarias"
        }
      >
        {session.isEditMode && session.isSupplierDetailsPending ? (
          <Loader title="Cargando detalle del proveedor..." />
        ) : null}

        <form
          className="flex min-w-0 flex-col gap-6"
          onSubmit={session.handleSubmit(session.handleSupplier)}
        >
          <Tabs
            key={isOpen ? "open" : "closed"}
            tabItems={tabItems}
            activeTab={session.activeTab}
            animation="slide"
            onTabChange={(id) => session.setActiveTab(id as SupplierModalTab)}
          />

          <div className="border-t border-t-slate-300 dark:border-t-neutral-600 -mx-6 pt-4" />

          <div className="flex min-w-0 flex-col-reverse gap-2.5 sm:flex-row sm:justify-end sm:gap-3">
            <Button
              type="button"
              size="giant"
              label="Cancelar"
              onClick={session.handleClose}
              className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-white! dark:bg-transparent! text-slate-700! dark:text-slate-300! border! border-slate-300! dark:border-slate-600! hover:bg-slate-50! dark:hover:bg-slate-700/30! sm:w-auto!"
            />
            <Button
              type="submit"
              size="giant"
              label="Guardar"
              className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! sm:w-auto!"
              disabled={session.isSubmitting}
              isLoading={session.isSubmitting}
            />
          </div>
        </form>
      </Modal>

      {shouldRenderProductPicker ? (
        <Suspense fallback={null}>
          <SelectProductModal
            isOpen={session.isSelectProductOpen}
            onClose={() => session.setIsSelectProductOpen(false)}
            onSelect={session.handleSelectProducts}
            selectionType="multiple"
            excludeProductIds={session.assignedProductIds}
            description="Elija uno o más productos registrados para vincularlos al proveedor."
          />
        </Suspense>
      ) : null}
    </>
  );
};
