/**
 * Este payload es para crear ingresos en la nomina
 * @example
 * ```json
 * {
 *  "payroll_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *  "type_income_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *  "description": "string",
 *  "identification_number": "string",
 *  "overtime_income_payload": [
 *    { "identification_number": "501", "total_hours": 78.25 }
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
   * Número de identificación
   */
  identification_number: string;

  /**
   * Descripción del ingreso
   */
  description?: string;

  overtime_income_payload?: CreateIncomeOvertimeRequest[];
  /**
   * Payload de horas extra
   */

  /**
   * Payload de comisiones
   */
  commission_income_payload?: CreateIncomeCommissionRequest;
}

export interface CreateIncomeOvertimeRequest {
  /**
   * Monto de horas extra
   */
  identification_number: string;
  total_hours: number;
}

interface CreateIncomeCommissionRequest {
  /**
   * Indica si es porcentaje
   */
  is_percentage?: boolean;

  /**
   * Porcentaje de la comisión
   */
  percentage?: number;

  /**
   * Monto a aplicar porcentaje
   */
  amount?: number;

  /**
   * Código de la moneda
   */
  currency: number;
}
