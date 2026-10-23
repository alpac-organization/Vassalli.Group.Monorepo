import { memo, useMemo } from "react";
import {
  Badges,
  ContextMenu,
  DataTable,
  Pagination,
  type TableColumn,
} from "@alpac/design-system";
import {
  SupplierExclusiveStatusEnum,
} from "@app/core/enums/supplier-exclusive-status.enum";
import { resolveSupplierTypeLabel } from "@app/core/enums/supplier-type.enum";
import type { GetSuppliersResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/get-suppliers-response";
import {
  constitutionTypeBadgeVariants,
  identificationTypeBadgeVariants,
} from "@app/modules/purchasing/ui/pages/supplier/supplier.variants";
import { isValidateValue } from "@app/shared/utils/values.utils";
import type { SupplierRowActionsProps, SupplierTableProps } from "@app/modules/purchasing/ui/pages/supplier/components/supplier-table/types/supplier-table.types";
import { contextMenuButton, exclusiveStatusBadges } from "@app/modules/purchasing/ui/pages/supplier/components/supplier-table/constants/supplier-table.constants";


const SupplierRowActions = memo(function SupplierRowActions({
  row,
  isAdministrator,
  onEdit,
  onViewDetails,
  onViewProducts,
  onManageExclusivity,
}: SupplierRowActionsProps) {
  const canManageExclusivity =
    isAdministrator &&
    row.exclusive_status ===
      SupplierExclusiveStatusEnum.PendingReview.stringValue;

  const items = [
    { label: "Editar", onClick: () => onEdit(row) },
    { label: "Ver detalle", onClick: () => onViewDetails(row) },
    { label: "Ver productos", onClick: () => onViewProducts(row) },
  ];

  if (canManageExclusivity) {
    items.push({
      label: "Gestionar exclusividad",
      onClick: () => onManageExclusivity(row),
    });
  }

  return <ContextMenu triggerClassName={contextMenuButton} items={items} />;
});

export const SupplierTable = memo(function SupplierTable({
  suppliers,
  totalRecords,
  currentPage,
  pageSize,
  isFetching,
  isAdministrator,
  onPageChange,
  onEdit,
  onViewDetails,
  onViewProducts,
  onManageExclusivity,
}: SupplierTableProps) {
  const columns: TableColumn<GetSuppliersResponse>[] = useMemo(
    () => [
      {
        key: "supplier_legal_name",
        label: "Razón social / Nombre comercial",
        render(row: GetSuppliersResponse) {
          const legalName = row.supplier_legal_name ?? "—";
          const commercialName = row.commercial_name?.trim();

          return (
            <div className="flex flex-col">
              <span className="font-medium text-slate-900 dark:text-white">
                {legalName}
              </span>
              {commercialName ? (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {commercialName}
                </span>
              ) : null}
            </div>
          );
        },
      },
      {
        key: "supplier_type",
        label: "Tipo",
        render(row: GetSuppliersResponse) {
          return resolveSupplierTypeLabel(row.supplier_type);
        },
      },
      {
        key: "constitution_type",
        label: "Tipo de constitución",
        render(row: GetSuppliersResponse) {
          if (!isValidateValue(row.constitution_type)) {
            return "—";
          }

          const propValue =
            constitutionTypeBadgeVariants[
              row.constitution_type as keyof typeof constitutionTypeBadgeVariants
            ] ?? constitutionTypeBadgeVariants.default;

          return (
            <Badges label={propValue.label} color={propValue.badgeColor} />
          );
        },
      },
      {
        key: "identification_type",
        label: "Tipo de identificación",
        render(row: GetSuppliersResponse) {
          if (!isValidateValue(row.identification_type)) {
            return "—";
          }

          const propValue =
            identificationTypeBadgeVariants[
              row.identification_type as keyof typeof identificationTypeBadgeVariants
            ] ?? identificationTypeBadgeVariants.default;

          return (
            <Badges label={propValue.label} color={propValue.badgeColor} />
          );
        },
      },
      { key: "identification_number", label: "Número de identificación" },
      {
        key: "exclusive_status",
        label: "Estado de exclusividad",
        render(row: GetSuppliersResponse) {
          const status =
            row.exclusive_status ??
            SupplierExclusiveStatusEnum.None.stringValue;
          const propValue =
            exclusiveStatusBadges[status] ?? exclusiveStatusBadges.None;

          return (
            <Badges label={propValue.label} color={propValue.badgeColor} />
          );
        },
      },
      {
        key: "actions",
        label: "Acciones",
        render: (row: GetSuppliersResponse) => (
          <SupplierRowActions
            row={row}
            isAdministrator={isAdministrator}
            onEdit={onEdit}
            onViewDetails={onViewDetails}
            onViewProducts={onViewProducts}
            onManageExclusivity={onManageExclusivity}
          />
        ),
      },
    ],
    [
      isAdministrator,
      onEdit,
      onManageExclusivity,
      onViewDetails,
      onViewProducts,
    ],
  );

  return (
    <div className="flex min-w-0 flex-col overflow-x-auto">
      <DataTable
        title="Lista de proveedores"
        data={suppliers}
        columns={columns}
        pagination={
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalRecords={totalRecords}
            onPageChange={onPageChange}
            disabled={isFetching}
          />
        }
      />
    </div>
  );
});
