import {
  Avatar,
  Badges,
  ContextMenu
} from "@alpac/design-system";
import { PurchaseOrderStatusEnum } from "@app/modules/purchasing/domain/enums/purchase-order-status.enum";
import { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import { PurchaseRequestDestinationEnum } from "@app/modules/purchasing/domain/enums/purchase-request-destination.enum";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import { getPriorityLevelBadge, resolvePurchaseOrderStatusBadge } from "@app/modules/purchasing/ui/pages/purchase-order/utils/purchase-order-status.variants";
import { purchaseRequestTypeBadgeVariants } from "@app/modules/purchasing/ui/pages/purchase-requests/purchase-request.variants";

import type { GetPurchaseOrdersResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-orders-response";
import type { ContextMenuItem, TableColumn } from "@alpac/design-system"

const contextMenuButton = "rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";

const emptyCell = "—";

function displayText(value?: string | null) {
  return value?.trim() || emptyCell;
}

export function canProcessPurchaseOrderInventoryEntry(
  order?: GetPurchaseOrdersResponse | null,
): boolean {
  if (!order) return false;
  if (order.status !== PurchaseOrderStatusEnum.Pending.textValue) return false;
  if (
    order.purchase_request?.request_type !==
    PurchaseRequestEnum.Requisition.textValue
  ) {
    return false;
  }
  if (
    order.purchase_request?.destination !==
    PurchaseRequestDestinationEnum.ServiceOrder.textValue
  ) {
    return false;
  }

  return order.requires_inventory_entry === true;
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
        const sender      = row.sent_by_user_information;
        const email       = sender?.email?.trim()         || emptyCell;
        const fullname    = sender?.fullname?.trim()      || emptyCell;
        const pictureUrl  = sender?.picture_url?.trim();

        return (
          <Avatar
            label={fullname}
            description={email}
            pictureUrl={pictureUrl}
          />
        );
      },
    },
    {
      key: "request_type",
      label: "Tipo de solicitud",
      render: (row) => {
        const requestType = row.purchase_request?.request_type;
        const variant =
          purchaseRequestTypeBadgeVariants[
            requestType as keyof typeof purchaseRequestTypeBadgeVariants
          ] ?? purchaseRequestTypeBadgeVariants.default;

        return (
          <Badges
            label={variant.label || requestType || emptyCell}
            color={variant.badgeColor}
          />
        );
      },
    },
    {
      key: "status",
      label: "Estado de orden",
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
      key: "priority_level",
      label: "Nivel Prioridad",
      render: (row) => {
          const badge = getPriorityLevelBadge(
            row.purchase_request?.priority_level,
          );
          
          return <Badges label={badge.label} color={badge.color} />;
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

        if (canProcessPurchaseOrderInventoryEntry(row)) {
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
