import type { DocumentType } from "@app/core/enums/document.enum";
import type { VehicleItem } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-vehicles";

export type GateEntryFormValues = {
  countryOfOrigin: string;
  aduana: string;
  plateNumber: string;
  trailerChassis: string;
  driverName: string;
  driverLicense: string;
  transportista: string;
  consignee: string;
  sealNumber: string;
  medio: string;
  transportUnitId: string;
  customsDeclarationNumber: string;
  packages: string;
  customer: string;
  product: string;
  containerNumber: string;
  ducas: { value: string }[];
};

export type GateEntryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GateEntryFormValues, documentType: DocumentType) => void;
  isSubmitting?: boolean;
  vehicleOptions?: VehicleItem[];
};

export const GATE_ENTRY_DEFAULT_VALUES: GateEntryFormValues = {
  countryOfOrigin: "",
  aduana: "",
  plateNumber: "",
  trailerChassis: "",
  driverName: "",
  driverLicense: "",
  transportista: "",
  consignee: "",
  sealNumber: "",
  medio: "Furgón",
  transportUnitId: "",
  customsDeclarationNumber: "",
  packages: "",
  customer: "",
  product: "",
  containerNumber: "",
  ducas: [{ value: "" }],
};
