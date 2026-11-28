import { Badges, Button, type TableColumn } from "@alpac/design-system";
import type { DeductionDto } from "@app/modules/payroll/domain/ApiContract/Responses/deduction-responses/get-deductions.response";
import {
  getDeductionStatusBadgeColor,
  getDeductionStatusLabel,
} from "@app/modules/payroll/domain/enums/deduction-enums/deduction-status.enum";
import { getDeductionTypeLabel } from "@app/modules/payroll/domain/enums/deduction-enums/deduction-type.enum";

export const buildColumns = (
  onViewDetail: (row: DeductionDto) => void,
): TableColumn<DeductionDto>[] => [
  {
    key: "collaborato_fullname",
    label: "Nombre de Colaborador",
    render: (row) => row.collaborato_fullname?.trim() || "—",
  },
  {
    key: "type",
    label: "Tipo Deducción",
    render: (row) => (
      <span className="text-neutral-700 dark:text-neutral-300">
        {getDeductionTypeLabel(row.type)}
      </span>
    ),
  },
  {
    key: "status",
    label: "Estado",
    render: (row) => (
      <div className="flex flex-wrap items-center gap-1.5">
        <Badges
          label={getDeductionStatusLabel(row.status)}
          color="transparent"
          className={getDeductionStatusBadgeColor(row.status)}
        />
        {row.child_support_detail && (
          <Badges
            label={
              row.child_support_detail.has_official_letter
                ? "Con Oficio"
                : (row.held_payments_count ?? 0) > 0
                  ? `Sin Oficio (${row.held_payments_count} ret.)`
                  : "Sin Oficio — Cheque Retenido"
            }
            color="transparent"
            className={
              row.child_support_detail.has_official_letter
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                : "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200"
            }
          />
        )}
      </div>
    ),
  },
  {
    key: "actions",
    label: "Acciones",
    render: (row: DeductionDto) => (
      <Button
        label="Ver Detalle"
        size="small"
        className="text-[13px]! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
        onClick={() => onViewDetail(row)}
      />
    ),
  },
];
