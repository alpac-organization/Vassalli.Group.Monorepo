import { Avatar, Badges, Modal } from "@alpac/design-system";
import { BuildingIcon, CalendarCheckIcon, CalendarIcon, LayoutListIcon, MailIcon, NotebookTextIcon, UserIcon } from "lucide-react";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import type { PurchaseOrderDetailsProps } from "./purchase-order-details-modal.types";
import { usePurchase } from "@app/modules/purchasing/ui/hooks/purchase/usePurchase";
import { useUserStore } from "@app/shared/stores/useUserStore";
import type { GetPurchaseOrderDetailsResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-order-details-response";
import { PurchaseRequestStatusEnum } from "@app/modules/purchasing/domain/enums/purchase-request-status.enum";
import { purchaseRequestDestinationBadgeVariants, purchaseRequestPriorityBadgeVariants, purchaseRequestStatusBadgeVariants, purchaseRequestTypeBadgeVariants } from "../../../purchase-requests/purchase-request.variants";
import { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import { PriorityLevelEnum } from "@app/modules/purchasing/domain/enums/purchase-request-priority-level.enum";
import { PurchaseRequestDestinationEnum } from "@app/modules/purchasing/domain/enums/purchase-request-destination.enum";
import { Loader } from "@app/shared/components/loaders/loader";

const sectionTitleClassName =
   "m-0 pb-2 text-xs font-bold tracking-wider text-slate-500 dark:text-slate-200 border-b border-slate-200 dark:border-neutral-600";

export const PurchaseOrderDetailsModal = ({
   isOpen,
   onClose,
   purchaseOrder,
}: PurchaseOrderDetailsProps) => {

   const { companyId, moduleCode } = useUserStore();

   const { GetPurchaseOrderDetails } = usePurchase({
      getPurchaseOrderDetailsPayload: {
         company_id: companyId,
         module_code: moduleCode,
         purchase_order_id: isOpen ? (purchaseOrder?.purchase_order_id ?? "") : "",
      }
   });

   const details = GetPurchaseOrderDetails.data ?? {} as GetPurchaseOrderDetailsResponse;
   const purchaseRequest = details.purchase_request_details;   

   const sentBy = details.sent_by_user_information;
   const requestingArea = purchaseRequest?.information_from_requesting_area;
   const priorityLevel = purchaseRequest?.priority_level;
   const destination = purchaseRequest?.destination;
   const purchaseRequestStatus = purchaseRequest?.request_status;
   const purchaseRequestType = purchaseRequest?.request_type;
   const purchaseRequestDate = purchaseRequest?.request_date;
   const purchaseRequestRevisionDate = purchaseRequest?.revision_date;

   const isLoading = GetPurchaseOrderDetails.isPending || GetPurchaseOrderDetails.isFetching;

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         title="Detalle de orden de compra"
         variant="default"
         size="7xl"
         panelClassName={[
            "flex max-h-[min(94dvh,50rem)] flex-col",
            "!mx-2 !my-2 sm:!mx-4 sm:!my-6",
            "rounded-xl sm:!rounded-2xl !p-4 sm:!p-6"
         ].join(" ")}
         contentClassName="flex min-h-0 flex-1 flex-col overflow-y-auto"
      >
         {isLoading && <Loader title="Cargando detalle de la orden de compra..." />}

         <div className="flex flex-col gap-5">

            <section className="flex flex-col gap-3">
               <h4 className={sectionTitleClassName}>Información de la orden</h4>
               <div className="grid grid-cols-1 p-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <DetailField
                     label="Enviado por"
                     value={sentBy?.fullname ?? ""}
                     icon={<Avatar label={sentBy?.fullname ?? ""} hasLabel={false} />}
                  />
                  <DetailField
                     label="Email"
                     value={sentBy?.email ?? ""}
                     icon={<MailIcon size={18} />}
                  />
                  <DetailField
                     label="Enviado a revisión"
                     value={formatDateToSpanishWords(details.sent_to_review_at)}
                     icon={<CalendarIcon size={18} />}
                  />
                  <DetailField
                     label="Comentarios"
                     value={details.comments ?? ""}
                     icon={<NotebookTextIcon size={18} />}
                  />
               </div>
            </section>

            <section className="flex flex-col gap-3">

               <h4 className={sectionTitleClassName}>Solicitud</h4>

               <div className="grid grid-cols-1 p-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                  <DetailField
                     label="Estado"
                     value={
                        <Badges
                           label={
                              PurchaseRequestStatusEnum[
                                 purchaseRequestStatus as (keyof typeof PurchaseRequestStatusEnum)
                              ]?.label ?? purchaseRequestStatus
                           }
                           color={
                              purchaseRequestStatusBadgeVariants[
                                 purchaseRequestStatus as keyof typeof purchaseRequestStatusBadgeVariants
                              ]?.badgeColor ??
                              purchaseRequestStatusBadgeVariants.default.badgeColor
                           }
                        />
                     }
                  />

                  <DetailField
                     label="Tipo"
                     value={
                        <Badges
                           label={
                              PurchaseRequestEnum[
                                 purchaseRequestType as (keyof typeof PurchaseRequestEnum)
                              ]?.label ?? purchaseRequestType
                           }
                           color={
                              purchaseRequestTypeBadgeVariants[
                                 purchaseRequestType as keyof typeof purchaseRequestTypeBadgeVariants
                              ]?.badgeColor ??
                              purchaseRequestTypeBadgeVariants.default.badgeColor
                           }
                        />
                     }
                  />

                  <DetailField
                     label="Prioridad"
                     value={
                        <Badges
                           label={
                              PriorityLevelEnum[
                                 priorityLevel as (keyof typeof PriorityLevelEnum)
                              ]?.label ?? priorityLevel
                           }
                           color={
                              purchaseRequestPriorityBadgeVariants[
                                 priorityLevel as keyof typeof purchaseRequestPriorityBadgeVariants
                              ]?.badgeColor ??
                              purchaseRequestPriorityBadgeVariants.default.badgeColor
                           }
                        />
                     }
                  />

                  <DetailField
                     label="Destino"
                     value={
                        <Badges
                           label={
                              PurchaseRequestDestinationEnum[
                                 destination as (keyof typeof PurchaseRequestDestinationEnum)
                              ]?.label ?? destination
                           }
                           color={
                              purchaseRequestDestinationBadgeVariants[
                                 destination as keyof typeof purchaseRequestDestinationBadgeVariants
                              ]?.badgeColor ??
                              purchaseRequestDestinationBadgeVariants.default.badgeColor
                           }
                        />
                     }
                  />

                  <DetailField
                     label="Solicitante"
                     value={purchaseRequest?.creator_user_information?.fullname ?? ""}
                     icon={<UserIcon size={18} />}
                  />

                  <DetailField
                     label="Revisor"
                     value={purchaseRequest?.reviewer_user_information?.fullname ?? ""}
                     icon={<UserIcon size={18} />}
                  />

                  <DetailField
                     label="Sucursal"
                     value={purchaseRequest?.branch_information?.branch_name ?? ""}
                     icon={<BuildingIcon size={18} />}
                  />

                  <DetailField
                     label="Área Solicitante"
                     value={
                        purchaseRequest?.work_area_information?.work_area_name
                        ?? requestingArea?.work_area_name
                        ?? ""
                     }
                     icon={<BuildingIcon size={18} />}
                  />

                  <DetailField
                     label="Fecha de Registro"
                     value={formatDateToSpanishWords(purchaseRequestDate ?? "")}
                     icon={<CalendarIcon size={18} />}
                  />

                  <DetailField
                     label="Fecha de revisión"
                     value={formatDateToSpanishWords(purchaseRequestRevisionDate ?? "")}
                     icon={<CalendarCheckIcon size={18} />}
                  />

                  <DetailField
                     label="Observaciones"
                     value={purchaseRequest?.observations ?? ""}
                     icon={<NotebookTextIcon size={18} />}
                     containerClass={(purchaseRequest?.observations?.length && purchaseRequest?.observations?.length > 40) ? "col-span-2" : ""}
                  />
               </div>
            </section>
         </div>
      </Modal>
   );
};
