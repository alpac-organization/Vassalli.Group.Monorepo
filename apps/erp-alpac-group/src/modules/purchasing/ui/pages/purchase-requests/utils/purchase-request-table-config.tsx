import { Badges, ContextMenu, type ContextMenuItem, type TableColumn } from "@alpac/design-system";
import type { GetPurchaseRequestResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-response";
import { purchaseRequestPriorityBadgeVariants, purchaseRequestStatusBadgeVariants, purchaseRequestTypeBadgeVariants } from "../purchase-request.variants";
import { PurchaseRequestStatusEnum } from "@app/modules/purchasing/domain/enums/purchase-request-status.enum";
import { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import { isValidateValue } from "@app/shared/utils/values.utils";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import { PriorityLevelEnum } from "@app/modules/purchasing/domain/enums/purchase-request-priority-level.enum";

const contextMenuButton = "rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";

type contexMenuOptions = (row: GetPurchaseRequestResponse) => ContextMenuItem[]

export function getPurchaseRequestColumnConfig(
   contexMenuOptions: contexMenuOptions, purchaseRequestType: PurchaseRequestEnum
): TableColumn<GetPurchaseRequestResponse>[] {

   const isRequisition = purchaseRequestType.textValue === PurchaseRequestEnum.Requisition.textValue;

   let priorityLevelColumn = null;

   const configuration = [
      { key: "code", label: "Código" },
      {
         key: "request_status",
         label: "Estado",
         render: (row: GetPurchaseRequestResponse) => {
            const statusLabel =
               Object.values(PurchaseRequestStatusEnum).find(
                  (status) => status.textValue === row?.request_status,
               )?.label ?? row?.request_status;

            return (
               <Badges
                  label={statusLabel}
                  color={
                     purchaseRequestStatusBadgeVariants[
                        row?.request_status as keyof typeof purchaseRequestStatusBadgeVariants
                     ]?.badgeColor ??
                     purchaseRequestStatusBadgeVariants.default.badgeColor
                  }
               />
            );
         },
      },

      {
         key: "request_type",
         label: "Tipo",
         render: (row: GetPurchaseRequestResponse) => {
            const typeLabel =
               Object.values(PurchaseRequestEnum).find(
                  (type) => type.textValue === row?.request_type,
               )?.label ?? row?.request_type;

            return (
               <Badges
                  label={typeLabel}
                  color={
                     purchaseRequestTypeBadgeVariants[
                        row?.request_type as keyof typeof purchaseRequestTypeBadgeVariants
                     ]?.badgeColor ??
                     purchaseRequestTypeBadgeVariants.default.badgeColor
                  }
               />
            );
         },
      },

      {
         key: "request_date",
         label: "Fecha de Solicitud",
         render(row: GetPurchaseRequestResponse) {
            if (!isValidateValue(row?.request_date)) return "—";
            return formatDateToSpanishWords(row?.request_date ?? "");
         }
      },

      {
         key: "revision_date",
         label: "Fecha de revisión",
         render: (row: GetPurchaseRequestResponse) => {
            if (!isValidateValue(row?.revision_date)) return "—";
            return formatDateToSpanishWords(row?.revision_date ?? "");
         }
      },

      {
         key: "actions",
         label: "Acciones",
         render: (row: GetPurchaseRequestResponse) => (
            <ContextMenu
               items={contexMenuOptions(row)}
               triggerClassName={contextMenuButton}
            />
         )
      }
   ];


   if (isRequisition) {
      priorityLevelColumn = (row: GetPurchaseRequestResponse) =>
      ({
         key: "priority_level",
         label: "Prioridad",
         render() {

            const priorityLabel =
               Object.values(PriorityLevelEnum).find(
                  (priority) => priority.textValue === row?.request_status,
               )?.label ?? row?.priority_level;

            return <Badges
               label={priorityLabel}
               color={
                  purchaseRequestPriorityBadgeVariants[
                     row.request_status as keyof typeof purchaseRequestPriorityBadgeVariants
                  ]?.badgeColor ??
                  purchaseRequestPriorityBadgeVariants.default.badgeColor
               }
            />
         }
      });


      // configuration.push(priorityLevelColumn())
   }

   return configuration;
}