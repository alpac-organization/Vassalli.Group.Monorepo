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
  [AssignmentOperationalStatus.None]: "Ninguno",
  [AssignmentOperationalStatus.Pending]: "Pendiente",
  [AssignmentOperationalStatus.InProgress]: "En Proceso",
  [AssignmentOperationalStatus.OnHold]: "En Espera",
  [AssignmentOperationalStatus.Downloaded]: "Descargado",
};

export const MachineryType = {
  None: 0,
  Forklift: 1,
} as const;

export type MachineryType =
  (typeof MachineryType)[keyof typeof MachineryType];

export const MachineryTypeLabels: Record<MachineryType, string> = {
  [MachineryType.None]: "Maquinaria",
  [MachineryType.Forklift]: "Montacargas",
};

export const AssignmentCollaboratorRole = {
  WarehouseAssistant: "WarehouseAssistant",
  ForkliftOperator: "ForkliftOperator",
} as const;

export type AssignmentCollaboratorRole =
  (typeof AssignmentCollaboratorRole)[keyof typeof AssignmentCollaboratorRole];

export const AssignmentCollaboratorRoleLabels: Record<
  AssignmentCollaboratorRole,
  string
> = {
  [AssignmentCollaboratorRole.WarehouseAssistant]: "Auxiliar de Bodega",
  [AssignmentCollaboratorRole.ForkliftOperator]: "Operador de Montacargas",
};

export const AssignmentCollaboratorRoleOptions = [
  {
    value: AssignmentCollaboratorRole.WarehouseAssistant,
    label:
      AssignmentCollaboratorRoleLabels[
        AssignmentCollaboratorRole.WarehouseAssistant
      ],
  },
  {
    value: AssignmentCollaboratorRole.ForkliftOperator,
    label:
      AssignmentCollaboratorRoleLabels[
        AssignmentCollaboratorRole.ForkliftOperator
      ],
  },
];

