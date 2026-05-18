interface CreateDeductionBase {
  payroll_id: string;

  company_id: string;

  module_code: string;

  deduction_type: number;
}

export interface CreateLateArrivalsDeductionRequest extends CreateDeductionBase {
  late_arrivals_data: LateArrivalsPayload[];
}

export interface CreatePurisimaDeductionRequest extends CreateDeductionBase {
  purisima_data: PurisimaPayload[];
}

export interface CreateStandardDeductionRequest extends CreateDeductionBase {
  collaborator_id: string;

  description: string;

  salary_advance_payload?: SalaryAdvancePayload;
}

/**

 * @description Payload enviado al API según el tipo de deducción.

 */

export type CreateDeductionRequest =
  | CreateLateArrivalsDeductionRequest
  | CreatePurisimaDeductionRequest
  | CreateStandardDeductionRequest;

/**

 * @description Valores del formulario (campos opcionales según el tipo seleccionado).

 */

export type AddDeductionFormValues = {
  payroll_id: string;

  company_id: string;

  module_code: string;

  deduction_type: number | "";

  collaborator_id?: string;

  description?: string;

  salary_advance_payload?: SalaryAdvancePayload;

  late_arrivals_data?: LateArrivalsPayload[];

  purisima_data?: PurisimaPayload[];
};

interface SalaryAdvancePayload {
  amount: number;

  currency: string;
}

export interface LateArrivalsPayload {
  identification_number: string;

  total_minutes: number;
}

export interface PurisimaPayload {
  identification_number: string;
  amount: number;
}
