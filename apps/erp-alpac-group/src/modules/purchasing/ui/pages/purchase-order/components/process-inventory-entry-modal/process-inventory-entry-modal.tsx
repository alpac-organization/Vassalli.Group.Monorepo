import { memo, useCallback, useState } from "react";
import { Badges, Button, Modal } from "@alpac/design-system";
import {
  ArrowDownIcon,
  CalendarIcon,
  ClipboardListIcon,
  FileTextIcon,
  FlagIcon,
  MessageSquareIcon,
  PackageCheckIcon,
  PackagePlusIcon,
  StoreIcon,
} from "lucide-react";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import { resolvePurchaseOrderStatusBadge } from "@app/modules/purchasing/ui/pages/purchase-order/utils/purchase-order-status.variants";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";

import type { ProcessInventoryEntryModalProps } from "./process-inventory-entry-modal.types";
import { FlowStep } from "./components/flow-step/flow-step";
import { SenderInfo } from "./components/sender-info/sender-info";

/* -------------------------------------------------------------------------- */
/* Constantes y helpers (fuera del componente: no se recrean en cada render)   */
/* -------------------------------------------------------------------------- */

type PriorityConfig = { label: string; className: string };

const PRIORITY_CONFIG = {
  Critical: {
    label: "Crítica",
    className:
      "bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/30",
  },
  High: {
    label: "Alta",
    className:
      "bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:ring-orange-500/30",
  },
  Medium: {
    label: "Media",
    className:
      "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30",
  },
  Low: {
    label: "Baja",
    className:
      "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-500/10 dark:text-slate-300 dark:ring-slate-500/30",
  },
} satisfies Record<string, PriorityConfig>;

const resolvePriority = (level?: string | null): PriorityConfig | undefined =>
  level ? (PRIORITY_CONFIG as Record<string, PriorityConfig>)[level] : undefined;

const EMPTY_VALUE = "—";
const summaryValue = (value?: string | null) => value?.trim() || EMPTY_VALUE;


/** Scroll fino y discreto; solo aparece si el contenido realmente desborda. */
const thinScrollbarClassName =
  "[scrollbar-width:thin] [scrollbar-color:var(--color-slate-300)_transparent] dark:[scrollbar-color:var(--color-neutral-600)_transparent]";


