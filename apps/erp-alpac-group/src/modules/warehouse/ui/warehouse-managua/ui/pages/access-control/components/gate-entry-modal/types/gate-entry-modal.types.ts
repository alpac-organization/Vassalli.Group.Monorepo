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
  ducas: { value: string }[];
};

export type GateEntryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GateEntryFormValues) => void;
};

export const GATE_ENTRY_DEFAULT_VALUES: GateEntryFormValues = {
  countryOfOrigin: "Costa Rica",
  aduana: "Peñas Blancas",
  plateNumber: "",
  trailerChassis: "",
  driverName: "",
  driverLicense: "",
  transportista: "",
  consignee: "",
  sealNumber: "",
  medio: "Terrestre",
  ducas: [{ value: "" }],
};

export const GATE_ENTRY_STEPS = [
  "Datos Vehículo",
  "Documentos (DUCAs)",
] as const;
