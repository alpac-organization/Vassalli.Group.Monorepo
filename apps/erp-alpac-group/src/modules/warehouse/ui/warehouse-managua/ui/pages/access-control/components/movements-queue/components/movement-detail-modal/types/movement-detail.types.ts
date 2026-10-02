import type { ReceptionEntranceDetail } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control-detail";
import type { Path } from "react-hook-form";

export type MovementDetailFormValues = {
  document_type: string;
  country_of_origin: string;
  start_date: string;
  start_time: string;
  customs_decaration_number: string;
  plate_number: string;
  trailer_chassis: string;
  container_number: string;
  driver_name: string;
  driver_license: string;
  transportista: string;
  transport_unit: string;
  seal_number: string;
  custom_branch: string;
  evidence_urls: string[];
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
  onEvidenceUpdate?: (toAdd: string[], toDelete: string[]) => Promise<void>;
};

export const MOVEMENT_DETAIL_DEFAULT_VALUES: MovementDetailFormValues = {
  document_type: "",
  country_of_origin: "",
  start_date: "",
  start_time: "",
  customs_decaration_number: "",
  plate_number: "",
  trailer_chassis: "",
  container_number: "",
  driver_name: "",
  driver_license: "",
  transportista: "",
  transport_unit: "",
  seal_number: "",
  custom_branch: "",
  evidence_urls: [],
};
