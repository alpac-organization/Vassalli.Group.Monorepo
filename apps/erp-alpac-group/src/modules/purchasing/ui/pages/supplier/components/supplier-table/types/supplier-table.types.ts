import type { GetSuppliersResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/get-suppliers-response";

export type SupplierRowAction = (row: GetSuppliersResponse) => void;

export type SupplierRowActionsProps = {
  row: GetSuppliersResponse;
  isAdministrator: boolean;
  onEdit: SupplierRowAction;
  onViewDetails: SupplierRowAction;
  onViewProducts: SupplierRowAction;
  onManageExclusivity: SupplierRowAction;
};

export type SupplierTableProps = {
  suppliers: GetSuppliersResponse[];
  totalRecords: number;
  currentPage: number;
  pageSize: number;
  isFetching: boolean;
  isAdministrator: boolean;
  onPageChange: (page: number) => void;
  onEdit: SupplierRowAction;
  onViewDetails: SupplierRowAction;
  onViewProducts: SupplierRowAction;
  onManageExclusivity: SupplierRowAction;
};