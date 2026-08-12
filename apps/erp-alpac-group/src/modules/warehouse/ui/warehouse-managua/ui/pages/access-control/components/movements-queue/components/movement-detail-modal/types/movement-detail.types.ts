import type { ReceptionEntranceDetail } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control-detail";
import type { Path } from "react-hook-form";

export type MovementDetailFormValues = {
  status: string;
  is_consolidated: string;
  document_type: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  duration_formatted: string;
  processed_by_user_name: string;
  plate_number: string;
  driver_name: string;
  driver_license: string;
  trailer_chassis: string;
  transportista: string;
  transport_unit_id: string;
  transport_unit_name: string;
  seal_number: string;
  country_of_origin: string;
  aduana: string;
  customs_decaration_number: string;
  packages: string;
  customer: string;
  product: string;
  container_number: string;
  transport_unit_exit_date: string;
  transport_unit_exit_time: string;
  updated_by_user_name: string;
  updated_date: string;
  updated_time: string;
};

export type MovementDetailModalProps = {
  isOpen: boolean;
  receptionId: string | null;
  detail: ReceptionEntranceDetail | null | undefined;
  isLoading?: boolean;
  onClose: () => void;
  onFieldUpdate: (
    name: Path<MovementDetailFormValues>,
    value: string,
  ) => Promise<void>;
  onDucatUpdate: (ducatId: string, ducatNumber: string) => Promise<void>;
  onDucatAdd?: (ducatNumbers: string[]) => Promise<void>;
};
export const MOVEMENT_DETAIL_DEFAULT_VALUES: MovementDetailFormValues = {
  status: "",
  is_consolidated: "",
  document_type: "",
  start_date: "",
  start_time: "",
  end_date: "",
  end_time: "",
  duration_formatted: "",
  processed_by_user_name: "",
  plate_number: "",
  driver_name: "",
  driver_license: "",
  trailer_chassis: "",
  transportista: "",
  transport_unit_id: "",
  transport_unit_name: "",
  seal_number: "",
  country_of_origin: "",
  aduana: "",
  customs_decaration_number: "",
  packages: "",
  customer: "",
  product: "",
  container_number: "",
  transport_unit_exit_date: "",
  transport_unit_exit_time: "",
  updated_by_user_name: "",
  updated_date: "",
  updated_time: "",
};
