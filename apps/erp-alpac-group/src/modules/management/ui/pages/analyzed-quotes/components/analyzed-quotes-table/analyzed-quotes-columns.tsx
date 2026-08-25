import { Badges, ContextMenu, type TableColumn } from "@alpac/design-system";
import type { RequisitionManagementReviewDto } from "@app/modules/management/domain/ApiContract/responses/get-requisition-management-reviews";
import {
  getInitials,
  getManagementReviewStatusBadge,
} from "@app/modules/management/ui/pages/analyzed-quotes/components/analyzed-quotes-table/utils/analyzed-quotes.utils";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";

const contextMenuButton =
  "rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";

export function getAnalyzedQuotesColumns(
  onViewDetail?: (row: RequisitionManagementReviewDto) => void,
  onSendTo?: (row: RequisitionManagementReviewDto) => void,
): TableColumn<RequisitionManagementReviewDto>[] {
  return [
    {
      key: "code",
      label: "Código",
      render: (row) => row.purchase_request?.code?.trim() || "—",
    },
    {
      key: "enviado_por",
      label: "Enviado por",
      render: (row) => {
        const sender = row.sent_by_user_information;
        const fullname = sender?.fullname?.trim() || "—";
        const pictureUrl = sender?.picture_url?.trim();
        const initials = getInitials(sender?.fullname);

        return (
          <div className="flex items-center gap-3 min-w-0">
            {pictureUrl ? (
              <img
                src={pictureUrl}
                alt={fullname}
                className="h-9 w-9 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700 dark:bg-slate-600 dark:text-white">
                {initials}
              </span>
            )}
            <span className="truncate text-slate-900 dark:text-white">
              {fullname}
            </span>
          </div>
        );
      },
    },
    {
      key: "email",
      label: "Email",
      render: (row) => row.sent_by_user_information?.email?.trim() || "—",
    },
    {
      key: "area",
      label: "Área",
      render: (row) =>
        row.sent_by_user_information?.work_area_information?.work_area_name?.trim() ||
        "—",
    },
    {
      key: "fecha",
      label: "Fecha",
      render: (row) => formatDateToSpanishWords(row.sent_to_review_at),
    },
    {
      key: "status",
      label: "Estado",
      render: (row) => {
        const badge = getManagementReviewStatusBadge(row.status);
        return <Badges label={badge.label} color={badge.color} />;
      },
    },
    {
      key: "comment",
      label: "Comentario",
      render: (row) => row.comments || "—",
    },
    {
      key: "actions",
      label: "Acciones",
      render: (row) => (
        <ContextMenu
          items={[
            {
              label: "Ver detalle",
              onClick: () => onViewDetail?.(row),
            },
            /* {
              label: "Enviar a revisión",
              onClick: () => onSendTo?.(row),
            }, */
          ]}
          triggerClassName={contextMenuButton}
        />
      ),
    },
  ];
}
