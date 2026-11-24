import { Fragment, useState } from "react";
import {
  BuildingIcon,
  CalendarIcon,
  CoinsIcon,
  FileTextIcon,
  ImageIcon,
  MapPinIcon,
  PackageIcon,
  ReceiptTextIcon,
  TruckIcon,
} from "lucide-react";
import {
  Badges,
  Banner,
  Button,
  DataTable,
  MetricCard,
  Modal,
  SectionHeader,
} from "@alpac/design-system";

import { useUserStore } from "@app/shared/stores/useUserStore";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import { EntryStatus } from "@app/core/enums/entry-status.enum";
import { EntryTypeEnum } from "@app/core/enums/entry-type.enum";
import { useInventoryEntries } from "@app/modules/Inventory/ui/hooks/useInventoryEntries";
import {
  purchaseRequestStatusBadgeVariants,
  purchaseRequestTypeBadgeVariants,
} from "@app/modules/purchasing/ui/pages/purchase-requests/purchase-request.variants";

import { BADGE_COLORS, COMPACT_BADGE_CLASS } from "./entradas-detail-modal.constants";
import {
  ORDER_ITEMS_COLUMNS,
  REQUEST_ITEMS_COLUMNS,
  getItemTotal,
} from "./entradas-detail-modal.columns";
import {
  EMPTY_VALUE,
  displayText,
  formatCurrency,
  formatDate,
  formatDateTime,
  resolveBadgeVariant,
} from "./entradas-detail-modal.utils";

import type {
  InventoryEntryItemDetail,
  InventoryEntryPurchaseRequestItem,
} from "@app/modules/Inventory/domain/api-contract/responses/inventory-entries.response";
import type { EntradasDetailModalProps } from "./entradas-detail-modal.types";

const ICON_CLASS = "text-slate-500 dark:text-slate-300";
const SECTION_GRID_CLASS = "grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4";
const ITEMS_TABLE_WRAPPER_CLASS = "[&>div]:h-auto [&>div]:flex-none";

