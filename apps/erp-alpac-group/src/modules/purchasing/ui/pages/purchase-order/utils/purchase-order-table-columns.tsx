import {
   Avatar, ContextMenu,
   type ContextMenuItem,
   type TableColumn
} from "@alpac/design-system";
import type { GetPurchaseOrdersResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-orders-response";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";

const contextMenuButton =
   "rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";

function AvatarWithTooltip({
   fullname,
   pictureUrl,
   email,
}: {
   fullname: string;
   pictureUrl?: string;
   email: string;
}) {

   return (
      <Avatar
         label={fullname}
         pictureUrl={pictureUrl}
         tooltipPlacement="top"
         tooltip={
            <div className="flex flex-col gap-0.5">
               <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                  Correo
               </span>
               <span className="break-all text-sm font-medium text-slate-900 dark:text-white">
                  {email}
               </span>
            </div>
         }
      />
   );
}

export const PurchaseOrderTableColumns: TableColumn<GetPurchaseOrdersResponse>[] =
   [
      {
         key: "sent_by",
         label: "Enviado por",
         render: (row: GetPurchaseOrdersResponse) => {
            const sender = row.sent_by_user_information;
            const fullname = sender?.fullname?.trim() || "—";
            const pictureUrl = sender?.picture_url?.trim();
            const email = sender?.email?.trim() || "—";

            return (
               <AvatarWithTooltip
                  fullname={fullname}
                  pictureUrl={pictureUrl}
                  email={email}
               />
            );
         },
      },
      {
         key: "area",
         label: "Área",
         render: (row) =>
            row.sent_by_user_information?.work_area_information?.work_area_name?.trim() || "—",
      },
      {
         key: "branch",
         label: "Sucursal",
         render: (row) => row.purchase_request?.branch_information?.branch_name?.trim() || "—",
      },
      {
         key: "sent_to_review_at",
         label: "Enviado a revisión",
         render: (row) => formatDateToSpanishWords(row.sent_to_review_at),
      },
      {
         key: "comments",
         label: "Comentarios",
         render: (row) => row.comments?.trim() || "—",
      },
      {
         key: "actions",
         label: "Acciones",
         render: (row: GetPurchaseOrdersResponse) => {

            const items: ContextMenuItem[] = [
               {
                  label: "Ver detalle",
                  onClick: () => console.log(row),
               },
            ];

            return (
               <ContextMenu
                  items={items}
                  triggerClassName={contextMenuButton}
               />
            );
         },
      },
   ];