import { useState } from "react";
import { Badges, DataTable, Modal } from "@alpac/design-system";
import { Loader } from "@app/shared/components/loaders/loader";
import { ModalInfoField } from "@app/shared/components/modal-info-field/modal-info-field";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { EntryStatus } from "@app/core/enums/entry-status.enum";
import { EntryTypeEnum } from "@app/core/enums/entry-type.enum";
import { useInventoryEntries } from "@app/modules/Inventory/ui/hooks/useInventoryEntries";
import { PurchaseRequestStatusEnum } from "@app/modules/purchasing/domain/enums/purchase-request-status.enum";

import type { TableColumn } from "@alpac/design-system";
import type {
  InventoryEntryItemDetail,
  InventoryEntryPurchaseRequestItem,
} from "@app/modules/Inventory/domain/api-contract/responses/inventory-entries.response";
import type { EntradasDetailModalProps } from "./entradas-detail-modal.types";
import { formatDateOrDash } from "@app/modules/payroll/ui/pages/control-vacations/components/control-vacation-details/utils/validate.details-content";

const ITEMS_COLUMNS: TableColumn<InventoryEntryPurchaseRequestItem>[] = [
  {
    key: "product_name",
    label: "Producto",
    render: (item) => (
      <span>{item.product_name ?? item.product_code ?? "—"}</span>
    ),
  },
  {
    key: "quantity",
    label: "Cantidad",
    render: (item) => <span className="font-medium">{item.quantity}</span>,
  },
  {
    key: "unit_measure_symbol",
    label: "Unidad",
    render: (item) => (
      <span>{item.unit_measure_symbol ?? item.unit_measure_name ?? "—"}</span>
    ),
  },
  {
    key: "description",
    label: "Descripción",
    render: (item) => <span>{item.description ?? "—"}</span>,
  },
];

