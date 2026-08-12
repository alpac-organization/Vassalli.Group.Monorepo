import { Badges, type TableColumn } from "@alpac/design-system";
import type { QuoteDetails } from "@app/modules/finance/domain/ApiContract/responses/get-quotes-analysis";
import {
  getInitials,
  getStatusBadge,
} from "@app/modules/finance/ui/pages/quote-analisys/components/quote-analysis-table/utils/quote-analysis.utils";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";

export function getQuoteAnalysisColumns(): TableColumn<QuoteDetails>[] {
  return [
    {
      key: "solicitud",
      label: "Solicitud",
      render: (row) => (
        <div className="min-w-0">
          <p className="m-0 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {row.purchase_request?.code || "—"}
          </p>
        </div>
      ),
    },
    {
      key: "enviado_por",
      label: "Enviado por",
      render: (row) => {
        const creator = row.purchase_request?.creator_user_information;
        const fullname = creator?.fullname?.trim() || "—";
        const pictureUrl = creator?.picture_url?.trim();
        const initials = getInitials(creator?.fullname);

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
      key: "fecha",
      label: "Fecha",
      render: (row) =>
        formatDateToSpanishWords(row.purchase_request?.request_date),
    },
    {
      key: "status",
      label: "Estado",
      render: (row) => {
        const badge = getStatusBadge(row.status);
        return <Badges label={badge.label} color={badge.color} />;
      },
    },
  ];
}
