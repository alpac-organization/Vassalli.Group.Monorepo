/**
 * Este payload es para crear ingresos en la nomina
 * @example
 * ```json
 * {
 *  "payroll_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *  "branch_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *  "type_income_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *  "description": "string",
 *  "commissions_payload": {
 *    "currency": 1,
 *    "commission_amount": 1500.5,
 *    "identification_number": "001-123456-0001A"
 *  },
 *  "overtime_income_data": [
 *    { "identification_number": "501", "amount_hours": 78.25 }
 *  ]
 * }
 * ```
 */
export interface CreateIncomeRequest {
  /**
   * Identificador único de la empresa
   */
  company_id: string;

  /**
   * Código del módulo
   */
  module_code: string;

  /**
   * Identificador único de la nomina
   */
  payroll_id: string;

  /**
   * Identificador único del tipo de ingreso
   */
  type_income_id: string;

  /**
   * Identificador único de la sucursal
   */
  branch_id: string;

  /**
   * Número de identificación (comisión u otros ingresos individuales)
   */
  identification_number?: string;

  /**
   * Descripción del ingreso
   */
  description?: string;

  overtime_income_data?: CreateIncomeOvertimeRequest[];
  /**
   * Payload de horas extra
   */

  /**
   * Payload de comisiones
   */
  commissions_payload?: CreateIncomeCommissionRequest;
}

export interface CreateIncomeOvertimeRequest {
  /**
   * Monto de horas extra
   */
  identification_number: string;
  /**
   * Monto de horas extra
   */
  amount_hours: number;
}

export interface CreateIncomeCommissionRequest {
  /**
   * Código de la moneda
   */
  currency: number;

  /**
   * Monto de la comisión
   */
  commission_amount: number;

  /**
   * Número de identificación del colaborador
   */
  identification_number?: string;
}
