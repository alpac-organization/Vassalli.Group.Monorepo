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
  isSubmitting?: boolean;
};

export const RECEPTION_TRANSPORT_MEDIA = [
  { value: "Furgón", label: "Furgón" },
  { value: "Trailer", label: "Trailer" },
] as const;

export const DISPATCH_TRANSPORT_MEDIA = [
  { value: "Camión", label: "Camión" },
  { value: "Vehículo liviano", label: "Vehículo liviano" },
  { value: "Vehículo no motorizado", label: "Vehículo no motorizado" },
] as const;

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
  ducas: [{ value: "" }],
};
