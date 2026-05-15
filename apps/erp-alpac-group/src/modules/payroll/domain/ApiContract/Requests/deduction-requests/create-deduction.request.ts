/* {
   "collaborator_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
   "description": "string",
   "deduction_type": "Loans",
   "purisima_payload": {
      "amount": 0
   },
   "advance_salary_payload": {
      "amount": 0,
      "currency": "NIO"
   },
   "late_arrivals_payload": {
      "total_minutes": 0
   }
} */

/**
 * @description Esta interfaz representa la estructura de la solicitud de creación de una deducción.
 */
export interface CreateDeductionRequest {
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
   * @property {LateArrivalsPayload} late_arrivals_payload - Payload de la deducción por tardanzas.
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
interface LateArrivalsPayload {
  /*
   * @property {string} identification_number - Identificación del colaborador.
   */
  identification_number: string;

  /**
   * @property {number} total_minutes - Total de minutos de tardanza.
   */
  total_minutes: number;
}
