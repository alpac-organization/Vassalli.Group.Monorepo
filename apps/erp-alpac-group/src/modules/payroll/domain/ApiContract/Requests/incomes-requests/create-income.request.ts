/**
 * Este payload es para crear ingresos en la nomina
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

  /**
   * Payload de horas extra
   */
  overtime_income_data?: CreateIncomeOvertimeRequest[];

  /**
   * Payload de horas extras
   */
  overtime_payload?: CreateIncomeOvertimeRequest;

  /**
   * Payload de comisiones
   */
  commissions_payload?: CreateIncomeCommissionRequest;

  /**
   * Payload de bonos
   */

  bonus_payload?: CreateIncomeBonusRequest;
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

export interface CreateIncomeBonusRequest {

  /**
   * Código de la moneda
   */
  currency: number;

  /**
   * Monto del bono
   */
  bonus_amount: number;

  /**
   * Número de identificación del colaborador
   */
  identification_number?: string;

}
