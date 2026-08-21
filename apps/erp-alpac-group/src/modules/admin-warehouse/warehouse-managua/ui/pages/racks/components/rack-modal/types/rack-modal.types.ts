import type { CreateRacksRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-racks-req";

export interface RackModalProps {
  isOpen: boolean;
  sectionId: string;
  onClose: () => void;
  onSubmit?: (data: CreateRacksRequest) => void;
}

export type RackLevelFormValues = {
  level_number?: string;
  racks_count?: string;
  width_metres?: string;
  length_metres?: string;
  height_metres?: string;
  usage_profile: number;
  max_pulleys?: string;
  status: number;
  unavailable_reason?: string;
};

export type FormValues = {
  shelf_code: string;
  starting_deposit_number?: string;
  levels: RackLevelFormValues[];
};
