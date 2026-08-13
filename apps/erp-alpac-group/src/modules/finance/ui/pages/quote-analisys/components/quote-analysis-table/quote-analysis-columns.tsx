import { Badges, type TableColumn } from "@alpac/design-system";
import type { RequisitionAccountingReviewDto } from "@app/modules/finance/domain/ApiContract/responses/get-quotes-analysis";
import {
  getInitials,
  getStatusBadge,
} from "@app/modules/finance/ui/pages/quote-analisys/components/quote-analysis-table/utils/quote-analysis.utils";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";

export function getQuoteAnalysisColumns(): TableColumn<RequisitionAccountingReviewDto>[] {
  return [
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
        const badge = getStatusBadge(row.status);
        return <Badges label={badge.label} color={badge.color} />;
      },
    },
    {
      key: "comment",
      label: "Comentario",
      render: (row) => row.comments || "—",
    },
  ];
}
