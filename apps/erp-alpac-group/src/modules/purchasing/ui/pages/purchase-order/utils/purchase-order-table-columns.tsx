import {
  Badges,
  ContextMenu,
  type ContextMenuItem,
  type TableColumn,
} from "@alpac/design-system";
import type { GetPurchaseOrdersResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-orders-response";
import { AvatarWithTooltip } from "@app/modules/purchasing/ui/pages/purchase-order/components/avatar-with-tooltip";
import { PurchaseOrderStatusEnum } from "@app/modules/purchasing/domain/enums/purchase-order-status.enum";
import { resolvePurchaseOrderStatusBadge } from "@app/modules/purchasing/ui/pages/purchase-order/utils/purchase-order-status.variants";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";

const contextMenuButton =
  "rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";

const emptyCell = "—";

function displayText(value?: string | null) {
  return value?.trim() || emptyCell;
}

export type PurchaseOrderTableColumnHandlers = {
  onViewDetail?: (row: GetPurchaseOrdersResponse) => void;
  onGeneratePurchaseOrderPdf?: (row: GetPurchaseOrdersResponse) => void;
  onProcessInventoryEntry?: (row: GetPurchaseOrdersResponse) => void;
};

export function getPurchaseOrderTableColumns({
  onViewDetail,
  onGeneratePurchaseOrderPdf,
  onProcessInventoryEntry,
}: PurchaseOrderTableColumnHandlers = {}): TableColumn<GetPurchaseOrdersResponse>[] {
  return [
    {
      key: "purchase_order_code",
      label: "Orden",
      render: (row) => displayText(row.purchase_order_code),
    },
    {
      key: "sent_by",
      label: "Enviado por",
      render: (row) => {
        const sender = row.sent_by_user_information;
        const fullname = sender?.fullname?.trim() || emptyCell;
        const pictureUrl = sender?.picture_url?.trim();
        const email = sender?.email?.trim() || emptyCell;

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
      key: "status",
      label: "Estado",
      render: (row) => {
        const variant = resolvePurchaseOrderStatusBadge(row.status);

        return (
          <Badges
            label={variant.label || emptyCell}
            color={variant.badgeColor}
          />
        );
      },
    },
    {
      key: "supplier_name",
      label: "Proveedor",
      render: (row) => displayText(row.supplier_name),
    },
    {
      key: "sent_to_review_at",
      label: "Enviado a revisión",
      render: (row) => formatDateToSpanishWords(row.sent_to_review_at),
    },
    {
      key: "actions",
      label: "Acciones",
      render: (row) => {
        const items: ContextMenuItem[] = [
          {
            label: "Ver detalle",
            onClick: () => onViewDetail?.(row),
          },
          {
            label: "Generar orden de compra",
            onClick: () => onGeneratePurchaseOrderPdf?.(row),
          },
        ];

        if (row.status === PurchaseOrderStatusEnum.Pending.textValue) {
          items.push({
            label: "Procesar entrada de inventario",
            onClick: () => onProcessInventoryEntry?.(row),
          });
        }

        return (
          <ContextMenu items={items} triggerClassName={contextMenuButton} />
        );
      },
    },
  ];
}
