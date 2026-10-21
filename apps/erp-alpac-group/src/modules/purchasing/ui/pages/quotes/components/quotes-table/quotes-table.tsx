import { useMemo } from "react";
import {
  Badges,
  ContextMenu,
  DataTable,
  Pagination,
  type TableColumn,
} from "@alpac/design-system";
import type { QuotesTableProps } from "@app/modules/purchasing/ui/pages/quotes/components/quotes-table/quotes-table.types";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import type { GetPurchaseRequestResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-response";
import {
  purchaseRequestDestinationBadgeVariants,
  purchaseRequestPriorityBadgeVariants,
} from "@app/modules/purchasing/ui/pages/purchase-requests/purchase-request.variants";
import { PriorityLevelEnum } from "@app/modules/purchasing/domain/enums/purchase-request-priority-level.enum";
import { PurchaseRequestDestinationEnum } from "@app/modules/purchasing/domain/enums/purchase-request-destination.enum";
import { resolvePurchaseRequestStatusBadge } from "@app/modules/purchasing/ui/pages/purchase-requests/utils/resolve-purchase-request-status-badge";

const contextMenuButton =
  "rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";

const buildColumns = (
  onViewDetail: (row: GetPurchaseRequestResponse) => void,
  onSendForReview: (row: GetPurchaseRequestResponse) => void,
): TableColumn<GetPurchaseRequestResponse>[] => [
  { key: "code", label: "Código" },
  {
    key: "request_status",
    label: "Estado",
    render: (row: GetPurchaseRequestResponse) => {
      const badge = resolvePurchaseRequestStatusBadge(row.request_status);
      return <Badges label={badge.label} color={badge.badgeColor} />;
    },
  },
  {
    key: "priority_level",
    label: "Prioridad",
    render: (row: GetPurchaseRequestResponse) => {
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
    render: (row: GetPurchaseRequestResponse) => {
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
    render: (row: GetPurchaseRequestResponse) => {
      return formatDateToSpanishWords(row.request_date ?? "");
    },
  },
  {
    key: "revision_date",
    label: "Fecha de revisión",
    render: (row: GetPurchaseRequestResponse) => {
      return formatDateToSpanishWords(row.revision_date ?? "");
    },
  },
  {
    key: "actions",
    label: "Acciones",
    render: (row: GetPurchaseRequestResponse) => (
      <ContextMenu
        items={[
          { label: "Enviar a revisión", onClick: () => onSendForReview(row) },
          { label: "Ver detalle", onClick: () => onViewDetail(row) },
        ]}
        triggerClassName={contextMenuButton}
      />
    ),
  },
];

export function QuotesTable({
  data,
  currentPage,
  pageSize,
  totalRecords,
  onPageChange,
  onViewDetail,
  onSendForReview,
  isPaginationDisabled = false,
}: QuotesTableProps) {
  const columns = useMemo(
    () => buildColumns(onViewDetail, onSendForReview),
    [onViewDetail, onSendForReview],
  );

  return (
    <DataTable
      title="Historial de cotizaciones"
      data={data}
      columns={columns}
      pagination={
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalRecords={totalRecords}
          onPageChange={onPageChange}
          disabled={isPaginationDisabled}
        />
      }
    />
  );
}
