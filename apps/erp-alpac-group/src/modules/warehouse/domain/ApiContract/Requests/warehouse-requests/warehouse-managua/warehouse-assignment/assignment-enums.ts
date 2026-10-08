export const DestinationType = {
  None: 0,
  Warehouse: 1,
  CustomYard: 2,
  CustomSheld: 3,
} as const;

export type DestinationType =
  (typeof DestinationType)[keyof typeof DestinationType];

export const DestinationTypeLabels: Record<DestinationType, string> = {
  [DestinationType.None]: "Ninguno",
  [DestinationType.Warehouse]: "Almacén",
  [DestinationType.CustomYard]: "Patio Aduanero",
  [DestinationType.CustomSheld]: "Galerón Aduanero",
};

export const AssignmentOperationalStatus = {
  None: 0,
  Pending: 1,
  InProgress: 2,
  OnHold: 3,
  Downloaded: 4,
} as const;

export type AssignmentOperationalStatus =
  (typeof AssignmentOperationalStatus)[keyof typeof AssignmentOperationalStatus];

export const AssignmentOperationalStatusLabels: Record<
  AssignmentOperationalStatus,
  string
> = {
  [AssignmentOperationalStatus.None]: "Sin Estado",
  [AssignmentOperationalStatus.Pending]: "Pendiente",
  [AssignmentOperationalStatus.InProgress]: "En Proceso",
  [AssignmentOperationalStatus.OnHold]: "En Espera",
  [AssignmentOperationalStatus.Downloaded]: "Descargado",
};

