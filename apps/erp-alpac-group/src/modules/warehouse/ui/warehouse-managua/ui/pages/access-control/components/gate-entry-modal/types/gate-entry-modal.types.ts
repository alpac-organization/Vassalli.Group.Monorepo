import type { DocumentType } from "@app/core/enums/document.enum";
export type GateEntryFormValues = {
  countryOfOrigin: string;
  customBranchId: string;
  plateNumber: string;
  trailerChassis: string;
  driverName: string;
  driverLicense: string;
  transportista: string;
  consignee: string;
  sealNumber: string;
  sealEvidence: { file: File | null; imageBase64: string; contentType: string }[];
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
};

export const GATE_ENTRY_DEFAULT_VALUES: GateEntryFormValues = {
  countryOfOrigin: "",
  customBranchId: "",
  plateNumber: "",
  trailerChassis: "",
  driverName: "",
  driverLicense: "",
  transportista: "",
  consignee: "",
  sealNumber: "",
  sealEvidence: [],
  transportUnitId: "",
  customsDeclarationNumber: "",
  packages: "",
  customer: "",
  product: "",
  containerNumber: "",
  ducas: [{ value: "" }],
};
