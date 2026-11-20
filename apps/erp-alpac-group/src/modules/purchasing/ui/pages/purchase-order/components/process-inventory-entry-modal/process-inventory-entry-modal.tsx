import { Badges, Button, Modal } from "@alpac/design-system";
import { PackagePlusIcon } from "lucide-react";

import { resolvePurchaseOrderStatusBadge } from "@app/modules/purchasing/ui/pages/purchase-order/utils/purchase-order-status.variants";

import { DocumentCodeBadges } from "./components/document-code-badges/document-code-badges";
import { ModalSection } from "./components/modal-section/modal-section";
import { OrderProductsState } from "./components/order-products-state/order-products-state";
import { OrderProductsTable } from "./components/order-products-table/order-products-table";
import { OrderSummary } from "./components/order-summary/order-summary";
import { useProcessInventoryEntryModalData } from "./hooks/useProcessInventoryEntryModalData";

import type { ProcessInventoryEntryModalProps } from "./process-inventory-entry-modal.types";

export const ProcessInventoryEntryModal = function (
  props: ProcessInventoryEntryModalProps,
) {
  const { isOpen, order, isLoading = false, onClose, onConfirm } = props;

  const {
    products,
    documentBadges,
    summary,
    isLoading: isDetailLoading,
    isError,
    errorMessage,
    refetch,
  } = useProcessInventoryEntryModalData({ isOpen, order });

  const statusVariant = resolvePurchaseOrderStatusBadge(order?.status);
  const hasProducts = products.rows.length > 0;
  const isProcessDisabled =
    isLoading || isDetailLoading || isError || !hasProducts;

  const handleClose = () => {
    if (isLoading) return;
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Procesar entrada de inventario"
      description="Revisa la orden de compra antes de confirmar."
      variant="default"
      size="7xl"
      panelClassName="rounded-xl sm:!rounded-2xl !p-4 sm:!p-6"
    >
      <div
        className="flex flex-col gap-4"
        aria-busy={isLoading || isDetailLoading}
      >
        <header className="shrink-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-[#303846]">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-alpac-primary-50 text-alpac-primary-600 ring-1 ring-alpac-primary-100 dark:bg-alpac-primary-500/15 dark:text-alpac-primary-300 dark:ring-alpac-primary-500/30">
              <PackagePlusIcon size={20} aria-hidden />
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="m-0! mt-0! text-base font-semibold leading-tight text-slate-900 dark:text-white">
                  Entrada de inventario
                </h3>
                <Badges
                  label={statusVariant.label || "—"}
                  color={statusVariant.badgeColor}
                />
              </div>

              <p className="m-0 mt-1 truncate text-sm text-slate-600 dark:text-slate-300">
                {summary.supplierName}
                <span className="mx-1.5 text-slate-300 dark:text-neutral-500">
                  ·
                </span>
                {summary.requestCode}
              </p>
            </div>
          </div>

          <div className="mt-3 border-t border-slate-200 pt-3 dark:border-neutral-700">
            <DocumentCodeBadges badges={documentBadges} />
          </div>
        </header>

        {isDetailLoading ? (
          <OrderProductsState variant="loading" />
        ) : isError ? (
          <OrderProductsState
            variant="error"
            message={errorMessage ?? undefined}
            onRetry={() => void refetch()}
          />
        ) : (
          <>
            <OrderSummary summary={summary} />

            {hasProducts ? (
              <OrderProductsTable
                rows={products.rows}
                hasMixedCurrency={products.hasMixedCurrency}
              />
            ) : (
              <ModalSection
                title="Productos"
                icon={<PackagePlusIcon size={16} aria-hidden />}
              >
                <OrderProductsState
                  variant="empty"
                  message="Esta orden no tiene productos para procesar."
                />
              </ModalSection>
            )}
          </>
        )}

        <footer className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-3 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-700">
          <p className="m-0 text-xs text-slate-500 dark:text-slate-400">
            El stock se actualizará al confirmar la entrada.
          </p>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              label="Cancelar"
              size="giant"
              onClick={handleClose}
              disabled={isLoading}
              className="w-full! rounded-md! border! border-slate-300! bg-white! text-slate-700! hover:bg-slate-50! sm:w-auto! dark:border-neutral-600! dark:bg-neutral-800! dark:text-slate-200! dark:hover:bg-neutral-700!"
            />
            <Button
              type="button"
              label="Procesar"
              size="giant"
              onClick={onConfirm}
              isLoading={isLoading}
              disabled={isProcessDisabled}
              className="w-full! rounded-md! bg-alpac-primary-500! text-white! hover:bg-alpac-primary-600! sm:w-auto! dark:bg-alpac-primary-700! dark:hover:bg-alpac-primary-600!"
            />
          </div>
        </footer>
      </div>
    </Modal>
  );
};
