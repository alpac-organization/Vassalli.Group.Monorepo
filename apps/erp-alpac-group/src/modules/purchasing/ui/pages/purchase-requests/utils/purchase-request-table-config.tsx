import {
  Badges,
  ContextMenu,
  type ContextMenuItem,
  type TableColumn,
} from "@alpac/design-system";
import type { GetPurchaseRequestResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-response";
import {
  purchaseRequestDestinationBadgeVariants,
  purchaseRequestPriorityBadgeVariants,
  purchaseRequestStatusBadgeVariants,
} from "../purchase-request.variants";
import { PurchaseRequestStatusEnum } from "@app/modules/purchasing/domain/enums/purchase-request-status.enum";
import { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import { isValidateValue } from "@app/shared/utils/values.utils";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import { PriorityLevelEnum } from "@app/modules/purchasing/domain/enums/purchase-request-priority-level.enum";
import { PurchaseRequestDestinationEnum } from "@app/modules/purchasing/domain/enums/purchase-request-destination.enum";

const contextMenuButton =
  "rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";

type contexMenuOptions = (row: GetPurchaseRequestResponse) => ContextMenuItem[];

export function getPurchaseRequestColumnConfig(
  contexMenuOptions: contexMenuOptions,
  _purchaseRequestType: PurchaseRequestEnum,
): TableColumn<GetPurchaseRequestResponse>[] {
  return [
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
      key: "priority_level",
      label: "Prioridad",
      render(row: GetPurchaseRequestResponse) {
        const variant =
          purchaseRequestPriorityBadgeVariants[
            row.priority_level as keyof typeof purchaseRequestPriorityBadgeVariants
          ] ?? purchaseRequestPriorityBadgeVariants.default;

        const priorityLabel =
          Object.values(PriorityLevelEnum).find(
            (priority) => priority.textValue === row.priority_level,
          )?.label ?? row.priority_level;

        return <Badges label={priorityLabel} color={variant.badgeColor} />;
      },
    },
    {
      key: "destination",
      label: "Destino",
      render(row: GetPurchaseRequestResponse) {
        const variant =
          purchaseRequestDestinationBadgeVariants[
            row.destination as keyof typeof purchaseRequestDestinationBadgeVariants
          ] ?? purchaseRequestDestinationBadgeVariants.default;

        const destinationLabel =
          Object.values(PurchaseRequestDestinationEnum).find(
            (destination) => destination.textValue === row.destination,
          )?.label ?? row.destination;

        return <Badges label={destinationLabel} color={variant.badgeColor} />;
      },
    },
    {
      key: "request_date",
      label: "Fecha de Solicitud",
      render(row: GetPurchaseRequestResponse) {
        if (!isValidateValue(row?.request_date)) return "—";
        return formatDateToSpanishWords(row?.request_date ?? "");
      },
    },
    {
      key: "revision_date",
      label: "Fecha de revisión",
      render: (row: GetPurchaseRequestResponse) => {
        if (!isValidateValue(row?.revision_date)) return "—";
        return formatDateToSpanishWords(row?.revision_date ?? "");
      },
    },
    {
      key: "actions",
      label: "Acciones",
      render: (row: GetPurchaseRequestResponse) => (
        <ContextMenu
          items={contexMenuOptions(row)}
          triggerClassName={contextMenuButton}
        />
      ),
    },
  ] satisfies TableColumn<GetPurchaseRequestResponse>[];
}
