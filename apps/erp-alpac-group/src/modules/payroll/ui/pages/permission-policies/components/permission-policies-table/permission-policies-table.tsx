import { Badges, DataTable, type TableColumn } from "@alpac/design-system";
import type { GetPermissionPoliciesResponse } from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/get-permission-policies";
import type { PermissionPoliciesTableProps } from "./permission-policies-table.types";
import {
  booleanBadgeColor,
  booleanBadgeLabel,
} from "@app/modules/payroll/ui/pages/permission-policies/components/permission-policies-table/utils/boolean-badge.utils";

const columns: TableColumn<GetPermissionPoliciesResponse>[] = [
  {
    key: "permit_application_type_label",
    label: "Tipo ",
    render: (row) => row.permit_application_type_label || "—",
  },
  {
    key: "permit_beneficiary_label",
    label: "Alcance",
    render: (row) => row.permit_beneficiary_label || "—",
  },
  {
    key: "is_active",
    label: "Estado",
    render: (row) => (
      <Badges
        label={booleanBadgeLabel(row.is_active)}
        color={booleanBadgeColor(row.is_active)}
      />
    ),
  },
  {
    key: "family_relationship_label",
    label: "Parentesco",
    render: (row) => row.family_relationship_label || "—",
  },
  {
    key: "max_amount_days",
    label: "Días máximos",
    render: (row) =>
      row.max_amount_days == null ? "—" : Number(row.max_amount_days),
  },
  {
    key: "min_evidence_count",
    label: "Evidencia mín.",
    render: (row) => row.min_evidence_count ?? "—",
  },
  {
    key: "max_evidence_count",
    label: "Evidencia máx.",
    render: (row) => row.max_evidence_count ?? "—",
  },
  {
    key: "required_approval_steps",
    label: "Pasos de aprobación",
    render: (row) => row.required_approval_steps ?? "—",
  },
  // {
  //   key: "is_paid",
  //   label: "Pagado",
  //   render: (row) => (
  //     <Badges
  //       label={booleanBadgeLabel(row.is_paid)}
  //       color={booleanBadgeColor(row.is_paid)}
  //     />
  //   ),
  // },
  // {
  //   key: "consumes_vacation_balance",
  //   label: "Consume vacaciones",
  //   render: (row) => (
  //     <Badges
  //       label={booleanBadgeLabel(row.consumes_vacation_balance)}
  //       color={booleanBadgeColor(row.consumes_vacation_balance)}
  //     />
  //   ),
  // },
];

export function PermissionPoliciesTable({
  data,
}: PermissionPoliciesTableProps) {
  return (
    <DataTable
      title="Políticas de permisos"
      data={data}
      columns={columns}
      getRowKey={(row) => row.permit_type_policy_id}
    />
  );
}
