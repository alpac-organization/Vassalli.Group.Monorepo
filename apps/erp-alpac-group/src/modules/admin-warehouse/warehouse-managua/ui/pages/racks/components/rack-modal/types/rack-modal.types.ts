import type { RackDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/racks/get-racks-res";

export interface RackModalProps {
  isOpen: boolean;
  warehouseId: string;
  sectionId: string;
  sectionWidth?: number;
  sectionLength?: number;
  rack?: RackDto | null;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export interface RackCreateFormProps {
  warehouseId: string;
  sectionId: string;
  sectionWidth?: number;
  sectionLength?: number;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export interface RackEditFormProps {
  rack: RackDto;
  warehouseId: string;
  sectionId: string;
  sectionWidth?: number;
  sectionLength?: number;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export type RackCreateFormValues = {
  quantity: string | number;
  row_number: string | number;
  level_number: string | number;
  max_pulleys: string | number;
  width: string | number;
  length: string | number;
  height?: string | number | null;
  usage_profile: number | string;
  initial_position_x: string | number;
  initial_position_y: string | number;
  spacing_x: string | number;
};

export type RackEditFormValues = {
  row_number: string | number;
  usage_profile: number;
  status: number;
  unavailable_reason?: string | null;
  width: string | number;
  length: string | number;
  height?: string | number | null;
  position_x: string | number;
  position_y: string | number;
  position_z?: string | number;
  rotation_y?: string | number;
};

export type RackFormValues = RackCreateFormValues & Partial<RackEditFormValues>;