export const ProcessInventoryEntryModal = function (props: ProcessInventoryEntryModalProps) {
   const { isOpen, order, isLoading = false, onClose, onConfirm } = props;

   const statusVariant = resolvePurchaseOrderStatusBadge(order?.status);
   const priority = resolvePriority(order?.purchase_request?.priority_level);
   const sender = order?.sent_by_user_information;
   const comments = order?.comments?.trim();

   const sentToReview = order?.sent_to_review_at
      ? formatDateToSpanishWords(order.sent_to_review_at)
      : null;

   const handleClose = useCallback(() => {
      if (!isLoading) onClose();
   }, [isLoading, onClose]);

   return (
      <Modal
         isOpen={isOpen}
         onClose={handleClose}
         size="5xl"
         variant="info"
         title="Procesar entrada de inventario"
         description="Revisa la información antes de confirmar."
         panelClassName="flex max-h-[min(94dvh, 46rem)] flex-col rounded-xl sm:!rounded-2xl !p-4 sm:!p-6"
         contentClassName="flex min-h-0 flex-1 flex-col overflow-hidden"
      >

         <div className={`min-h-0 flex-1 overflow-y-auto overscroll-contain py-1 pr-1 ${thinScrollbarClassName}`}>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
               <div className="flex flex-col gap-4 lg:col-span-2">
                  <section
                     aria-label="Qué ocurrirá al procesar"
                     className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10"
                  >

                  <FlowStep
                     icon={<FileTextIcon size={18} />}
                     caption="Orden de compra"
                     title={summaryValue(order?.purchase_order_code)}
                  />

                  <ArrowDownIcon
                     aria-hidden="true"
                     size={18}
                     className="mx-auto my-2 text-amber-600 dark:text-amber-300"
                  />

                  <FlowStep
                     highlighted
                     icon={<PackagePlusIcon size={18} />}
                     caption="Se creará"
                     title="Entrada de inventario pendiente"
                  />

                     <p className="m-0 mt-3 text-sm text-amber-800 dark:text-amber-200/90">
                        Incluirá los productos, la cotización aprobada y el proveedor
                        de esta orden.
                     </p>
                  </section>

                  <div
                  role="note"
                  className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200"
                  >
                  <PackageCheckIcon
                     aria-hidden="true"
                     size={18}
                     className="mt-0.5 shrink-0"
                  />
                  <span>
                     El stock no cambiará hasta que la entrada pendiente se confirme
                     como recibida.
                  </span>
                  </div>
               </div>

               {/* Columna derecha: resumen */}
               <section
                  aria-label="Resumen de la orden"
                  className="overflow-hidden rounded-xl border border-slate-200 lg:col-span-3 dark:border-neutral-600"
               >
                  <header className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 px-4 py-3 dark:bg-[#303846]">
                  <div className="flex min-w-0 items-center gap-3">
                     <span
                        aria-hidden="true"
                        className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300"
                     >
                        <StoreIcon size={20} />
                     </span>
                     <div className="min-w-0">
                        <p className={`m-0 `}>Proveedor</p>
                        <h4 className="m-0 truncate text-base font-semibold text-slate-900 dark:text-slate-50">
                        {summaryValue(order?.supplier_name)}
                        </h4>
                     </div>
                  </div>
                  <Badges
                     label={statusVariant.label || EMPTY_VALUE}
                     color={statusVariant.badgeColor}
                  />
                  </header>

                  <div className="grid grid-cols-1 gap-x-6 gap-y-4 border-t border-slate-200 p-4 sm:grid-cols-2 dark:border-neutral-600">
                  <DetailField
                     label="Solicitud"
                     value={summaryValue(order?.purchase_request?.code)}
                     icon={<ClipboardListIcon size={18} />}
                  />
                  <DetailField
                     label="Enviado a revisión"
                     value={summaryValue(sentToReview)}
                     icon={<CalendarIcon size={18} />}
                  />

                  {
                     priority && (
                        <div className="flex items-start gap-3">
                           <FlagIcon
                              aria-hidden="true"
                              size={18}
                              className="mt-0.5 shrink-0 text-slate-400"
                           />
                           <div className="flex flex-col gap-1">
                           <span className="">Prioridad</span>
                           <span
                              className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${priority.className}`}
                           >
                              {priority.label}
                           </span>
                           </div>
                        </div>
                     )
                  }

                  {
                     sender && (
                        <SenderInfo
                           fullname={sender.fullname}
                           pictureUrl={sender.picture_url}
                           workArea={sender.work_area_information?.work_area_name}
                        />
                     )
                  }
                  </div>

                  {
                     comments && (
                        <div className="flex items-start gap-3 border-t border-slate-200 bg-white px-4 py-3 dark:border-neutral-600 dark:bg-[#272b34]">
                           <MessageSquareIcon
                              aria-hidden="true"
                              size={18}
                              className="mt-0.5 shrink-0 text-slate-400"
                           />
                           <div className="min-w-0">
                              <span className="">Comentarios</span>
                              
                              <p className="m-0 line-clamp-3 text-sm text-slate-700 dark:text-slate-200">
                                 {comments}
                              </p>
                           </div>
                        </div>
                     )
                  }
               </section>
            </div>
         </div>

       
         <footer className="mt-4 flex shrink-0 flex-col-reverse gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end dark:border-neutral-600">
            <Button
               label="Cancelar"
               size="giant"
               onClick={handleClose}
               disabled={isLoading}
               className="w-full! sm:w-auto! rounded-md! bg-slate-500! text-white! hover:bg-slate-600! dark:bg-slate-700! dark:hover:bg-slate-600!"
            />
            <Button
               label="Procesar orden"
               size="giant"
               onClick={onConfirm}
               isLoading={isLoading}
               disabled={isLoading}
               className="w-full! sm:w-auto! rounded-md! bg-blue-600! text-white! hover:bg-blue-700!"
            />
         </footer>
      </Modal>
   );
};