const ORDER_ITEMS_COLUMNS: TableColumn<InventoryEntryItemDetail>[] = [
  {
    key: "product_name",
    label: "Producto",
    render: (item) => (
      <span>{item.product_name ?? item.product_code ?? "—"}</span>
    ),
  },
  {
    key: "quantity",
    label: "Cantidad",
    render: (item) => <span className="font-medium">{item.quantity}</span>,
  },
  {
    key: "unit_measure_symbol",
    label: "Unidad",
    render: (item) => (
      <span>{item.unit_measure_symbol ?? item.unit_measure_name ?? "—"}</span>
    ),
  },
  {
    key: "unit_price",
    label: "Precio unitario",
    render: (item) => (
      <span>
        C${" "}
        {Number(item.unit_price).toLocaleString("es-NI", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    ),
  },
  {
    key: "cost_center_name",
    label: "Centro de costo",
    render: (item) => <span>{item.cost_center_name ?? "—"}</span>,
  },
  {
    key: "supplier_name",
    label: "Proveedor",
    render: (item) => <span>{item.supplier_name ?? "—"}</span>,
  },
  {
    key: "quotation_id",
    label: "Cotización",
    render: (item) =>
      item.quotation_id ? (
        <Badges
          color="info"
          className="bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800"
          label="Aprobada"
        />
      ) : (
        <span>—</span>
      ),
  },
];

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
};

const getPurchaseRequestStatusLabel = (status?: string | null) => {
  if (!status) return "—";
  const match = Object.values(PurchaseRequestStatusEnum).find(
    (item) => item.textValue === status,
  );
  return match?.label ?? status;
};

export const EntradasDetailModal = function (props: EntradasDetailModalProps) {
   const { isOpen, onClose, entry } = props;
   const { companyId, moduleCode } = useUserStore();
   const [previewImage, setPreviewImage] = useState<string | null>(null);

   const { GetInventoryEntryDetailQuery } = useInventoryEntries({
      payloadGetInventoryEntryDetailRequest:
         isOpen && entry
         ? {
               company_id: companyId,
               module_code: moduleCode,
               inventory_entry_id: entry.inventory_entry_id,
            }
         : undefined,
   });

   const detail = GetInventoryEntryDetailQuery.data ?? null;

   const isLoading =
      GetInventoryEntryDetailQuery.isPending ||
      GetInventoryEntryDetailQuery.isFetching;

   const current = detail ?? entry;
   const branch = current?.branch_information ?? null;
   const workArea = detail?.work_area_information ?? null;
   const purchaseRequest = detail?.purchase_request_information ?? null;
   const items = detail?.purchase_request_items ?? [];
   const orderItems = detail?.items ?? [];
   const hasOrderItems = orderItems.length > 0;
   const itemsCount = hasOrderItems ? orderItems.length : items.length;

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         title="Detalle de entrada de inventario"
         description="Consulta la información general, la solicitud de compra y los artículos de la entrada."
         variant="default"
         size="5xl"
      >
         {isLoading ? (
         <div className="py-8">
            <Loader title="Cargando detalle de la entrada..." />
         </div>
         ) : !current ? (
         <span className="text-sm text-slate-500 dark:text-slate-400">
            No se encontró información de la entrada.
         </span>
         ) : (
         <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
               
               <Badges
                  color="info"
                  className="bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-900/30 dark:text-slate-300 dark:border-slate-700"
                  label={current.code ?? "Entrada de inventario"}
               />
               
               <Badges
                  color="info"
                  className={EntryStatus[current.entry_status].badgeColor}
                  label={EntryStatus[current.entry_status]?.label ?? ""}
               />

               {
                  detail && (
                     <Badges
                        color="info"
                        className="bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                        label={EntryTypeEnum[detail.entry_type]?.label ?? "—"}
                     />
                  )
               }
            </div>

            <div className="flex flex-col gap-4 border-t border-slate-600 pt-4 dark:border-neutral-600">
               <h3 className="text-sm font-semibold text-slate-200">
                  Información general
               </h3>

               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
               <ModalInfoField label="CÓDIGO" value={current.code ?? "—"} />
               <ModalInfoField
                  label="ESTADO"
                  value={EntryStatus[current.entry_status]?.label ?? "—"}
               />
               {detail && (
                  <ModalInfoField
                     label="TIPO DE ENTRADA"
                     value={EntryTypeEnum[detail.entry_type]?.label ?? "—"}
                  />
               )}
               <ModalInfoField
                  label="SUCURSAL"
                  value={branch?.branch_name ?? "—"}
               />
               <ModalInfoField
                  label="CÓDIGO DE SUCURSAL"
                  value={branch?.branch_code ?? "—"}
               />
               <ModalInfoField
                  label="ALIAS DE LA COMPAÑÍA"
                  value={branch?.company_alias ?? "—"}
               />
               {workArea && (
                  <ModalInfoField
                     label="ÁREA DE TRABAJO"
                     value={workArea.work_area_name ?? "—"}
                  />
               )}
               {detail && (
                  <ModalInfoField
                     label="FECHA DE REGISTRO"
                     value={formatDateOrDash(detail.created_at)}
                  />
               )}
               {detail && (
                  <ModalInfoField
                     label="NÚMERO DE FACTURA"
                     value={detail.invoice_number ?? "—"}
                  />
               )}
               {detail && (
                  <ModalInfoField
                     label="FECHA DE FACTURA"
                     value={formatDate(detail.invoice_date)}
                  />
               )}
               {detail?.supplier_name && (
                  <ModalInfoField
                     label="PROVEEDOR"
                     value={detail.supplier_name}
                  />
               )}
               <ModalInfoField
                  label="ID DE ENTRADA"
                  value={current.inventory_entry_id}
               />
               </div>
            </div>

            {purchaseRequest && (
               <div className="flex flex-col gap-4 border-t border-slate-600 pt-4 dark:border-neutral-600">
               <h3 className="text-sm font-semibold text-slate-200">
                  Solicitud de compra
               </h3>

               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <ModalInfoField
                     label="CÓDIGO"
                     value={purchaseRequest.code ?? "—"}
                  />
                  <ModalInfoField
                     label="FECHA DE SOLICITUD"
                     value={formatDate(purchaseRequest.request_date)}
                  />
                  <ModalInfoField
                     label="ESTADO"
                     value={getPurchaseRequestStatusLabel(
                     purchaseRequest.request_status,
                     )}
                  />
               </div>
               </div>
            )}

            {detail && (
               <div className="flex flex-col gap-2 border-t border-slate-600 pt-4 dark:border-neutral-600">
               <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-200">
                     Artículos
                  </h3>
                  <span className="rounded-full bg-slate-700 px-2 py-0.5 text-xs text-slate-200">
                     {itemsCount} ítems
                  </span>
               </div>

               {hasOrderItems ? (
                  <DataTable<InventoryEntryItemDetail>
                     data={orderItems}
                     columns={ORDER_ITEMS_COLUMNS}
                  />
               ) : (
                  <DataTable<InventoryEntryPurchaseRequestItem>
                     data={items}
                     columns={ITEMS_COLUMNS}
                  />
               )}
               </div>
            )}

            {detail && detail.evidence_images?.length > 0 && (
               <div className="flex flex-col gap-2 border-t border-slate-600 pt-4 dark:border-neutral-600">
                <h3 className="text-sm font-semibold text-slate-200">
                   Evidencias de la factura
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                   {detail.evidence_images.map((image) =>
                      image.image_url ? (
                         <button
                            key={image.image_id}
                            type="button"
                            onClick={() => setPreviewImage(image.image_url)}
                            className="overflow-hidden rounded-md border border-slate-200 transition-transform hover:scale-[1.02] dark:border-slate-600"
                         >
                            <img
                               src={image.image_url}
                               alt="Evidencia de la factura"
                               className="h-24 w-full object-cover"
                            />
                         </button>
                      ) : null,
                   )}
                </div>
               </div>
            )}

            {detail?.observations && (
               <div className="rounded-md bg-[#303846] p-3">
                <p className="text-[10px] font-semibold text-[#91A0B5]">
                   OBSERVACIONES
                </p>
                <p className="text-[13px] text-[#E2E8F0]">{detail.observations}</p>
               </div>
            )}
         </div>
         )}

         <Modal
            isOpen={Boolean(previewImage)}
            onClose={() => setPreviewImage(null)}
            title="Vista previa de evidencia"
            size="3xl"
         >
            {previewImage && (
               <div className="flex h-full max-h-[80vh] w-full items-center justify-center rounded-md bg-slate-100 p-2 dark:bg-black/50">
                  <img
                     src={previewImage}
                     alt="Evidencia ampliada"
                     className="max-h-full max-w-full object-contain drop-shadow-lg"
                  />
               </div>
            )}
         </Modal>
      </Modal>
   );
};
