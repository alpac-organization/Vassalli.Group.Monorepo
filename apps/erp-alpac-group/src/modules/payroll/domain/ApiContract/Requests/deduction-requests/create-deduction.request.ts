/* {
   "collaborator_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
   "description": "string",
   "deduction_type": 3,
   "purisima_payload": {
      "amount": 0
   },
   "salary_advance_payload": {
      "amount": 0,
      "currency": "NIO"
   },
   "late_arrivals_payload": [
      { "identification_number": "559", "amount_minutes": 110.03 }
   ]
} */

/**
 * @description Esta interfaz representa la estructura de la solicitud de creación de una deducción.
 */
export interface CreateDeductionRequest {
  /**
   * @property {string} payroll_id - Identificador de la nomina.
   */
  payroll_id: string;

  /**
   * @property {string} company_id - Identificador de la empresa.
   */
  company_id: string;

  /**
   * @property {string} module_code - Código del módulo.
   */
  module_code: string;

  /**
   * @property {string} collaborator_id - Identificador del colaborador.
   */
  collaborator_id: string;

  /**
   * @property {string} deduction_type - Tipo de deducción.
   */
  deduction_type: string;

  /**
   * @property {string} description - Descripción de la deducción.
   */
  description: string;

  /**
   * @property {PurisimaPayload} purisima_payload - Payload de la deducción por purísima.
   */
  purisima_payload?: PurisimaPayload;

  /**
   * @property {SalaryAdvancePayload} salary_advance_payload - Payload de la deducción por adelanto de salario.
   */
  salary_advance_payload?: SalaryAdvancePayload;

  /**
   * @property {LateArrivalsPayload[]} late_arrivals_payload - Payload de la deducción por tardanzas.
   */
  late_arrivals_payload?: LateArrivalsPayload[];
}

/**
 * @description Esta interfaz representa la estructura de un payload de deducción por purísima.
 */
interface PurisimaPayload {
  /**
   * @property {number} amount - Monto de la deducción por purísima.
   */
  amount: number;
}

/**
 * @description Esta interfaz representa la estructura de un payload de deducción por adelanto de salario.
 */
interface SalaryAdvancePayload {
  /**
   * @property {number} amount - Monto del adelanto de salario.
   */
  amount: number;

  /**
   * @property {string} currency - Moneda del adelanto de salario.
   */
  currency: string;
}

/**
 * @description Esta interfaz representa la estructura de un payload de deduccion de llegadas tarde
 */
export interface LateArrivalsPayload {
  /*
   * @property {string} identification_number - Identificación del colaborador.
   */
  identification_number: string;

  /**
   * @property {number} amount_minutes - Total de minutos de tardanza.
   */
  amount_minutes: number;
}

