import { lazy, Suspense, useMemo } from "react";
import { Button, Modal, Tabs, type TabItem } from "@alpac/design-system";
import { Loader } from "@app/shared/components/loaders/loader";
import { SupplierBankAccountsTab } from "@app/modules/purchasing/ui/pages/supplier/components/supplier-modal/supplier-bank-accounts-tab";
import { SupplierCommercialTab } from "@app/modules/purchasing/ui/pages/supplier/components/supplier-modal/supplier-commercial-tab";
import { SupplierGeneralTab } from "@app/modules/purchasing/ui/pages/supplier/components/supplier-modal/supplier-general-tab";
import type { SupplierModalProps } from "@app/modules/purchasing/ui/pages/supplier/components/supplier-modal/supplier-modal.types";
import { useDeferredUnmount } from "@app/modules/purchasing/ui/pages/supplier/hooks/use-deferred-unmount";
import { useSupplierModalSession } from "@app/modules/purchasing/ui/pages/supplier/components/supplier-modal/use-supplier-modal-session";

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
  const {
    companyId,
    moduleCode,
    supplierId,
    isEditMode,
    activeTab,
    handleTabChange,
    isSubmitting,
    isSupplierDetailsPending,
    hasGeneralErrors,
    hasCommercialErrors,
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    clearErrors,
    errors,
    trackField,
    trackDetailField,
    trackMultipleDetailFields,
    handleSupplier,
    handleClose,
    productLinks,
    handleProductLinksChange,
    currentBankAccounts,
    setLocalBankAccounts,
    CreateBankAccount,
    UpdateBankAccount,
    DeleteBankAccount,
    getMappedError,
    isSelectProductOpen,
    openProductPicker,
    closeProductPicker,
    handleSelectProducts,
    assignedProductIds,
    onRequestSuccess: notifySuccess,
    onRequestError: notifyError,
  } = useSupplierModalSession({
    isOpen,
    onClose,
    onSubmit,
    onRequestError,
    onRequestSuccess,
    selectedSupplier,
  });
  const shouldRenderProductPicker = useDeferredUnmount(isSelectProductOpen);
  const productCount = productLinks.length;
  const bankAccountCount = currentBankAccounts.length;

  const tabItems = useMemo<TabItem<string>[]>(
    () => [
      {
        id: "general",
        label: hasGeneralErrors ? "Datos Generales (!)" : "Datos Generales",
        render: () => (
          <SupplierGeneralTab
            control={control}
            register={register}
            setValue={setValue}
            clearErrors={clearErrors}
            errors={errors}
            trackField={trackField}
            trackDetailField={trackDetailField}
          />
        ),
      },
      {
        id: "commercial",
        label: hasCommercialErrors
          ? "Condiciones y Régimen Fiscal (!)"
          : "Condiciones y Régimen Fiscal",
        render: () => (
          <SupplierCommercialTab
            control={control}
            register={register}
            setValue={setValue}
            getValues={getValues}
            errors={errors}
            isEditMode={isEditMode}
            trackField={trackField}
            trackDetailField={trackDetailField}
            trackMultipleDetailFields={trackMultipleDetailFields}
          />
        ),
      },
      {
        id: "products",
        label: `Productos (${productCount})`,
        render: () => (
          <Suspense
            fallback={
              <p className="text-sm text-slate-500 dark:text-slate-300">
                Cargando productos...
              </p>
            }
          >
            <SupplierProductsTab
              companyId={companyId}
              moduleCode={moduleCode}
              items={productLinks}
              onChange={handleProductLinksChange}
              onAddClick={openProductPicker}
              disabled={isSubmitting}
            />
          </Suspense>
        ),
      },
      {
        id: "bank_accounts",
        label: `Cuentas Bancarias (${bankAccountCount})`,
        render: () => (
          <SupplierBankAccountsTab
            isEditMode={isEditMode}
            accounts={currentBankAccounts}
            companyId={companyId}
            moduleCode={moduleCode}
            supplierId={supplierId}
            setLocalBankAccounts={setLocalBankAccounts}
            createBankAccount={CreateBankAccount}
            updateBankAccount={UpdateBankAccount}
            deleteBankAccount={DeleteBankAccount}
            onRequestSuccess={notifySuccess}
            onRequestError={notifyError}
            getMappedError={getMappedError}
          />
        ),
      },
    ],
    [
      hasGeneralErrors,
      hasCommercialErrors,
      productCount,
      bankAccountCount,
      isEditMode,
      isSubmitting,
      control,
      register,
      setValue,
      getValues,
      clearErrors,
      errors,
      trackField,
      trackDetailField,
      trackMultipleDetailFields,
      companyId,
      moduleCode,
      productLinks,
      handleProductLinksChange,
      openProductPicker,
      supplierId,
      currentBankAccounts,
      setLocalBankAccounts,
      CreateBankAccount,
      UpdateBankAccount,
      DeleteBankAccount,
      notifySuccess,
      notifyError,
      getMappedError,
    ],
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={isEditMode ? "Actualizar proveedor" : "Registro de nuevo proveedor"}
        variant="form"
        size="5xl"
        description={
          isEditMode
            ? "Modifique la información general, financiera y cuentas bancarias del proveedor"
            : "Complete los datos del proveedor y configure sus cuentas bancarias"
        }
      >
        {isEditMode && isSupplierDetailsPending ? (
          <Loader title="Cargando detalle del proveedor..." />
        ) : null}

        <form
          className="flex min-w-0 flex-col gap-6"
          onSubmit={handleSubmit(handleSupplier)}
        >
          <Tabs
            key={isOpen ? "open" : "closed"}
            tabItems={tabItems}
            activeTab={activeTab}
            animation="slide"
            onTabChange={handleTabChange}
          />

          <div className="border-t border-t-slate-300 dark:border-t-neutral-600 -mx-6 pt-4" />

          <div className="flex min-w-0 flex-col-reverse gap-2.5 sm:flex-row sm:justify-end sm:gap-3">
            <Button
              type="button"
              size="giant"
              label="Cancelar"
              onClick={handleClose}
              className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-white! dark:bg-transparent! text-slate-700! dark:text-slate-300! border! border-slate-300! dark:border-slate-600! hover:bg-slate-50! dark:hover:bg-slate-700/30! sm:w-auto!"
            />
            <Button
              type="submit"
              size="giant"
              label="Guardar"
              className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! sm:w-auto!"
              disabled={isSubmitting}
              isLoading={isSubmitting}
            />
          </div>
        </form>
      </Modal>

      {shouldRenderProductPicker ? (
        <Suspense fallback={null}>
          <SelectProductModal
            isOpen={isSelectProductOpen}
            onClose={closeProductPicker}
            onSelect={handleSelectProducts}
            selectionType="multiple"
            excludeProductIds={assignedProductIds}
            description="Elija uno o más productos registrados para vincularlos al proveedor."
          />
        </Suspense>
      ) : null}
    </>
  );
};
