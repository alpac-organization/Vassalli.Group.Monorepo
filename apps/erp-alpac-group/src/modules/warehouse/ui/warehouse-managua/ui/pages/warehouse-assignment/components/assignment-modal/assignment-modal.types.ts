import type { SelectedAssignmentTarget } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/types/assignment.types";

export type AssignmentWizardStep = "bodega" | "cuadrilla" | "maquinaria" | "confirmar";

export type AssignmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  target: SelectedAssignmentTarget | null;
  companyId: string;
  moduleCode: string;
};

export type WizardState = {
  warehouseAssignmentDone: boolean;
};

