import {
  Badges,
  ContextMenu,
  type ContextMenuItem,
  type TableColumn,
} from "@alpac/design-system";
import type { PersonnelActionRequestDto } from "@app/modules/payroll/domain/ApiContract/Responses/personnel-action-responses/get-personnel-actions.response";
import { getPersonnelActionScopeLabel } from "@app/modules/payroll/domain/enums/personnel-action-enums/personnel-action-scope.enum";
import {
  getPersonnelActionStatusBadgeColor,
  getPersonnelActionStatusLabel,
  isPersonnelActionApproved,
  isPersonnelActionPending,
} from "@app/modules/payroll/domain/enums/personnel-action-enums/personnel-action-status.enum";
import {
  formatIncreaseValueDisplay,
  getSalaryIncreaseTypeBadgeColor,
  getSalaryIncreaseTypeLabel,
} from "@app/modules/payroll/domain/enums/personnel-action-enums/salary-increase-type.enum";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import dayjs from "dayjs";
import { contextMenuButton } from "../../utils/personnel-actions.constants";

type BuildColumnsParams = {
  onViewDetail: (row: PersonnelActionRequestDto) => void;
  onReview: (row: PersonnelActionRequestDto) => void;
  onApply: (row: PersonnelActionRequestDto) => void;
  canReview: boolean;
  canApply: boolean;
};

export const buildColumns = ({
  onViewDetail,
  onReview,
  onApply,
  canReview,
  canApply,
}: BuildColumnsParams): TableColumn<PersonnelActionRequestDto>[] => [
  {
    key: "request_code",
    label: "Código",
    render: (row) => (
      <span className="font-semibold text-slate-900 dark:text-white">
        {row.request_code}
      </span>
    ),
  },
  {
    key: "scope",
    label: "Alcance",
    render: (row) => (
      <div className="flex flex-col">
        <span className="text-neutral-700 dark:text-neutral-300">
          {getPersonnelActionScopeLabel(row.scope)}
        </span>
        {row.area_name && (
          <span className="text-[11px] font-medium text-alpac-primary-600 dark:text-alpac-primary-400">
            {row.area_name}
          </span>
        )}
      </div>
    ),
  },
  {
    key: "increase_type",
    label: "Modalidad",
    render: (row) => {
      const valueText = formatIncreaseValueDisplay(row.increase_type, row.increase_value);
      return (
        <div className="flex flex-col items-start gap-1">
          <Badges
            label={getSalaryIncreaseTypeLabel(row.increase_type)}
            color="transparent"
            className={getSalaryIncreaseTypeBadgeColor(row.increase_type)}
          />
          {valueText && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {valueText}
            </span>
          )}
        </div>
      );
    },
  },
  {
    key: "effective_date",
    label: "Fecha Efectiva",
    render: (row) => (
      <span className="text-neutral-700 dark:text-neutral-300">
        {formatDateToSpanishWords(row.effective_date?.slice(0, 10)) || "—"}
      </span>
    ),
  },
  {
    key: "total_collaborators",
    label: "Colaboradores",
    render: (row) => (
      <span className="text-center font-medium text-neutral-800 dark:text-neutral-200">
        {row.total_collaborators}
      </span>
    ),
  },
  {
    key: "justification",
    label: "Justificación",
    render: (row) => (
      <p
        className="max-w-[260px] truncate text-neutral-600 dark:text-neutral-300"
        title={row.justification}
      >
        {row.justification}
      </p>
    ),
  },
  {
    key: "requested_by_user_name",
    label: "Solicitado Por",
    render: (row) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium text-slate-900 dark:text-white">
          {row.requested_by_user_name || "—"}
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {row.requested_at ? dayjs(row.requested_at).format("DD/MM/YYYY HH:mm") : ""}
        </span>
      </div>
    ),
  },
  {
    key: "status",
    label: "Estado",
    render: (row) => (
      <Badges
        label={getPersonnelActionStatusLabel(row.status)}
        color="transparent"
        className={getPersonnelActionStatusBadgeColor(row.status)}
      />
    ),
  },
  {
    key: "actions",
    label: "Acciones",
    render: (row) => {
      const isPending = isPersonnelActionPending(row.status);
      const isApproved = isPersonnelActionApproved(row.status);

      const items: ContextMenuItem[] = [
        {
          label: "Ver detalle",
          onClick: () => onViewDetail(row),
        },
      ];

      if (isPending && canReview) {
        items.push({
          label: "Revisar solicitud",
          onClick: () => onReview(row),
        });
      }

      if (isApproved && canApply) {
        items.push({
          label: "Aplicar en nómina",
          onClick: () => onApply(row),
        });
      }

      return <ContextMenu items={items} triggerClassName={contextMenuButton} />;
    },
  },
];
