import type { CreateLotsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-lots-req";

export interface LotModalProps {
  isOpen: boolean;
  sectionId: string;
  onClose: () => void;
  onSubmit?: (data: CreateLotsRequest) => void;
}

export type LotGroupFormValues = {
  mode: "codes" | "range";
  codes_text?: string;
  code_prefix?: string;
  start_number?: string;
  count?: string;
  width_metres?: string;
  length_metres?: string;
  nominal_rows?: string;
  nominal_columns?: string;
  allows_stacking: boolean;
  status: number;
  unavailable_reason?: string;
};

export type FormValues = {
  groups: LotGroupFormValues[];
};
