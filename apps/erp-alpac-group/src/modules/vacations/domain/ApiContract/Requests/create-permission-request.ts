export interface CreatePermissionRequest {
  /**
   * Identificador único de la empresa
   */
  company_id: string;
  /**
   * Codigo del modulo de vacaciones
   */
  module_code: string;
  /**
   * Numero de identificacion del colaborador
   */
  identification_number: string;
  /**
   * Fecha de inicio de las vacaciones
   */
  start_date: string;
  /**
   * Fecha de fin
   */
  end_date: string;
  /**
   * Hora de inicio
   */
  start_time?: string | null;
  /**
   * Hora de fin
   */
  end_time?: string | null;
  /**
   * Tipo de permiso (valor numérico del enum)
   */
  permit_application_type: number;
  /**
   * Descripcion de la solicitud de vacaciones
   */
  description: string;
}
export type PermissionType =
  | "Vacation"
  | "MedicalAppointment"
  | "CompensatoryTime"
  | "PaidLeave"
  | "UnpaidLeave"
  | "SpecialLeave";
