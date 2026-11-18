import { Badges, Button, Modal } from "@alpac/design-system";
import {
  BuildingIcon,
  CalendarIcon,
  InfoIcon,
  NotebookTextIcon,
  PackagePlusIcon,
  UserIcon,
} from "lucide-react";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import { resolvePurchaseOrderStatusBadge } from "@app/modules/purchasing/ui/pages/purchase-order/utils/purchase-order-status.variants";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";

import type { ProcessInventoryEntryModalProps } from "./process-inventory-entry-modal.types";

const sectionTitleClassName =
  "m-0 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-200";

const summaryCardClassName =
  "rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-neutral-600 dark:bg-[#303846]";

const summaryValue = (value?: string | null) => value?.trim() || "—";

export const ProcessInventoryEntryModal = function (
  props: ProcessInventoryEntryModalProps,
) {
  const { isOpen, order, isLoading = false, onClose, onConfirm } = props;

  const statusVariant = resolvePurchaseOrderStatusBadge(order?.status);

  const handleClose = () => {
    if (!isLoading) onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Procesar entrada de inventario"
      description="Revisa la información antes de confirmar la acción."
      variant="default"
      size="2xl"
      panelClassName="flex max-h-[min(94dvh,50rem)] flex-col rounded-xl sm:!rounded-2xl !p-4 sm:!p-6"
      contentClassName="flex min-h-0 flex-1 flex-col overflow-y-auto"
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300">
            <PackagePlusIcon size={20} />
          </span>
          <div className="flex flex-col gap-1">
            <p className="m-0 text-sm font-semibold text-amber-800 dark:text-amber-200">
              Vas a procesar una orden de compra
            </p>
            <p className="m-0 text-sm text-amber-700 dark:text-amber-300/90">
              Se creará una entrada de inventario en estado pendiente con los
              productos, la cotización aprobada y el proveedor seleccionado.
            </p>
          </div>
        </div>

        <section className={summaryCardClassName}>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2 dark:border-neutral-600">
            <h4 className={sectionTitleClassName}>Resumen de la orden</h4>
            <Badges
              label={statusVariant.label || "—"}
              color={statusVariant.badgeColor}
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailField
              label="Orden"
              value={summaryValue(order?.purchase_order_code)}
              icon={<NotebookTextIcon size={18} />}
            />
            <DetailField
              label="Proveedor"
              value={summaryValue(order?.supplier_name)}
              icon={<UserIcon size={18} />}
            />
            <DetailField
              label="Solicitud"
              value={summaryValue(order?.purchase_request?.code)}
              icon={<BuildingIcon size={18} />}
            />
            <DetailField
              label="Enviado a revisión"
              value={summaryValue(
                order?.sent_to_review_at
                  ? formatDateToSpanishWords(order.sent_to_review_at)
                  : null,
              )}
              icon={<CalendarIcon size={18} />}
            />
          </div>
        </section>

        <div className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-600 dark:border-neutral-600 dark:bg-[#272b34] dark:text-slate-300">
          <InfoIcon
            size={18}
            className="mt-0.5 shrink-0 text-slate-400 dark:text-slate-400"
          />
          <span>
            El stock no se modificará hasta que esa entrada pendiente sea
            confirmada/recibida.
          </span>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end dark:border-neutral-600">
          <Button
            label="Cancelar"
            size="giant"
            onClick={handleClose}
            disabled={isLoading}
            className="w-full! sm:w-auto! rounded-md! bg-slate-500! text-white! hover:bg-slate-600! dark:bg-slate-700! dark:hover:bg-slate-600!"
          />
          <Button
            label="Procesar"
            size="giant"
            onClick={onConfirm}
            isLoading={isLoading}
            disabled={isLoading}
            className="w-full! sm:w-auto! rounded-md! bg-blue-600! text-white! hover:bg-blue-700!"
          />
        </div>
      </div>
    </Modal>
  );
};