const pluralize = (count: number, singular: string, plural: string) =>
  `${count} ${count === 1 ? singular : plural}`;

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

   const detail    = GetInventoryEntryDetailQuery.data ?? null;
   const isLoading = GetInventoryEntryDetailQuery.isPending || GetInventoryEntryDetailQuery.isFetching;
   const hasError  = !isLoading && (GetInventoryEntryDetailQuery.isError || !detail);

   const current         = detail ?? entry;
   const branch          = current?.branch_information ?? null;
   const workArea        = current?.work_area_information ?? null;
   const purchaseRequest = detail?.purchase_request_information ?? null;
   const requestItems    = detail?.purchase_request_items ?? [];
   const orderItems      = detail?.items ?? [];
   const evidenceImages  = (detail?.evidence_images ?? []).filter((image) => Boolean(image.image_url));

   const showRequestItems = !isLoading && orderItems.length === 0 && requestItems.length > 0;
   const itemsCount       = showRequestItems ? requestItems.length : orderItems.length;
   const entryTotal       = orderItems.reduce((total, item) => total + getItemTotal(item), 0);

   const statusVariant = current ? EntryStatus[current.entry_status] : undefined;
   const typeVariant   = current ? EntryTypeEnum[current.entry_type] : undefined;
   const requestCode   = purchaseRequest?.code ?? current?.purchase_request_code ?? null;
   const requestStatus = resolveBadgeVariant(purchaseRequestStatusBadgeVariants, purchaseRequest?.request_status);
   const requestType   = resolveBadgeVariant(purchaseRequestTypeBadgeVariants, purchaseRequest?.request_type);

   const headerSubtitle    = [detail?.supplier_name, branch?.branch_name].filter(Boolean).join(" · ");
   const branchDescription = [branch?.branch_code, branch?.company_alias].filter(Boolean).join(" · ");

   const itemsCountBadge = (
      <Badges
         label={pluralize(itemsCount, "ítem", "ítems")}
         color={BADGE_COLORS.neutral}
         className={COMPACT_BADGE_CLASS}
      />
   );

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         title="Detalle de entrada de inventario"
         description="Consulta la información general, la factura, la solicitud de compra y los artículos de la entrada."
         variant="default"
         size="7xl"
         panelClassName="rounded-xl sm:!rounded-2xl !p-4 sm:!p-6"
      >
         {!current ? (
            <Banner
               variant="info"
               title="Sin información"
               description="No se encontró información de la entrada."
            />
         ) : (
            <div className="flex flex-col gap-5" aria-busy={isLoading}>

               <SectionHeader
                  title={current.code ?? "Entrada de inventario"}
                  subtitle={headerSubtitle || undefined}
               >
                  {statusVariant && (
                     <Badges label={statusVariant.label} color={statusVariant.badgeColor} />
                  )}
                  {typeVariant && (
                     <Badges label={typeVariant.label} color={typeVariant.badgeColor} />
                  )}
                  {requestCode && (
                     <Badges
                        label={`Solicitud: ${requestCode}`}
                        color={BADGE_COLORS.request}
                        className={COMPACT_BADGE_CLASS}
                     />
                  )}
                  {detail?.invoice_number && (
                     <Badges
                        label={`Factura: ${detail.invoice_number}`}
                        color={BADGE_COLORS.invoice}
                        className={COMPACT_BADGE_CLASS}
                     />
                  )}
               </SectionHeader>

               {hasError ? (
                  <div className="flex flex-col gap-3">
                     <Banner
                        variant="error"
                        title="No se pudo cargar el detalle"
                        description="Ocurrió un problema al consultar la entrada de inventario. Intenta nuevamente."
                     />
                     <div className="flex justify-end">
                        <Button
                           type="button"
                           size="medium"
                           label="Reintentar"
                           onClick={() => void GetInventoryEntryDetailQuery.refetch()}
                           className="w-full! rounded-md! bg-alpac-primary-500! text-white! dark:bg-alpac-primary-700! sm:w-auto!"
                        />
                     </div>
                  </div>
               ) : (
                  <Fragment>
                     {detail && (
                        <Fragment>
                           <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                              <MetricCard
                                 size="compact"
                                 title="Fecha de registro"
                                 value={formatDateTime(detail.created_at)}
                                 icon={<CalendarIcon size={14} />}
                                 themeClass="bg-sky-500"
                              />
                              <MetricCard
                                 size="compact"
                                 title="Fecha de factura"
                                 value={formatDate(detail.invoice_date)}
                                 icon={<ReceiptTextIcon size={14} />}
                                 themeClass="bg-violet-500"
                              />
                              <MetricCard
                                 size="compact"
                                 title="Artículos"
                                 value={pluralize(itemsCount, "ítem", "ítems")}
                                 icon={<PackageIcon size={14} />}
                                 themeClass="bg-amber-500"
                              />
                              <MetricCard
                                 size="compact"
                                 title="Total de la entrada"
                                 value={orderItems.length > 0 ? formatCurrency(entryTotal) : EMPTY_VALUE}
                                 icon={<CoinsIcon size={14} />}
                                 themeClass="bg-emerald-500"
                              />
                           </div>

                           <SectionHeader
                              title="Información general"
                              subtitle="Datos de la sucursal, área y proveedor de la entrada."
                              hasBorder
                           >
                              <div className={SECTION_GRID_CLASS}>
                                 <DetailField
                                    label="Sucursal"
                                    value={displayText(branch?.branch_name)}
                                    description={branchDescription || undefined}
                                    icon={<MapPinIcon size={18} className={ICON_CLASS} aria-hidden />}
                                 />
                                 <DetailField
                                    label="Área de trabajo"
                                    value={displayText(workArea?.work_area_name)}
                                    icon={<BuildingIcon size={18} className={ICON_CLASS} aria-hidden />}
                                 />
                                 <DetailField
                                    label="Proveedor"
                                    value={displayText(detail.supplier_name)}
                                    icon={<TruckIcon size={18} className={ICON_CLASS} aria-hidden />}
                                 />
                                 <DetailField
                                    label="Número de factura"
                                    value={displayText(detail.invoice_number)}
                                    icon={<FileTextIcon size={18} className={ICON_CLASS} aria-hidden />}
                                 />
                              </div>
                           </SectionHeader>

                           {purchaseRequest && (
                              <SectionHeader
                                 title="Solicitud de compra"
                                 subtitle="Solicitud que originó la entrada de inventario."
                                 hasBorder
                              >
                                 <div className={SECTION_GRID_CLASS}>
                                    <DetailField
                                       label="Código"
                                       value={
                                          purchaseRequest.code ? (
                                             <Badges
                                                label={purchaseRequest.code}
                                                color={BADGE_COLORS.request}
                                                className={COMPACT_BADGE_CLASS}
                                             />
                                          ) : (
                                             EMPTY_VALUE
                                          )
                                       }
                                    />
                                    <DetailField
                                       label="Fecha de solicitud"
                                       value={formatDate(purchaseRequest.request_date)}
                                    />
                                    <DetailField
                                       label="Tipo de solicitud"
                                       value={<Badges label={requestType.label} color={requestType.badgeColor} />}
                                    />
                                    <DetailField
                                       label="Estado"
                                       value={<Badges label={requestStatus.label} color={requestStatus.badgeColor} />}
                                    />
                                 </div>
                              </SectionHeader>
                           )}
                        </Fragment>
                     )}

                     <div className={ITEMS_TABLE_WRAPPER_CLASS}>
                        {showRequestItems ? (
                           <DataTable<InventoryEntryPurchaseRequestItem>
                              title="Artículos"
                              data={requestItems}
                              columns={REQUEST_ITEMS_COLUMNS}
                              getRowKey={(item) => item.purchase_request_item_id}
                              maxHeight="none"
                              toolbarEnd={itemsCountBadge}
                           />
                        ) : (
                           <DataTable<InventoryEntryItemDetail>
                              title="Artículos"
                              data={orderItems}
                              columns={ORDER_ITEMS_COLUMNS}
                              isLoading={isLoading}
                              getRowKey={(item) => item.purchase_order_item_id ?? item.product_id}
                              maxHeight="none"
                              toolbarEnd={isLoading ? undefined : itemsCountBadge}
                           />
                        )}
                     </div>

                     {evidenceImages.length > 0 && (
                        <SectionHeader
                           title="Evidencias de la factura"
                           subtitle={pluralize(evidenceImages.length, "imagen adjunta", "imágenes adjuntas")}
                           hasBorder
                        >
                           <div className="grid w-full grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                              {evidenceImages.map((image, index) => (
                                 <button
                                    key={image.image_id}
                                    type="button"
                                    onClick={() => setPreviewImage(image.image_url)}
                                    aria-label={`Ver evidencia ${index + 1}`}
                                    className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-alpac-primary-400 dark:border-neutral-600 dark:bg-neutral-800"
                                 >
                                    <img
                                       src={image.image_url ?? undefined}
                                       alt={`Evidencia de la factura ${index + 1}`}
                                       loading="lazy"
                                       className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                                    />
                                    <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-black/50 py-1 text-[11px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                                       <ImageIcon size={12} aria-hidden />
                                       Ver
                                    </span>
                                 </button>
                              ))}
                           </div>
                        </SectionHeader>
                     )}

                     {detail?.observations && (
                        <SectionHeader title="Observaciones" hasBorder>
                           <p className="m-0 w-full whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                              {detail.observations}
                           </p>
                        </SectionHeader>
                     )}
                  </Fragment>
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
