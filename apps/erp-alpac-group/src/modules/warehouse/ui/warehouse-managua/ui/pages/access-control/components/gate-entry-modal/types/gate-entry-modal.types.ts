import type { DocumentType } from "@app/core/enums/document.enum";

export type GateEntryFormValues = {
  countryOfOrigin: string;
  customBranchId: string;
  plateNumber: string;
  trailerChassis: string;
  driverName: string;
  driverLicense: string;
  transportista: string;
  sealNumber: string;
  sealEvidence: { file: File | null; imageBase64: string; contentType: string }[];
  transportUnitId: string;
  customsDeclarationNumber: string;
  totalWeight: string;
  packages: string;
  product?: string;
  observations?: string;
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
  sealNumber: "",
  sealEvidence: [],
  transportUnitId: "",
  customsDeclarationNumber: "",
  totalWeight: "",
  packages: "",
  product: "",
  observations: "",
  containerNumber: "",
  ducas: [{ value: "" }],
};
